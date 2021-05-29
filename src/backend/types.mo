import Principal "mo:base/Principal";
import TrieMap "mo:base/TrieMap";
import Hash "mo:base/Hash";
import Text "mo:base/Text";
import Int "mo:base/Int";

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

