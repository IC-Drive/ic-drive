import FileHandle "../FileHandle";
import Principal "mo:base/Principal";
import Text "mo:base/Text";

module {
  
  public type FileCanister = FileHandle.FileHandle;
  public type UserId = Principal;
  public type UserName = Text;

  public type Profile = {
    id: UserId;
    userName: UserName;
    fileCanister: FileCanister;
    name : Text;
    createdAt: Int;
  };

};
