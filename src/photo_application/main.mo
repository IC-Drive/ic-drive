// Make the Connectd app's public methods available locally

import Types "./types";
import Utils "./utils";
import Database "./database";

actor photos {

	var directory: Database.Directory = Database.Directory();
  
	type NewProfile = Types.NewProfile;
  type Profile = Types.Profile;
  type UserId = Types.UserId;
  
  public shared(msg) func create(profile: NewProfile): async () {
    directory.createOne(msg.caller, profile);
  };
  
  public shared(msg) func update(profile: Profile): async () {
    if(Utils.hasAccess(msg.caller, profile)) {
      directory.updateOne(profile.id, profile);
    };
  };

  public query func get(userId: UserId): async Profile {
    Utils.getProfile(directory, userId)
  };

  public shared query(msg) func getOwnId(): async UserId { msg.caller }
};
