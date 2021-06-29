import Array "mo:base/Array"; 
import Bool "mo:base/Bool";
import Buffer "mo:base/Buffer";
import Database "./backend/database";
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

  public shared(msg) func createProfile(userNumber: Int) : async() {
    user.createOne(msg.caller, userNumber);
  };

  public shared(msg) func getProfile() : async ?Profile {
    user.findOne(msg.caller);
  };

  func createFile_(fileData : FileInit, userId: UserId) : async ?FileId {
    let now = Time.now();
    let fileId = Principal.toText(userId) # "-" # fileData.name # "-" # (Int.toText(now));
    do ?{
      let fileList = Option.get(state.user_file_rel.get(userId), []);

      switch (state.files.get(fileId)) {
      case (?_) { /* error -- ID already taken. */ "null" };
      case null { /* ok, not taken yet. */
              state.files.put(fileId,
                              {
                                fileId = fileId;
                                userId = userId ;
                                name = fileData.name ;
                                createdAt = now ;
                                chunkCount = fileData.chunkCount ;
                                fileSize = fileData.fileSize;
                                mimeType = fileData.mimeType;
                                marked = fileData.marked;
                                sharedWith = [];
                              });

              state.user_file_rel.put(userId, Array.append<Text>(fileList, [fileId]));

            fileId
          };
      }
    };
  };

  public shared(msg) func createFile(i : FileInit) : async ?FileId {
    await createFile_(i, msg.caller)
  };

  func getFileInfo_(fileId : FileId) : ?FileInfo {
    do ? {
      let v = state.files.get(fileId)!;
      {
        fileId = fileId;
        userId = v.userId ;
        createdAt = v.createdAt ;
        name = v.name ;
        chunkCount = v.chunkCount ;
        fileSize = v.fileSize;
        mimeType = v.mimeType;
        marked= v.marked;
        sharedWith = v.sharedWith;
      }
    }
  };
  
  public query(msg) func getFileInfo (fileId : FileId) : async ?FileInfo {
    getFileInfo_(fileId)
  };

  public shared(msg) func shareFile(fileId : FileId, userNumber : Int) : async ?(Text) {
    do ? {
      let shareId = user.getUserId(userNumber)!;    // userNumber to Principal
      let fileInfo = state.files.get(fileId)!;      // Info of File

      if(msg.caller!=fileInfo.userId){  // User cant reshare other users file
        return(?"Unauthorized");
      };
      if(msg.caller==shareId){  // User cant share file to himself
        return(?"Unauthorized");
      };

      let fileList = Option.get(state.user_file_rel.get(shareId), []);

      state.files.put(fileId,
                        {
                          userId = fileInfo.userId ;
                          createdAt = fileInfo.createdAt ;
                          fileId = fileId ;
                          name = fileInfo.name ;
                          chunkCount = fileInfo.chunkCount ;
                          fileSize = fileInfo.fileSize;
                          mimeType = fileInfo.mimeType ;
                          marked = fileInfo.marked ;
                          sharedWith = Array.append<Int>(fileInfo.sharedWith, [userNumber]);
                        });

      state.user_file_rel.put(shareId, Array.append<Text>(fileList, [fileId]));

      return(?"success");
    }
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
      let file_list = state.user_file_rel.get(msg.caller)!;
      let b = Buffer.Buffer<FileInfo>(0);
      for (f in file_list.vals()) {
          b.add(getFileInfo_(f)!);
      };
      b.toArray()
    }
  };

  public shared(msg) func markFile(fileId : FileId) : async ?() {
    do ? {
      let file_info = getFileInfo_(fileId)!;
      if(msg.caller==file_info.userId){
        state.files.put(fileId,
                        {
                          userId = file_info.userId ;
                          createdAt = file_info.createdAt ;
                          fileId = fileId ;
                          name = file_info.name ;
                          chunkCount = file_info.chunkCount ;
                          fileSize = file_info.fileSize;
                          mimeType = file_info.mimeType ;
                          marked= not(file_info.marked) ;
                          sharedWith = file_info.sharedWith ;
                        });
      }
    }
  };

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

