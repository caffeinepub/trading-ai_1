import Time "mo:core/Time";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";

actor {
  type Direction = {
    #buy;
    #sell;
  };

  type Section = {
    #gainzalgo;
    #htgold;
    #amd;
    #smc;
  };

  type Signal = {
    id : Nat;
    section : Section;
    pair : Text;
    direction : Direction;
    entry : Int;
    target : Int;
    stoploss : Int;
    confidence : Int;
    timestamp : Int;
  };

  module Signal {
    public func compare(signal1 : Signal, signal2 : Signal) : {
      #less;
      #equal;
      #greater;
    } {
      Int.compare(signal1.timestamp, signal2.timestamp);
    };
  };

  var nextId = 0;
  let signals = Map.empty<Nat, Signal>();

  public shared ({ caller }) func createSignal(section : Section, pair : Text, direction : Direction, entry : Int, target : Int, stoploss : Int, confidence : Int) : async Nat {
    let id = nextId;
    nextId += 1;

    let signal : Signal = {
      id;
      section;
      pair;
      direction;
      entry;
      target;
      stoploss;
      confidence;
      timestamp = Time.now();
    };
    signals.add(id, signal);
    id;
  };

  public query ({ caller }) func readSignal(id : Nat) : async ?Signal {
    signals.get(id);
  };

  public query ({ caller }) func getAllSignals() : async [Signal] {
    signals.values().toArray().sort();
  };
};
