// Make the Connectd app's public methods available locally

import Types "../backend/types";
import Database "../backend/database";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";

import Prelude "mo:base/Prelude";
import TrieMap "mo:base/TrieMap";
import Buffer "mo:base/Buffer";

actor icdrive {

  type Profile = Types.Profile;
  type UserId = Types.UserId;
  public type FileId = Types.FileId;
  public type ChunkId = Types.ChunkId;
  public type ChunkData = Types.ChunkData;
  public type FileInfo = Types.FileInfo;
  public type FileInit = Types.FileInit;
  
  var state = Types.empty();
  var user: Database.User = Database.User();

  public shared query(msg) func getOwnId(): async UserId { msg.caller };

  func createFile_(i : FileInit) : ?FileId {
    let now = Time.now();
    let fileId = Principal.toText(i.userId) # "-" # i.name # "-" # (Int.toText(now));
    switch (state.files.get(fileId)) {
    case (?_) { /* error -- ID already taken. */ null };
    case null { /* ok, not taken yet. */
           state.files.put(fileId,
                            {
                              fileId = fileId;
                              userId = i.userId ;
                              name = i.name ;
                              createdAt = i.createdAt ;
                              uploadedAt = now ;
                              chunkCount = i.chunkCount ;
                            });
           //state.uploaded.put(i.userId, videoId);
           ?fileId
         };
    }
  };

  public shared(msg) func createFile(i : FileInit) : async ?FileId {
      createFile_(i)
  };

  func getFileInfo_ (fileId : FileId) : ?FileInfo {
    do ? {
      Debug.print("here do");
      Debug.print(fileId);
      let v = state.files.get(fileId)!;
      Debug.print(v.name);
      Debug.print(Principal.toText(v.userId));
      {
        fileId = fileId;
        userId = v.userId ;
        createdAt = v.createdAt ;
        name = v.name ;
        chunkCount = v.chunkCount ;
      }
    }
  };
  
  public query(msg) func getFileInfo (fileId : FileId) : async ?FileInfo {
    getFileInfo_(fileId)
  };

  public shared(msg) func putFileInfo(fileId : FileId, fileInit : FileInit) : async () {
    let i = fileInit ;
    let v = state.files.get(fileId);
    state.files.put(fileId,
                      {
                        // some fields are "immutable", regardless of caller data:
                        userId = msg.caller ;
                        uploadedAt = Time.now() ;
                        fileId = fileId ;
                        // -- above uses old data ; below is from caller --
                        createdAt = i.createdAt ;
                        name = i.name ;
                        chunkCount = i.chunkCount ;
                      })
  };
  
  func chunkId(fileId : FileId, chunkNum : Nat) : ChunkId {
    fileId # (Nat.toText(chunkNum));
  };

  public shared(msg) func putFileChunk
    (fileId : FileId, chunkNum : Nat, chunkData : [Nat8]) : async ()
  {
    state.chunks.put(chunkId(fileId, chunkNum), chunkData);
  };

  public query(msg) func getFileChunk(fileId : FileId, chunkNum : Nat) : async ?[Nat8] {
    Debug.print("File ID GET");
    Debug.print(fileId);
    Debug.print("Chunk ID GET");
    Debug.print(chunkId(fileId, chunkNum));
    Debug.print("Chunk ID GET Over");
    state.chunks.get(chunkId(fileId, chunkNum));
  };

  public query(msg) func getFiles() : async ?[FileInfo] {
    do ? {
      let b = Buffer.Buffer<FileInfo>(0);
      for ((v, _) in state.files.entries()) {
        b.add(getFileInfo_(v)!)
      };
      b.toArray()
    }
  };
/////////////////////////////////////////////////////
  public query(msg) func getChunks() : async () {
      Debug.print("chunk printing");
      for ((v, _) in state.chunks.entries()) {
        Debug.print(v);
      };
  };

};

