import Array "mo:base/Array";
import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Option "mo:base/Option";

import ProfileTypes "./backend/profileTypes";
import FileTypes "./backend/fileTypes";
import Database "./backend/database";
import FileHandle "FileHandle";

shared (msg) actor class icdrive (){

  let admin = msg.caller;
  type Profile = ProfileTypes.Profile;
  type UserId = ProfileTypes.UserId;
  type UserName = ProfileTypes.UserName;
  type FileCanister = ProfileTypes.FileCanister;
  type FileId = FileTypes.FileId;
  type FileInfo = FileTypes.FileInfo;
  type FileInit = FileTypes.FileInit;

  var user: Database.User = Database.User();

  stable var user_entries : [(UserId, Profile)] = [];
  stable var user_name_entries : [(UserName, UserId)] = [];

  var logs : [(Text, Nat)] = [];

  public shared(msg) func createProfile(userName: UserName) : async ?FileCanister {
    switch(user.findOne(msg.caller)){
      case null{
        var bal = Cycles.balance();
        Cycles.add(10_000_000_000);
        let fileHandleObj = await FileHandle.FileHandle(); // dynamically install a new Canister
        logs := Array.append<(Text, Nat)>(logs, [("canister_create", bal-Cycles.balance())]);
        await fileHandleObj.createOwner(msg.caller);
        bal := Cycles.balance();
        user.createOne(msg.caller, userName, fileHandleObj);
        logs := Array.append<(Text, Nat)>(logs, [("user_create", bal-Cycles.balance())]);
        return(?fileHandleObj);
      };
      case (?_){
        return(null);
      };
    }
  };

  public query(msg) func checkUserName(userName: UserName) : async Bool {
    let id = Option.get(user.getUserId(userName), false);
    if(id==false){
      false
    } else{
      true
    }
  };

  public query(msg) func getProfile() : async ?Profile {
    var bal = Cycles.balance();
    let user_ = user.findOne(msg.caller);
    logs := Array.append<(Text, Nat)>(logs, [("get_profile", bal-Cycles.balance())]);
    user_
  };

  public query(msg) func getUserCanister(userName: UserName) : async ?FileCanister {
    do?{
      let userId = user.getUserId(userName)!;
      let profile = user.findOne(userId)!;
      profile.fileCanister
    }
  };

  public query(msg) func getCanister(userId: UserId) : async ?FileCanister {
    do?{
      let profile = user.findOne(userId)!;
      profile.fileCanister
    }
  };

  //Backup and Recover
  system func preupgrade() {
    user_entries := user.getAllUsers();
    user_name_entries := user.getAllUsersNames();
  };

  system func postupgrade() {
    for ((userId, profile) in user_entries.vals()) {
      user.insertUsers(userId, profile);
    };
    for ((userName, userId) in user_name_entries.vals()) {
      user.insertUsersNames(userName, userId);
    };
    user_entries := [];
    user_name_entries := [];
  };

  ////////////////////////////////////Testing/////////////////////////////////////////////
  public query func get_logs() : async [((Text, Nat))]{
    logs
  }
};