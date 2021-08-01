import ProfileTypes "profileTypes";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Iter "mo:base/Iter";

module {
  
  type Profile = ProfileTypes.Profile;
  type UserId = ProfileTypes.UserId;
  type FileCanister = ProfileTypes.FileCanister;
  type UserName = ProfileTypes.UserName;

  func makeProfile(userId: UserId, userName: UserName, fileCanister: FileCanister, email: Text): Profile {
    {
      id = userId;
      fileCanister = fileCanister;
      userName = userName;
      name = "Anonymous";
      email = email;
      createdAt = Time.now();
      updateCanister = false;
    }
  };

  func isEq(x: UserId, y: UserId): Bool { x == y };
  func isEqUserName(x: UserName, y: UserName): Bool { x == y };

  public class User() {
    
    let hashMap = HashMap.HashMap<UserId, Profile>(1, isEq, Principal.hash);
    let hashMapUserName = HashMap.HashMap<UserName, UserId>(1, isEqUserName, Text.hash);

    public func createOne(userId: UserId, userName: UserName, fileCanister: FileCanister, email: Text) {
      hashMap.put(userId, makeProfile(userId, userName, fileCanister, email));
      hashMapUserName.put(userName, userId);
    };

//    public func updateOne(userId: UserId, profile: Profile) {
//      hashMap.put(userId, profile);
//    };

    public func findOne(userId: UserId): ?Profile {
      hashMap.get(userId);
    };

    public func getUserId(userName: UserName): ?UserId {
      hashMapUserName.get(userName);
    };

    // Functions used for creating backup of state
    public func getAllUsers(): [(UserId, Profile)] {
      Iter.toArray(hashMap.entries())
    };
    public func getAllUsersNames(): [(UserName, UserId)] {
      Iter.toArray(hashMapUserName.entries())
    };

    public func insertUsers(userId: UserId, profile: Profile) {
      hashMap.put(userId, profile);
    };
    public func insertUsersNames(userName: UserName, userId: UserId) {
      hashMapUserName.put(userName, userId);
    };

    public func updateDone(userId: UserId, profile: Profile) {
      hashMap.put(userId, profile);
    };

  };

};