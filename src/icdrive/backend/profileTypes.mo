import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat8 "mo:base/Nat8";

module {
  
  public type FileCanister = Principal;
  public type UserId = Principal;
  public type UserName = Text;
  public type WasmModule = [Nat8];

  public type CanisterSettings = {
      controllers : [Principal];
  };
  public type UpdateSettingsParams = {
      canister_id: Principal;
      settings: CanisterSettings;
  };
  public type InstallCodeParams = {
      mode : { #reinstall; #upgrade; #install };
      canister_id : Principal;
      wasm_module : WasmModule;
  };
  public type ICActor = actor {
      update_settings: shared(params: UpdateSettingsParams) -> async ();
      install_code: shared(params: InstallCodeParams) -> async ();
      create_canister: shared(params: CanisterSettings) -> async { canister_id : Principal };
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
