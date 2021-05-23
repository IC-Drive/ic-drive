import Principal "mo:base/Principal";
import TrieMap "mo:base/TrieMap";
import Hash "mo:base/Hash";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Rel "Rel";

module {
  
  public type Timestamp = Int; // See mo:base/Time and Time.now()
  public type UserId = Principal;
  public type VideoId = Text; // chosen by createVideo
  public type ChunkId = Text; // VideoId # (toText(ChunkNum))
  public type ChunkData = [Nat8]; // encoded as ???
  public type Map<X, Y> = TrieMap.TrieMap<X, Y>;

  public type Profile = {
    id: UserId;
    firstName : Text;
		lastName : Text;
		img: Text;
  };

  /// video information provided by front end to service, upon creation.
  public type VideoInit = {
    userId : UserId;
    name: Text;
    createdAt : Timestamp;
    chunkCount: Nat;
  };

  public type VideoInfo = {
    videoId : VideoId;
    userId : UserId;
    createdAt : Timestamp;
    name: Text;
    chunkCount: Nat;
  };

  public type Video = {
    userId : UserId;
    createdAt : Timestamp;
    uploadedAt : Timestamp;
    name: Text;
    chunkCount: Nat;
  };

  public type State = {
    /// all videos.
    videos : Map<VideoId, Video>;
    /// all chunks.
    chunks : Map<ChunkId, ChunkData>;
  };

  public func empty () : State {
    let equal = (Text.equal, Text.equal);
    let hash = (Text.hash, Text.hash);

    let st : State = {
      chunks = TrieMap.TrieMap<ChunkId, ChunkData>(Text.equal, Text.hash);
      videos = TrieMap.TrieMap<VideoId, Video>(Text.equal, Text.hash);
    };
    st
  };

  public type Service = actor {

  createVideo : (videoInfo : VideoInfo) -> async ?VideoId;

  getVideoInfo : query (videoId : VideoId) -> async ?VideoInfo;

  putVideoInfo : (videoId : VideoId, videoInfo : VideoInfo) -> async ?();

  putVideoChunk : (videoId : VideoId, chunkNum : Nat, chunkData : ChunkData) -> async ?();
  getVideoChunk : query (videoId : VideoId, chunkNum : Nat) -> async ?ChunkData;

  };

};

/// Public-facing types.
/*module {

public type Timestamp = Int; // See mo:base/Time and Time.now()

public type VideoId = Text; // chosen by createVideo
public type UserId = Text; // chosen by createUser
public type ChunkId = Text; // VideoId # (toText(ChunkNum))

public type VideoPic = [Nat8]; // encoded as a PNG file
public type ChunkData = [Nat8]; // encoded as ???

/// video information provided by front end to service, upon creation.
public type VideoInit = {
 userId : UserId;
 name: Text;
 createdAt : Timestamp;
 chunkCount: Nat;
};

/// video information provided by service to front end views -- Pic is separate query
public type VideoInfo = {
 videoId : VideoId;
 userId : UserId;
 pic: ?VideoPic;
 createdAt : Timestamp;
 uploadedAt : Timestamp;
 name: Text;
 chunkCount: Nat;
};

public type VideoResult = (VideoInfo, ?VideoPic);
public type VideoResults = [VideoResult];

/// For test scripts, the script controls how time advances, and when.
/// For real deployment, the service uses the IC system as the time source.
public type TimeMode = { #ic ; #script : Int };

/// CanCan canister's service type.
///
/// #### Conventions
///
/// - The service (not front end) generates unique ids for new profiles and videos.
/// - (On behalf of the user, the front end chooses the created profile's `userName`, not `userId`).
/// - Shared functions return `null` when given invalid IDs, or when they suffer other failures.
/// - The `Pic` param for putting Videos and Profiles is optional, and can be put separately from the rest of the info.
///   This de-coupled design is closer to how the front end used BigMap in its initial (current) design.
///
/// #### Naming conventions:
///
///  - three prefixes: `create`, `get` and `put`.
///  - `create`- prefix only for id-generating functions (only two).
///  - `get`- prefix for (query) calls that only ready data.
///  - `put`- prefix for (update) calls that overwrite data.
///
public type Service = actor {

  createProfile : (userName : Text, pic : ?ProfilePic) -> async ?UserId;
  getProfileInfo : query (userId : UserId) -> async ?ProfileInfo;
  getProfilePlus : query (userId : UserId) -> async ?ProfileInfoPlus;
  getProfilePic : query (userId : UserId) -> async ?ProfilePic;
  putProfilePic : (userId : UserId, pic : ?ProfilePic) -> async ?();
*/
//  getFeedVideos : /*query*/ (userId : UserId, limit : ?Nat) -> async ?VideoResults;
//  getProfileVideos : /*query*/ (userId : UserId, limit : ?Nat) -> async ?VideoResults;
/*  getSearchVideos : query (userId : UserId, terms : [Text], limit : ?Nat) -> async ?VideoResults;

  putProfileVideoLike : (userId : UserId, videoId : VideoId, likes : Bool) -> async ?();
  putProfileFollow : (userId : UserId, toFollow : UserId, follow : Bool) -> async ?();

  createVideo : (videoInfo : VideoInfo) -> async ?VideoId;

  getVideoInfo : query (videoId : VideoId) -> async ?VideoInfo;
  getVideoPic  : query (videoId : VideoId) -> async ?VideoPic;

  putVideoInfo : (videoId : VideoId, videoInfo : VideoInfo) -> async ?();
  putVideoPic  : (videoId : VideoId, pic : ?VideoPic) -> async ?();

  putVideoChunk : (videoId : VideoId, chunkNum : Nat, chunkData : ChunkData) -> async ?();
  getVideoChunk : query (videoId : VideoId, chunkNum : Nat) -> async ?ChunkData;

};

}
*/

