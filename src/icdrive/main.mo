import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import Int "mo:base/Int";
import Nat "mo:base/Nat";

import ProfileTypes "./backend/profileTypes";
import FileTypes "./backend/fileTypes";
import Database "./backend/database";
import FileHandle "FileHandle";

shared (msg) actor class icdrive (){

  let admin = msg.caller;
  type Profile = ProfileTypes.Profile;
  type UserId = ProfileTypes.UserId;
  type UserNumber = ProfileTypes.UserNumber;
  type FileCanister = ProfileTypes.FileCanister;
  type FileId = FileTypes.FileId;
  type FileInfo = FileTypes.FileInfo;
  type FileInit = FileTypes.FileInit;

  var user: Database.User = Database.User();

  stable var user_entries : [(UserId, Profile)] = [];
  stable var user_number_entries : [(UserNumber, UserId)] = [];

  public shared(msg) func createProfile(userNumber: Int) : async ?FileCanister {
    switch(user.findOne(msg.caller)){
      case null{
        Cycles.add(10_000_000_000);
        let fileHandleObj = await FileHandle.FileHandle(); // dynamically install a new Canister
        await fileHandleObj.createOwner(msg.caller);
        user.createOne(msg.caller, userNumber, fileHandleObj);
        return(?fileHandleObj);
      };
      case (?_){
        return(null);
      };
    }
  };

  public query(msg) func getProfile() : async ?Profile {
    user.findOne(msg.caller);
  };

  public query(msg) func getUserCanister(userNumber: Int) : async ?FileCanister {
    do?{
      let userId = user.getUserId(userNumber)!;
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
    user_number_entries := user.getAllUsersNumbers();
  };

  system func postupgrade() {
    for ((userId, profile) in user_entries.vals()) {
      user.insertUsers(userId, profile);
    };
    for ((userNumber, userId) in user_number_entries.vals()) {
      user.insertUsersNumbers(userNumber, userId);
    };
    user_entries := [];
    user_number_entries := [];
  };

};