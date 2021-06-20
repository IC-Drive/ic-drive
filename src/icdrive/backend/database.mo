import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Types "./types";

module {
  
  type Profile = Types.Profile;
  type UserId = Types.UserId;
  type userNumber = Types.userNumber;

  func makeProfile(userId: UserId, userNumber: Int): Profile {
    {
      id = userId;
      userNumber = userNumber;
      name = "";
      img = "";
      createdAt = Time.now();
    }
  };

  func isEq(x: UserId, y: UserId): Bool { x == y };
  func isEqUserNumber(x: userNumber, y: userNumber): Bool { x == y };

  public class User() {
    
    let hashMap = HashMap.HashMap<UserId, Profile>(1, isEq, Text.hash);
    let hashMapUserNumber = HashMap.HashMap<userNumber, UserId>(1, isEqUserNumber, Int.hash);

    public func createOne(userId: UserId, userNumber: Int) {
      hashMap.put(userId, makeProfile(userId, userNumber));
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