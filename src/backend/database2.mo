import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Types "./types2";

module {
  
  type Profile = Types.Profile;
  type UserId = Types.UserId;

  func makeProfile(userId: UserId, profile: Profile): Profile {
    {
      id = userId;
      name = profile.name;
      img = profile.img;
      createdAt = Time.now();
    }
  };

  func isEq(x: UserId, y: UserId): Bool { x == y };

  public class User() {
    
    let hashMap = HashMap.HashMap<UserId, Profile>(1, isEq, Principal.hash);

    public func createOne(userId: UserId, profile: Profile) {
      hashMap.put(userId, makeProfile(userId, profile));
    };

    public func updateOne(userId: UserId, profile: Profile) {
      hashMap.put(userId, profile);
    };

    public func findOne(userId: UserId): ?Profile {
      hashMap.get(userId)
    };
  };

};