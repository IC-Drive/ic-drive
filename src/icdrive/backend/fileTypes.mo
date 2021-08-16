import Principal "mo:base/Principal";
import TrieMap "mo:base/TrieMap";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Bool "mo:base/Bool";
import Blob "mo:base/Blob";
import Nat8 "mo:base/Nat8";

module {
  
  public type UserId = Principal;
  public type UserName = Text;
  public type FileId = Text; // chosen by createFile
  public type ChunkId = Text; // FileId # (toText(ChunkNum))
  public type ChunkData = Blob; // encoded as ??
  public type Map<X, Y> = TrieMap.TrieMap<X, Y>;

  public type FileInit = {
    name: Text;
    chunkCount: Nat;
    fileSize: Nat;
    mimeType: Text;
    thumbnail: Text;
    marked: Bool;
    sharedWith: [UserName];
    folder: Text;
  };

  public type FileInfo = {
    fileId : FileId;
    userName: UserName;
    createdAt : Int;
    name: Text;
    chunkCount: Nat;
    fileSize: Nat;
    mimeType: Text;
    thumbnail: Text;
    marked: Bool;
    sharedWith: [UserName];
    madePublic: Bool;
    fileHash: Text;
    folder: Text;
  };

  public type State = {
    /// all files.
    files : Map<FileId, FileInfo>;
    /// all chunks.
    chunks : Map<ChunkId, ChunkData>;

  };

  public func empty () : State {

    let st : State = {
      chunks = TrieMap.TrieMap<ChunkId, ChunkData>(Text.equal, Text.hash);
      files = TrieMap.TrieMap<FileId, FileInfo>(Text.equal, Text.hash);
    };
    st
  };

};
