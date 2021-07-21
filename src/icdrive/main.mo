import Array "mo:base/Array";
import Cycles "mo:base/ExperimentalCycles";
import Database "./backend/database";
import Debug "mo:base/Debug";
import FileHandle "FileHandle";
import FileTypes "./backend/fileTypes";
import TrieMap "mo:base/TrieMap";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Principal "mo:base/Bool";
import ProfileTypes "./backend/profileTypes";
import Text "mo:base/Text";

shared (msg) actor class icdrive (){

  let admin = msg.caller;
  type Profile = ProfileTypes.Profile;
  type UserId = ProfileTypes.UserId;
  type UserName = ProfileTypes.UserName;
  type FileCanister = ProfileTypes.FileCanister;
  type FileId = FileTypes.FileId;
  type FileInfo = FileTypes.FileInfo;
  type FileInit = FileTypes.FileInit;

  type CanisterSettings = ProfileTypes.CanisterSettings;
  type UpdateSettingsParams = ProfileTypes.UpdateSettingsParams;
  type ICActor = ProfileTypes.ICActor;

  let IC: ICActor = actor("aaaaa-aa");
  var user: Database.User = Database.User();

  stable var user_entries : [(UserId, Profile)] = [];
  stable var user_name_entries : [(UserName, UserId)] = [];
  stable var file_url_entries : [(Text, Text)] = [];

  var fileUrlTrieMap = TrieMap.TrieMap<Text, Text>(Text.equal, Text.hash);

  public shared(msg) func createProfile(userName: UserName) : async ?Principal {
    switch(user.findOne(msg.caller)){
      case null{
        Cycles.add(1_000_000_000_000);
        let fileHandleObj = await FileHandle.FileHandle(); // dynamically install a new Canister
        let canId = await fileHandleObj.createOwner(msg.caller);
        user.createOne(msg.caller, userName, fileHandleObj);
        Debug.print("hello");
        //Making my wallet canister controller of new canister
        //let canId = await fileHandleObj.getMyId();
        let settings: CanisterSettings = {
        controllers = [admin];
        };
        let params: UpdateSettingsParams = {
            canister_id = canId;
            settings = settings;
        };
        await IC.update_settings(params);

        return(?canId);
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

  public query(msg) func getUserName(userId: UserId) : async ?UserName {
    do?{
      let profile = user.findOne(userId)!;
      profile.userName
    }
  };

  //Public File
  public shared(msg) func makeFilePublic(hash: Text, data: Text) : async() {
    fileUrlTrieMap.put(hash, data);
  };

  public query(msg) func getPublicFileLocation(hash: Text) : async ?Text {
    fileUrlTrieMap.get(hash);
  };

  //Backup and Recover
  system func preupgrade() {
    user_entries := user.getAllUsers();
    user_name_entries := user.getAllUsersNames();
    file_url_entries := Iter.toArray(fileUrlTrieMap.entries());
  };

  system func postupgrade () {
    //Restore  UserId Profile
    for ((userId, profile) in user_entries.vals()) {
      user.insertUsers(userId, profile);
    };
    //Restore Username UserId
    for ((userName, userId) in user_name_entries.vals()) {
      user.insertUsersNames(userName, userId);
    };
    //Restore URL Hash and Data
    for ((hash, data) in file_url_entries.vals()) {
      fileUrlTrieMap.put(hash, data);
    };
    
    user_entries := [];
    user_name_entries := [];
    file_url_entries := [];
  };

  ////////////////////////////////////Testing/////////////////////////////////////////////
  public query(msg) func getAdmin() : async Principal {
    admin
  };
};