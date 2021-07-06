import FileHandle "../FileHandle";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Int "mo:base/Int";

module {
  
  public type FileCanister = FileHandle.FileHandle;
  public type UserId = Principal;
  public type UserNumber = Int;

  public type Profile = {
    id: UserId;
    userNumber: UserNumber;
    fileCanister: FileCanister;
    name : Text;
    createdAt: Int;
  };

};
