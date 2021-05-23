// Make the Connectd app's public methods available locally

import Types "../backend/types";
import Utils "../backend/utils";
import Database "../backend/database";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Nat "mo:base/Nat";

import RelObj "../backend/RelObj";
import Prelude "mo:base/Prelude";
import TrieMap "mo:base/TrieMap";
import Rel "../backend/Rel";
import Buffer "mo:base/Buffer";

actor photos {

	var directory: Database.Directory = Database.Directory();
  
	//type NewProfile = Types.NewProfile;
  type Profile = Types.Profile;
  type UserId = Types.UserId;
  type Timestamp = Types.Timestamp;
  public type VideoId = Types.VideoId;
  public type ChunkId = Types.ChunkId;
  public type ChunkData = Types.ChunkData;
  public type VideoInfo = Types.VideoInfo;
  public type VideoInit = Types.VideoInit;
  var state = Types.empty();
//  public shared(msg) func create(profile: NewProfile): async () {
//    directory.createOne(msg.caller, profile);
//  };
  
  public shared(msg) func update(profile: Profile): async () {
    Debug.print(Principal.toText(profile.id));
    Debug.print(profile.firstName);
    if(Utils.hasAccess(msg.caller, profile)) {
      directory.updateOne(profile.id, profile);
    };
  };

  public shared query(msg) func getOwnId(): async UserId { Debug.print(Principal.toText(msg.caller)); msg.caller };

//  public query func get(userId: UserId): async Profile {
//    Utils.getProfile(directory, userId)
//  };

  func timeNow_() : Int {
    Time.now()
  };

  func createVideo_(i : VideoInit) : ?VideoId {
    let now = timeNow_();
    let videoId = Principal.toText(i.userId) # "-" # i.name # "-" # (Int.toText(now));
    switch (state.videos.get(videoId)) {
    case (?_) { /* error -- ID already taken. */ null };
    case null { /* ok, not taken yet. */
           state.videos.put(videoId,
                            {
                              videoId = videoId;
                              userId = i.userId ;
                              name = i.name ;
                              createdAt = i.createdAt ;
                              uploadedAt = now ;
                              chunkCount = i.chunkCount ;
                            });
           //state.uploaded.put(i.userId, videoId);
           ?videoId
         };
    }
  };

  public shared(msg) func createVideo(i : VideoInit) : async ?VideoId {
      createVideo_(i)
  };

  func getVideoInfo_ (videoId : VideoId) : ?VideoInfo {
    do ? {
      Debug.print("here do");
      Debug.print(videoId);
      let v = state.videos.get(videoId)!;
      Debug.print(v.name);
      Debug.print(v.userId);
      {
        videoId = videoId;
        userId = v.userId ;
        createdAt = v.createdAt ;
        name = v.name ;
        chunkCount = v.chunkCount ;
      }
    }
  };
  
  public query(msg) func getVideoInfo (videoId : VideoId) : async ?VideoInfo {
    getVideoInfo_(videoId)
  };
  
  public shared(msg) func putVideoInfo(videoId : VideoId, videoInit : VideoInit) : async () {
    let i = videoInit ;
    let v = state.videos.get(videoId);
    state.videos.put(videoId,
                      {
                        // some fields are "immutable", regardless of caller data:
                        userId = msg.caller ;
                        uploadedAt = timeNow_() ;
                        videoId = videoId ;
                        // -- above uses old data ; below is from caller --
                        createdAt = i.createdAt ;
                        name = i.name ;
                        chunkCount = i.chunkCount ;
                      })
  };
  
  func chunkId(videoId : VideoId, chunkNum : Nat) : ChunkId {
    videoId # (Nat.toText(chunkNum));
  };

  public shared(msg) func putVideoChunk
    (videoId : VideoId, chunkNum : Nat, chunkData : [Nat8]) : async ()
  {
    state.chunks.put(chunkId(videoId, chunkNum), chunkData);
  };

  public query(msg) func getVideoChunk(videoId : VideoId, chunkNum : Nat) : async ?[Nat8] {
    state.chunks.get(chunkId(videoId, chunkNum));
  };

};

