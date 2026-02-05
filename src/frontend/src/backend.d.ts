import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type OpenAIApiKey = string;
export interface Session {
    owner: Principal;
    task: string;
    timestamp: bigint;
    outcome: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type SessionId = bigint;
export interface UserProfile {
    name: string;
}
export interface http_header {
    value: string;
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    endSession(sessionId: SessionId): Promise<boolean>;
    generateFocusTask(userInput: string, context: string, duration: string): Promise<string>;
    getAllSessions(): Promise<Array<Session>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getSession(sessionId: SessionId): Promise<Session | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isApiKeyConfigured(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    startSession(): Promise<SessionId>;
    storeApiKey(key: OpenAIApiKey): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateSessionOutcome(sessionId: SessionId, outcome: string): Promise<boolean>;
    updateSessionTask(sessionId: SessionId, task: string): Promise<boolean>;
}
