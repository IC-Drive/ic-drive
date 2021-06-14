import Bool "mo:base/Bool";
import Buffer "mo:base/Buffer";
import Database "./backend/database";
import Debug "mo:base/Debug";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Prelude "mo:base/Prelude";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import TrieMap "mo:base/TrieMap";
import Types "./backend/types";

shared (msg) actor class icdrive (){

  let admin = msg.caller;
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

  func createProfile(caller: Principal, profile: Profile) : async() {
    user.createOne(caller, profile);
  };

  public shared(msg) func getProfile() : async ?Profile {
    user.findOne(msg.caller);
  };

  func createFile_(fileData : FileInit, userId: UserId) : ?FileId {
    let now = Time.now();
    let fileId = Principal.toText(userId) # "-" # fileData.name # "-" # (Int.toText(now));
    switch (state.files.get(fileId)) {
    case (?_) { /* error -- ID already taken. */ null };
    case null { /* ok, not taken yet. */
           state.files.put(fileId,
                            {
                              fileId = fileId;
                              userId = userId ;
                              name = fileData.name ;
                              createdAt = now ;
                              uploadedAt = now ;
                              chunkCount = fileData.chunkCount ;
                              mimeType = fileData.mimeType;
                              marked= fileData.marked;
                            });
           ?fileId
         };
    }
  };

  public shared(msg) func createFile(i : FileInit) : async ?FileId {
    createFile_(i, msg.caller)
  };

  func getFileInfo_ (fileId : FileId) : ?FileInfo {
    do ? {
      let v = state.files.get(fileId)!;
      {
        fileId = fileId;
        userId = v.userId ;
        createdAt = v.createdAt ;
        name = v.name ;
        chunkCount = v.chunkCount ;
        mimeType = v.mimeType;
        marked= v.marked;
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
                        mimeType = i.mimeType ;
                        marked= i.marked;
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
    state.chunks.get(chunkId(fileId, chunkNum));
  };

  public query(msg) func getFiles() : async ?[FileInfo] {
    do ? {
      let b = Buffer.Buffer<FileInfo>(0);
      for ((v, _) in state.files.entries()) {
        let file_info = getFileInfo_(v)!;
        if(msg.caller==file_info.userId){
          b.add(file_info);
        }
      };
      b.toArray()
    }
  };

///////////////////////////////////////////////////// TEST  //////////////////////////////////////
  public query(msg) func getChunks() : async () {
      Debug.print("chunk printing");
      for ((v, _) in state.chunks.entries()) {
        Debug.print(v);
      };
  };

  type HeaderField = (Text, Text);

  type HttpResponse = {
      status_code: Nat16;
      headers: [HeaderField];
      body: Blob;
  };

  public query func http_request() : async HttpResponse {
      //let data := state.chunks.get(chunkId(fileId, chunkNum));
      Debug.print("Woah, it works!!");
      return {
          status_code = 200;
          headers = [("Content-Type", "application/octet-stream; charset=utf-8"),("Content-Disposition", "attachment; filename*=UTF-8''abc.txt")];
          body = Text.encodeUtf8("<b>Hello World!</b>");
      };
  };

};

