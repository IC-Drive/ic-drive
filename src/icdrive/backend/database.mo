import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Types "./types";

module {
  
  type Profile = Types.Profile;
  type UserId = Types.UserId;
  type CanisterId = Types.CanisterId;
  type UserNumber = Types.UserNumber;

  func makeProfile(userId: UserId, userNumber: Int, userCanisterId: CanisterId): Profile {
    {
      id = userId;
      userNumber = userNumber;
      userCanisterId = userCanisterId;
      name = "";
      img = "";
      createdAt = Time.now();
    }
  };

  func isEq(x: UserId, y: UserId): Bool { x == y };
  func isEqUserNumber(x: UserNumber, y: UserNumber): Bool { x == y };

  public class User() {
    
    let hashMap = HashMap.HashMap<UserId, Profile>(1, isEq, Principal.hash);
    let hashMapUserNumber = HashMap.HashMap<UserNumber, UserId>(1, isEqUserNumber, Int.hash);

    public func createOne(userId: UserId, userNumber: Int, userCanisterId: CanisterId) {
      hashMap.put(userId, makeProfile(userId, userNumber, userCanisterId));
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
  };

};