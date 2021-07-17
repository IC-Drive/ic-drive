import Array "mo:base/Array";
import Cycles "mo:base/ExperimentalCycles";
import Database "./backend/database";
import Debug "mo:base/Debug";
import FileHandle "FileHandle";
import FileTypes "./backend/fileTypes";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Principal "mo:base/Bool";
import ProfileTypes "./backend/profileTypes";

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

  public shared(msg) func createProfile(userName: UserName) : async ?FileCanister {
    switch(user.findOne(msg.caller)){
      case null{
        Cycles.add(1_000_000_000_000);
        let fileHandleObj = await FileHandle.FileHandle(); // dynamically install a new Canister
        await fileHandleObj.createOwner(msg.caller);
        user.createOne(msg.caller, userName, fileHandleObj);
        return(?fileHandleObj);
      };
      case (?_){
        return(null);
      };
    }
  };

  public query(msg) func checkUserName(userName: UserName) : async Bool {
    switch (user.getUserId(userName)) {
    case (?_) { /* error -- ID already taken. */ true };
    case null { /* ok, not taken yet. */ false };
    };
  };

  public query(msg) func getProfile() : async ?Profile {
    user.findOne(msg.caller);
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
  
};