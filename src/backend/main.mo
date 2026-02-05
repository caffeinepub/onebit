import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import OutCall "http-outcalls/outcall";

actor {
  type SessionId = Nat;

  type Session = {
    task : Text;
    outcome : Text;
    timestamp : Int;
    owner : Principal;
  };

  public type OpenAIApiKey = Text;

  public type UserProfile = {
    name : Text;
  };

  var apiKey : ?OpenAIApiKey = null;

  let sessions = Map.empty<SessionId, Session>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextSessionId = 0;

  let accessControlState : AccessControl.AccessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    verifyUserPermission(caller);
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    verifyUserPermission(caller);
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func storeApiKey(key : OpenAIApiKey) : async () {
    verifyAdminPermission(caller);
    apiKey := ?key;
  };

  public query ({ caller }) func isApiKeyConfigured() : async Bool {
    verifyUserPermission(caller);
    switch (apiKey) {
      case (null) { false };
      case (?key) { key.size() > 0 };
    };
  };

  public query ({ caller }) func getAllSessions() : async [Session] {
    queryAdminOnly(caller);
    sessions.values().toArray();
  };

  public query ({ caller }) func getSession(sessionId : SessionId) : async ?Session {
    verifyUserPermission(caller);
    switch (sessions.get(sessionId)) {
      case (null) { null };
      case (?session) {
        if (session.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You do not own this session");
        };
        ?session;
      };
    };
  };

  func getApiKeyUnsafe() : OpenAIApiKey {
    switch (apiKey) {
      case (null) { Runtime.trap("OpenAI API key not found or not set") };
      case (?apiKey) {
        if (apiKey.size() == 0) {
          Runtime.trap("OpenAI API key found but empty");
        };
        apiKey;
      };
    };
  };

  public shared ({ caller }) func startSession() : async SessionId {
    verifyUserPermission(caller);
    let sessionId = nextSessionId;
    nextSessionId += 1;

    sessions.add(
      sessionId,
      {
        task = "";
        outcome = "";
        timestamp = 0;
        owner = caller;
      },
    );
    sessionId;
  };

  public shared ({ caller }) func updateSessionTask(sessionId : SessionId, task : Text) : async Bool {
    verifyUserPermission(caller);
    verifySessionOwnership(caller, sessionId);
    switch (sessions.get(sessionId)) {
      case (null) { false };
      case (?session) {
        let updatedSession = {
          task;
          outcome = session.outcome;
          timestamp = session.timestamp;
          owner = session.owner;
        };
        sessions.add(sessionId, updatedSession);
        true;
      };
    };
  };

  public shared ({ caller }) func updateSessionOutcome(sessionId : SessionId, outcome : Text) : async Bool {
    verifyUserPermission(caller);
    verifySessionOwnership(caller, sessionId);
    switch (sessions.get(sessionId)) {
      case (null) { false };
      case (?session) {
        let updatedSession = {
          task = session.task;
          outcome;
          timestamp = session.timestamp;
          owner = session.owner;
        };
        sessions.add(sessionId, updatedSession);
        true;
      };
    };
  };

  public shared ({ caller }) func endSession(sessionId : SessionId) : async Bool {
    verifyUserPermission(caller);
    verifySessionOwnership(caller, sessionId);
    switch (sessions.get(sessionId)) {
      case (null) { false };
      case (?session) {
        let updatedSession = {
          task = session.task;
          outcome = session.outcome;
          timestamp = Time.now();
          owner = session.owner;
        };
        sessions.add(sessionId, updatedSession);
        true;
      };
    };
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public type TaskRequestParams = {
    userInput : Text;
    context : Text;
    duration : Text;
  };

  func buildOpenAIRequestBody(params : TaskRequestParams) : Text {
    let systemPrompt = (
      "{
        \\\"role\\\": \\\"system\\\",
        \\\"content\\\": \\\"You are not a chatbot (not a chat) and please don't introduce yourself. You have no name, you are not an IO not even an AI. You're just a text transformation. Don't greet or be polite. Only and directly transform my task into transparent answer. Strictly don't use a conversation-based approach. Avoid polite endings. Always keep your answers transparent. Answer exclusively for me - not for others and never for yourself."
    );

    let userInputBlock = (
      "{
        \\\"role\\\": \\\"user\\\",
        \\\"content\\\": \\\"" # params.userInput # "\\\"
      }"
    );

    let contextBlock = (
      "{
        \\\"role\\\": \\\"user\\\",
        \\\"content\\\": \\\"" # params.context # "\\\"
      }"
    );

    let durationBlock = (
      "{
        \\\"role\\\": \\\"user\\\",
        \\\"content\\\": \\\"" # params.duration # "\\\"
      }"
    );

    "{
      \\\"model\\\": \\\"gpt-4o\\\",
      \\\"messages\\\": [
        " # systemPrompt # ",
        " # userInputBlock # ",
        " # contextBlock # ",
        " # durationBlock # "
      ]
    }";
  };

  func sendOpenAIRequest(requestBody : Text) : async Text {
    let apiKey = getApiKeyUnsafe() : OpenAIApiKey;

    let headers = [
      {
        name = "Authorization";
        value = "Bearer ".concat(apiKey);
      },
      {
        name = "Content-Type";
        value = "application/json";
      }
    ];

    await OutCall.httpPostRequest(
      "https://api.openai.com/v1/chat/completions",
      headers,
      requestBody,
      transform,
    );
  };

  public shared ({ caller }) func generateFocusTask(userInput : Text, context : Text, duration : Text) : async Text {
    verifyUserPermission(caller);
    let requestParams : TaskRequestParams = {
      userInput;
      context;
      duration;
    };

    let openAIRequestBody = buildOpenAIRequestBody(requestParams);
    await sendOpenAIRequest(openAIRequestBody);
  };

  // Helper functions for access control checks
  func verifyUserPermission(caller : Principal) {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
  };

  func verifyAdminPermission(caller : Principal) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };

  func queryAdminOnly(caller : Principal) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this query");
    };
  };

  func verifySessionOwnership(caller : Principal, sessionId : SessionId) {
    switch (sessions.get(sessionId)) {
      case (null) { Runtime.trap("Session not found") };
      case (?session) {
        if (session.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You do not own this session");
        };
      };
    };
  };
};
