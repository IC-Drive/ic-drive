import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Bool "mo:base/Bool";
import Debug "mo:base/Debug";
import Cycles "mo:base/ExperimentalCycles";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";

import FileTypes "./backend/fileTypes";

shared (msg) actor class FileHandle (){

  type UserId = FileTypes.UserId;
  type UserName = FileTypes.UserName;
  public type FileId = FileTypes.FileId;
  public type ChunkId = FileTypes.ChunkId;
  public type ChunkData = FileTypes.ChunkData;
  public type FileInfo = FileTypes.FileInfo;
  public type FileInit = FileTypes.FileInit;

  stable var fileEntries : [(FileId, FileInfo)] = [];
  stable var chunkEntries : [(ChunkId, ChunkData)] = [];
  
  var state = FileTypes.empty();
  stable var admin:Principal = msg.caller;
  stable var owner:Principal = msg.caller;

  public query(msg) func getMyId() : async Principal {
    admin
  };

  // Create owner of canister
  public shared(msg) func makeAdmin() : async (){
    admin := msg.caller;
  };
  public shared(msg) func createOwner(newOwner: Principal) : async Principal {
    owner := newOwner;
    await makeAdmin();
    return admin
  };

  // Create file
  func createFile_(fileData : FileInit, userName: UserName) : async ?FileId {
    let now = Time.now();
    let fileId = userName # "-" # fileData.name # "-" # (Int.toText(now));

    switch (state.files.get(fileId)) {
    case (?_) { /* error -- ID already taken. */ null };
    case null { /* ok, not taken yet. */
            state.files.put(fileId, {
              fileId = fileId;
              userName = userName;
              name = fileData.name;
              createdAt = now;
              chunkCount = fileData.chunkCount;
              fileSize = fileData.fileSize;
              mimeType = fileData.mimeType;
              marked = fileData.marked;
              sharedWith = [];
              madePublic = false;
              fileHash = "";
            });

          ?fileId
        };
    };
  };

  public shared(msg) func createFile(i : FileInit, userName: UserName) : async ?FileId {
    do?{
      assert(msg.caller==owner);
      let fileId = await createFile_(i, userName);
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

  // Mark File
  public shared(msg) func markFile(fileId : FileId) : async ?() {
    do ? {
      assert(msg.caller==owner);
      var file_info = state.files.get(fileId)!;
      state.files.put(fileId, {
        userName = file_info.userName;
        createdAt = file_info.createdAt ;
        fileId = fileId ;
        name = file_info.name ;
        chunkCount = file_info.chunkCount ;
        fileSize = file_info.fileSize;
        mimeType = file_info.mimeType ;
        marked= not(file_info.marked) ;
        sharedWith = file_info.sharedWith ;
        madePublic = file_info.madePublic;
        fileHash = file_info.fileHash;
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

  // Delete File
  func deleteFile_(fileInfo : FileInfo) : () {
    for (j in Iter.range(1, fileInfo.chunkCount)) {
      state.chunks.delete(chunkId(fileInfo.fileId, j));
    };
    state.files.delete(fileInfo.fileId);
  };

  public shared(msg) func deleteFile(fileId : FileId) : async ?() {
    do ? {
      assert(msg.caller==owner);
      let file_info = state.files.get(fileId)!;
      deleteFile_(file_info);
    }
  };

  // Share File
  public shared(msg) func shareFile(fileId : FileId, userNameShared : UserName, userName: UserName) : async ?(Text) {
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
        userName = userName;
        createdAt = fileInfo.createdAt ;
        fileId = fileId ;
        name = fileInfo.name ;
        chunkCount = fileInfo.chunkCount ;
        fileSize = fileInfo.fileSize;
        mimeType = fileInfo.mimeType ;
        marked = fileInfo.marked ;
        sharedWith = Array.append<Text>(fileInfo.sharedWith, [userNameShared]);
        madePublic = fileInfo.madePublic;
        fileHash = fileInfo.fileHash;
      });
      return(?"Success")
    }
  };
  
  //Authorization for sharing to be added
  public shared(msg) func addSharedFile(fileInfo : FileInfo) : async () {
    state.files.put(fileInfo.fileId, fileInfo)
  };

  public query(msg) func getSharedFileChunk(fileId : FileId, chunkNum : Nat, userName: UserName) : async ?[Nat8] {
    do?{
      let fileInfo = state.files.get(fileId)!;
      var flag = 0;
      for (j in fileInfo.sharedWith.vals()) {
        if(userName==j){
          flag := 1;
        };
      };
      assert(flag==1);
      state.chunks.get(chunkId(fileId, chunkNum))!;
    };
  };

  public shared(msg) func deleteSharedFile(fileId : FileId) : async ?() {
    do ? {
      assert(msg.caller==owner);
      let file_info = state.files.get(fileId)!;
      state.files.delete(file_info.fileId);
    }
  };

  //Public Files
  public shared(msg) func makeFilePublic(fileId : FileId, file_hash: Text) : async ?() {
    do ? {
      assert(msg.caller==owner);
      let file_info = state.files.get(fileId)!;
      state.files.put(fileId, {
        userName = file_info.userName;
        createdAt = file_info.createdAt ;
        fileId = fileId ;
        name = file_info.name ;
        chunkCount = file_info.chunkCount ;
        fileSize = file_info.fileSize;
        mimeType = file_info.mimeType ;
        marked = file_info.marked ;
        sharedWith = file_info.sharedWith ;
        madePublic = true;
        fileHash = file_hash;
      });
    }
  };

  public query(msg) func getPublicFileChunk(fileId : FileId, chunkNum : Nat) : async ?[Nat8] {
    do?{
      let file_info = state.files.get(fileId)!;
      if(file_info.madePublic==true){
        state.chunks.get(chunkId(fileId, chunkNum))!;
      } else{
        [];
      }
    };
  };

  //Backup and Recover
  system func preupgrade() {
    Debug.print("hello");
    fileEntries := Iter.toArray(state.files.entries());
    chunkEntries := Iter.toArray(state.chunks.entries());
  };

  system func postupgrade() {
    Debug.print("hello again");
    for ((fileId, fileInfo) in fileEntries.vals()) {
      Debug.print(fileId);
      Debug.print(Bool.toText(fileInfo.madePublic));
      state.files.put(fileId, fileInfo);
    };

    for ((chunkId, chunkData) in chunkEntries.vals()) {
      state.chunks.put(chunkId, chunkData);
    };
    
    fileEntries := [];
    chunkEntries := [];
  };

  //func deleteCorruptFile_(file_info : FileInfo) : () {
  //  Debug.print(file_info.fileId);
    //for (j in Iter.range(1, file_info.chunkCount)) {
    //  state.chunks.delete(chunkId(file_info.fileId, j));
    //};
    //state.files.delete(file_info.fileId);
  //};

  /*public query(msg) func deleteCorruptFile(fileId : FileId) : async ?() {
    do ? {
      let file_info = getFileInfo_(fileId)!;
      if(msg.caller==file_info.userId){
        deleteCorruptFile_(file_info);
      }
    }
  };*/

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

