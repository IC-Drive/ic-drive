import Array "mo:base/Array";
import Option "mo:base/Option";
import Database "./database";
import Types "./types";

module {
  //type NewProfile = Types.NewProfile;
  type Profile = Types.Profile;
  type UserId = Types.UserId;

  // Profiles
  /*public func getProfile(directory: Database.Directory, userId: UserId): Profile {
    let existing = directory.findOne(userId);
    switch (existing) {
      case (?existing) { existing };
      case (null) {
        {
          id = userId;
          firstName = "";
          lastName = "";
          img = "";
        }
      };
    };
  };*/

	public func hasAccess(userId: UserId, profile: Profile): Bool {
    userId == profile.id
  };
};