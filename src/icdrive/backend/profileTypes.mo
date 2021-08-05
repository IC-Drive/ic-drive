import Principal "mo:base/Principal";
import Text "mo:base/Text";

module {
  
  public type FileCanister = Principal;
  public type UserId = Principal;
  public type UserName = Text;

  public type CanisterSettings = {
      controllers : [Principal];
  };
  public type UpdateSettingsParams = {
      canister_id: Principal;
      settings: CanisterSettings;
  };
  public type ICActor = actor {
      update_settings: shared(params: UpdateSettingsParams) -> async ();
  };

  public type Profile = {
    id: UserId;
    userName: UserName;
    fileCanister: FileCanister;
    name : Text;
    email: Text;
    createdAt: Int;
    updateCanister: Bool;
  };

  public type PublicUrl = {
    data: Text;
    id: Principal;
  };

};
