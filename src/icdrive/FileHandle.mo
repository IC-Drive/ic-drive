import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Blob "mo:base/Blob";
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
import TrieMap "mo:base/TrieMap";
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
  stable var public_file_url_entries : [(Text, FileId)] = [];
  
  var state = FileTypes.empty();
  stable var owner:Principal = msg.caller;
  var fileUrlTrieMap = TrieMap.TrieMap<Text, FileId>(Text.equal, Text.hash);

  public query(msg) func getOwner() : async Principal{
    owner
  };
  // Create owner of canister
  public query(msg) func getCanisterID() : async Principal{
    msg.caller;
  };
  public shared(msg) func createOwner(newOwner: Principal) : async Principal {
    assert(msg.caller==owner);
    owner := newOwner;
    await getCanisterID();
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
              thumbnail = fileData.thumbnail;
              marked = fileData.marked;
              sharedWith = [];
              madePublic = false;
              fileHash = "";
              folder = fileData.folder;
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
      var fileInfo = state.files.get(fileId)!;
      state.files.put(fileId, {
        userName = fileInfo.userName;
        createdAt = fileInfo.createdAt ;
        fileId = fileId ;
        name = fileInfo.name ;
        chunkCount = fileInfo.chunkCount ;
        fileSize = fileInfo.fileSize;
        mimeType = fileInfo.mimeType ;
        thumbnail = fileInfo.thumbnail;
        marked= not(fileInfo.marked) ;
        sharedWith = fileInfo.sharedWith ;
        madePublic = fileInfo.madePublic;
        fileHash = fileInfo.fileHash;
        folder = fileInfo.folder;
      });
    }
  };

  func chunkId(fileId : FileId, chunkNum : Nat) : ChunkId {
    fileId # (Nat.toText(chunkNum));
  };

  // Put File Chunk
  public shared(msg) func putFileChunk
    (fileId : FileId, chunkNum : Nat, chunkData : ChunkData) : async ()
  {
    assert(msg.caller==owner);
    state.chunks.put(chunkId(fileId, chunkNum), chunkData);
  };

  // Get File Chunk
  public query(msg) func getFileChunk(fileId : FileId, chunkNum : Nat) : async ?ChunkData {
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
      let fileInfo = state.files.get(fileId)!;
      deleteFile_(fileInfo);
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
        thumbnail = fileInfo.thumbnail;
        marked = fileInfo.marked ;
        sharedWith = Array.append<Text>(fileInfo.sharedWith, [userNameShared]);
        madePublic = fileInfo.madePublic;
        fileHash = fileInfo.fileHash;
        folder = fileInfo.folder;
      });
      return(?"Success")
    }
  };
  
  //Authorization for sharing to be added
  public shared(msg) func addSharedFile(fileInfo : FileInfo) : async () {
    state.files.put(fileInfo.fileId, fileInfo)
  };

  public query(msg) func getSharedFileChunk(fileId : FileId, chunkNum : Nat, userName: UserName) : async ?ChunkData {
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
      let fileInfo = state.files.get(fileId)!;
      state.files.delete(fileInfo.fileId);
    }
  };

  //Public Files
  public shared(msg) func makeFilePublic(fileId : FileId, file_hash: Text) : async ?() {
    do ? {
      assert(msg.caller==owner);
      let fileInfo = state.files.get(fileId)!;
      fileUrlTrieMap.put(file_hash, fileId);
      state.files.put(fileId, {
        userName = fileInfo.userName;
        createdAt = fileInfo.createdAt ;
        fileId = fileId ;
        name = fileInfo.name ;
        chunkCount = fileInfo.chunkCount ;
        fileSize = fileInfo.fileSize;
        mimeType = fileInfo.mimeType ;
        thumbnail = fileInfo.thumbnail;
        marked = fileInfo.marked ;
        sharedWith = [] ;
        madePublic = true;
        fileHash = file_hash;
        folder = fileInfo.folder;
      });
    }
  };

  public query(msg) func getPublicFileMeta(fileHash : Text) : async ?FileInfo {
    do?{
      let fileId = fileUrlTrieMap.get(fileHash)!;
      let fileInfo = state.files.get(fileId)!;
    };
  };

  public query(msg) func getPublicFileChunk(fileId : FileId, chunkNum : Nat) : async ?ChunkData {
    do?{
      let fileInfo = state.files.get(fileId)!;
      if(fileInfo.madePublic==true){
        state.chunks.get(chunkId(fileId, chunkNum))!;
      } else{
        Blob.fromArray([]);
      }
    };
  };

  // public query(msg) func getPublicFileEntire(file_hash: Text) : async ?ChunkData {
  //   do?{
  //     let fileId = fileUrlTrieMap.get(file_hash)!;
  //     let file_info = state.files.get(fileId)!;
  //     if(file_info.madePublic==true){
  //       var temp : [Nat8] = [];
  //       let chunkCount = file_info.chunkCount;
  //       for (j in Iter.range(1, chunkCount)) {
  //         let k = state.chunks.get(chunkId(fileId, j))!;
  //         temp := Array.append<Nat8>(temp, k);
  //       };
  //       temp;
  //     } else{
  //       Blob.fromArray([]);
  //     }
  //   };
  // };

  public shared(msg) func removeFilePublic(fileId : FileId) : async ?() {
    do ? {
      assert(msg.caller==owner);
      let fileInfo = state.files.get(fileId)!;
      state.files.put(fileId, {
        userName = fileInfo.userName;
        createdAt = fileInfo.createdAt ;
        fileId = fileId ;
        name = fileInfo.name ;
        chunkCount = fileInfo.chunkCount ;
        fileSize = fileInfo.fileSize;
        mimeType = fileInfo.mimeType ;
        thumbnail = fileInfo.thumbnail;
        marked = fileInfo.marked ;
        sharedWith = fileInfo.sharedWith ;
        madePublic = false;
        fileHash = "";
        folder = fileInfo.folder;
      });
    }
  };

  //Get Cycles
  public query(msg) func getCycles() : async Nat {
    Cycles.balance()
  };

  //Backup and Recover
  system func preupgrade() {
    fileEntries := Iter.toArray(state.files.entries());
    chunkEntries := Iter.toArray(state.chunks.entries());
    public_file_url_entries := Iter.toArray(fileUrlTrieMap.entries());
  };

  system func postupgrade() {
    for ((fileId, fileInfo) in fileEntries.vals()) {
      let fileMetaData = {
        userName = fileInfo.userName;
        createdAt = fileInfo.createdAt;
        fileId = fileId;
        name = fileInfo.name;
        chunkCount = fileInfo.chunkCount;
        fileSize = fileInfo.fileSize;
        mimeType = fileInfo.mimeType;
        thumbnail = "";
        marked = fileInfo.marked;
        sharedWith = fileInfo.sharedWith;
        madePublic = fileInfo.madePublic;
        fileHash = fileInfo.fileHash;
        folder = fileInfo.folder;
      };
      Debug.print(fileId);
      state.files.put(fileId, fileMetaData);
    };

    for ((chunkId, chunkData) in chunkEntries.vals()) {
      state.chunks.put(chunkId, chunkData);
    };

    //Restore URL Hash and Data
    for ((hash, data) in public_file_url_entries.vals()) {
      fileUrlTrieMap.put(hash, data);
    };
    
    fileEntries := [];
    chunkEntries := [];
    public_file_url_entries := [];
  };

///////////////////////////////////////////////////// TEST  //////////////////////////////////////

};
