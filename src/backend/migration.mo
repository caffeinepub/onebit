import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  type OldActor = {
    sessions : Map.Map<Nat, {
      task : Text;
      outcome : Text;
      timestamp : Int;
      owner : Principal;
    }>;
    nextSessionId : Nat;
  };

  type NewActor = {};

  public func run(old : OldActor) : NewActor {
    {};
  };
};
