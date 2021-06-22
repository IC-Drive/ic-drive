import Text "mo:base/Text";
import Int "mo:base/Int";
import Bool "mo:base/Int";
import Nat8 "mo:base/Nat8";
import TrieMap "mo:base/TrieMap";

module {
  
  public type UserId = Text;
  public type UserNumber = Int;
  public type FileId = Text; // chosen by createFile
  public type ChunkId = Text; // FileId # (toText(ChunkNum))
  public type ChunkData = [Nat8]; // encoded as ??
  public type Map<X, Y> = TrieMap.TrieMap<X, Y>;

  public type Profile = {
    id: UserId;
    userNumber: UserNumber;
    name : Text;
		img: Text;
    createdAt: Int;
  };

  public type FileInit = {
    name: Text;
    chunkCount: Nat;
    fileSize: Nat;
    mimeType: Text;
    marked: Bool;
    sharedWith: [Int];
  };

  public type FileInfo = {
    fileId : FileId;
    userId : UserId;
    createdAt : Int;
    name: Text;
    chunkCount: Nat;
    fileSize: Nat;
    mimeType: Text;
    marked: Bool;
    sharedWith: [Int];
  };

  public type File = {
    userId : UserId;
    createdAt : Int;
    name: Text;
    chunkCount: Nat;
    fileSize: Nat;
    mimeType: Text;
    marked: Bool;
    sharedWith: [Int];
  };

  public type State = {
    /// all files.
    files : Map<FileId, File>;
    /// all chunks.
    chunks : Map<ChunkId, ChunkData>;
    /// users with file
    user_file_rel : Map<UserId, [FileId]>;
  };

  public func empty () : State {

    let st : State = {
      chunks = TrieMap.TrieMap<ChunkId, ChunkData>(Text.equal, Text.hash);
      files = TrieMap.TrieMap<FileId, File>(Text.equal, Text.hash);
      user_file_rel = TrieMap.TrieMap<UserId, [FileId]>(Text.equal, Text.hash);
    };
    st
  };

};
