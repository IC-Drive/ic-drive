import ProfileTypes "profileTypes";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Int "mo:base/Int";

module {
  
  type Profile = ProfileTypes.Profile;
  type UserId = ProfileTypes.UserId;
  type FileCanister = ProfileTypes.FileCanister;
  type UserNumber = ProfileTypes.UserNumber;

  func makeProfile(userId: UserId, userNumber: Int, fileCanister: FileCanister): Profile {
    {
      id = userId;
      fileCanister = fileCanister;
      userNumber = userNumber;
      name = "Anonymous";
      createdAt = Time.now();
    }
  };

  func isEq(x: UserId, y: UserId): Bool { x == y };
  func isEqUserNumber(x: UserNumber, y: UserNumber): Bool { x == y };

  public class User() {
    
    let hashMap = HashMap.HashMap<UserId, Profile>(1, isEq, Principal.hash);
    let hashMapUserNumber = HashMap.HashMap<UserNumber, UserId>(1, isEqUserNumber, Int.hash);

    public func createOne(userId: UserId, userNumber: Int, fileCanister: FileCanister) {
      hashMap.put(userId, makeProfile(userId, userNumber, fileCanister));
      hashMapUserNumber.put(userNumber, userId);
    };

//    public func updateOne(userId: UserId, profile: Profile) {
//      hashMap.put(userId, profile);
//    };

    public func findOne(userId: UserId): ?Profile {
      hashMap.get(userId);
    };

    public func getUserId(userNumber: Int): ?UserId {
      hashMapUserNumber.get(userNumber);
    };

    // Functions used for creating backup of state
    public func getAllUsers(): [(UserId, Profile)] {
      Iter.toArray(hashMap.entries())
    };
    public func getAllUsersNumbers(): [(UserNumber, UserId)] {
      Iter.toArray(hashMapUserNumber.entries())
    };

    public func insertUsers(userId: UserId, profile: Profile) {
      hashMap.put(userId, profile);
    };
    public func insertUsersNumbers(userNumber: UserNumber, userId: UserId) {
      hashMapUserNumber.put(userNumber, userId);
    };

  };

};