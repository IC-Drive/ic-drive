import Hash "mo:base/Hash";
import Prelude "mo:base/Prelude";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Trie "mo:base/Trie";
import TrieMap "mo:base/TrieMap";

// types in separate file
import Types "./types";

/// Internal CanCan canister state.
module {

  // Our representation of finite mappings.
  public type MapShared<X, Y> = Trie.Trie<X, Y>;
  public type Map<X, Y> = TrieMap.TrieMap<X, Y>;

  public type ChunkId = Types.ChunkId;
  public type ChunkData = Types.ChunkData;

  public type State = {

    /// all videos.
    videos : Map<Types.VideoId, Video>;

    /// all chunks.
    chunks : Map<Types.ChunkId, ChunkData>;
  };

  /// Video.
  public type Video = {
    userId : Types.UserId;
    createdAt : Types.Timestamp;
    uploadedAt : Types.Timestamp;
    name: Text;
    chunkCount: Nat;
  };

  /*public func empty (init : { admin : Principal }) : State {
    let equal = (Text.equal, Text.equal);
    let hash = (Text.hash, Text.hash);
    
    // not a very good hash, but we are not using the hash
    func messageHash(m: Types.Message) : Hash.Hash = Int.hash(m.time);
    let uploaded_ = RelObj.RelObj<Types.UserId, Types.VideoId>(hash, equal);
    let st : State = {
      access = Access.Access({ admin = init.admin ; uploaded = uploaded_ });
      profiles = TrieMap.TrieMap<Types.UserId, Profile>(Text.equal, Text.hash);
      chunks = TrieMap.TrieMap<ChunkId, ChunkData>(Text.equal, Text.hash);
      videos = TrieMap.TrieMap<Types.VideoId, Video>(Text.equal, Text.hash);
      videoPics = TrieMap.TrieMap<Types.VideoId, Types.VideoPic>(Text.equal, Text.hash);
      uploaded = uploaded_;
    };
    st
  };*/
}
