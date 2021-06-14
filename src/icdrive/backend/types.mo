import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Bool "mo:base/Int";
import Nat8 "mo:base/Nat8";
import TrieMap "mo:base/TrieMap";

module {
  
  public type UserId = Principal;
  public type FileId = Text; // chosen by createFile
  public type ChunkId = Text; // FileId # (toText(ChunkNum))
  public type ChunkData = [Nat8]; // encoded as ???
  public type Map<X, Y> = TrieMap.TrieMap<X, Y>;

  public type Profile = {
    id: UserId;
    userNumber: Int;
    name : Text;
		img: Text;
    createdAt: Int;
  };

  public type FileInit = {
    userId : UserId;
    name: Text;
    createdAt : Int;
    chunkCount: Nat;
    mimeType: Text;
    marked: Bool;
  };

  public type FileInfo = {
    fileId : FileId;
    userId : UserId;
    createdAt : Int;
    name: Text;
    chunkCount: Nat;
    mimeType: Text;
    marked: Bool;
  };

  public type File = {
    userId : UserId;
    createdAt : Int;
    uploadedAt : Int;
    name: Text;
    chunkCount: Nat;
    mimeType: Text;
    marked: Bool;
  };

  public type State = {
    /// all files.
    files : Map<FileId, File>;
    /// all chunks.
    chunks : Map<ChunkId, ChunkData>;
  };

  public func empty () : State {

    let st : State = {
      chunks = TrieMap.TrieMap<ChunkId, ChunkData>(Text.equal, Text.hash);
      files = TrieMap.TrieMap<FileId, File>(Text.equal, Text.hash);
    };
    st
  };

};
