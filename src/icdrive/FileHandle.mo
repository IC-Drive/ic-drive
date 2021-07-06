import Array "mo:base/Array"; 
import Bool "mo:base/Bool";
import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Iter "mo:base/Iter";
import Option "mo:base/Option";
import Prelude "mo:base/Prelude";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import TrieMap "mo:base/TrieMap";
import FileTypes "./backend/fileTypes";

shared ({caller = admin}) actor class FileHandle (){

  type UserId = FileTypes.UserId;
  type UserNumber = FileTypes.UserNumber;
  public type FileId = FileTypes.FileId;
  public type ChunkId = FileTypes.ChunkId;
  public type ChunkData = FileTypes.ChunkData;
  public type FileInfo = FileTypes.FileInfo;
  public type FileInit = FileTypes.FileInit;
  
  var state = FileTypes.empty();
  var owner:Principal = admin;

  public query(msg) func whoami() : async Principal {
    msg.caller
  };

  // Create owner of canister
  public shared func createOwner(newOwner: Principal) : async() {
    owner := newOwner;
  };

  // Create file
  func createFile_(fileData : FileInit, userNumber: UserNumber) : async ?FileId {
    let now = Time.now();
    let fileId = Int.toText(userNumber) # "-" # fileData.name # "-" # (Int.toText(now));

    switch (state.files.get(fileId)) {
    case (?_) { /* error -- ID already taken. */ null };
    case null { /* ok, not taken yet. */
            state.files.put(fileId,
                            {
                              fileId = fileId;
                              userNumber = userNumber;
                              name = fileData.name;
                              createdAt = now;
                              chunkCount = fileData.chunkCount;
                              fileSize = fileData.fileSize;
                              mimeType = fileData.mimeType;
                              marked = fileData.marked;
                              sharedWith = [];
                              deleted = false;
                            });

          ?fileId
        };
    };
  };

  public shared(msg) func createFile(i : FileInit, userNumber: UserNumber) : async ?FileId {
    do?{
      assert(msg.caller==owner);
      let fileId = await createFile_(i, userNumber);
      fileId!
    }
  };

  // Get all files
  public query(msg) func getFiles() : async ?[FileInfo] {
    do?{
      assert(msg.caller==owner);
      let b = Buffer.Buffer<FileInfo>(0);
      for ((k,v) in state.files.entries()) {
          b.add(v);
      };
      b.toArray()
    }
  };

  // Get Specific file detail
  func getFileInfo(fileId : FileId) : ?FileInfo {
    state.files.get(fileId);
  };

  // Mark File
  public shared(msg) func markFile(fileId : FileId, userNumber: UserNumber) : async ?() {
    do ? {
      assert(msg.caller==owner);
      var file_info = getFileInfo(fileId)!;
      state.files.put(fileId,
                      {
                        userNumber = userNumber;
                        createdAt = file_info.createdAt ;
                        fileId = fileId ;
                        name = file_info.name ;
                        chunkCount = file_info.chunkCount ;
                        fileSize = file_info.fileSize;
                        mimeType = file_info.mimeType ;
                        marked= not(file_info.marked) ;
                        sharedWith = file_info.sharedWith ;
                        deleted = false;
                      });
    }
  };

  func chunkId(fileId : FileId, chunkNum : Nat) : ChunkId {
    fileId # (Nat.toText(chunkNum));
  };

  // Put File Chunk
  public shared(msg) func putFileChunk
    (fileId : FileId, chunkNum : Nat, chunkData : [Nat8]) : async ()
  {
    assert(msg.caller==owner);
    state.chunks.put(chunkId(fileId, chunkNum), chunkData);
  };

  // Get File Chunk
  public query(msg) func getFileChunk(fileId : FileId, chunkNum : Nat) : async ?[Nat8] {
    assert(msg.caller==owner);
    state.chunks.get(chunkId(fileId, chunkNum));
  };

  // Share File
  public shared(msg) func shareFile(fileId : FileId, userNumberShared : UserNumber, userNumber: UserNumber) : async ?(Text) {
    do ? {
      assert(msg.caller==owner);
      let fileInfo = state.files.get(fileId)!;      // Info of File

      //if(msg.caller!=fileInfo.userId){  // User cant reshare other users file
      //  return(?"Unauthorized");
      //};
      //if(msg.caller==shareId){  // User cant share file to himself
      //  return(?"Unauthorized");
      //};
      state.files.put(fileId, {
        userNumber = userNumber;
        createdAt = fileInfo.createdAt ;
        fileId = fileId ;
        name = fileInfo.name ;
        chunkCount = fileInfo.chunkCount ;
        fileSize = fileInfo.fileSize;
        mimeType = fileInfo.mimeType ;
        marked = fileInfo.marked ;
        sharedWith = Array.append<Int>(fileInfo.sharedWith, [userNumberShared]);
        deleted = false;
      });
      return(?"Success")
    }
  };

  public shared(msg) func addSharedFile(fileInfo : FileInfo) : async () {
    state.files.put(fileInfo.fileId, fileInfo)
  };

  public query(msg) func getSharedFileChunk(fileId : FileId, chunkNum : Nat) : async ?[Nat8] {
    state.chunks.get(chunkId(fileId, chunkNum));
  };
  
/*
  func deleteFile_(file_info : FileInfo) : () {
    for (j in Iter.range(1, file_info.chunkCount)) {
      state.chunks.delete(chunkId(file_info.fileId, j));
    };
    state.files.delete(file_info.fileId);
  };

  public query(msg) func deleteFile(fileId : FileId) : async ?() {
    do ? {
      let file_info = getFileInfo_(fileId)!;
      if(msg.caller==file_info.userId){
        deleteFile_(file_info);
      }
    }
  };

  func deleteCorruptFile_(file_info : FileInfo) : () {
    Debug.print(file_info.fileId);
    //for (j in Iter.range(1, file_info.chunkCount)) {
    //  state.chunks.delete(chunkId(file_info.fileId, j));
    //};
    //state.files.delete(file_info.fileId);
  };

  public query(msg) func deleteCorruptFile(fileId : FileId) : async ?() {
    do ? {
      let file_info = getFileInfo_(fileId)!;
      if(msg.caller==file_info.userId){
        deleteCorruptFile_(file_info);
      }
    }
  };
*/
///////////////////////////////////////////////////// TEST  //////////////////////////////////////

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

