import { useEffect, useState } from "react";
import icdrive from 'ic:canisters/icdrive';

const MAX_CHUNK_SIZE = 1024 * 500; // 500kb

// Divides the file into chunks and uploads them to the canister in sequence
async function processAndUploadChunk(
  videoBuffer,
  byteStart,
  videoSize,
  videoId,
  chunk
) {
  const videoSlice = videoBuffer.slice(
    byteStart,
    Math.min(videoSize, byteStart + MAX_CHUNK_SIZE)
  );
  const sliceToNat = encodeArrayBuffer(videoSlice);
  console.log("slice")
  console.log(sliceToNat)
  icdrive.putFileChunk(videoId, chunk, sliceToNat);
  console.log("done")
  return 1;
}

const encodeArrayBuffer = (file) =>
  Array.from(new Uint8Array(file));

export function getVideoInit(
    userId,
    file
  ) {
    const chunkCount = Number(Math.ceil(file.size / MAX_CHUNK_SIZE));
    return {
      chunkCount,
      // @ts-ignore
      createdAt: Number(Date.now() * 1000), // motoko is using nanoseconds
      name: file.name.replace(/\.mp4/, ""),
      userId,
    };
}

// Wraps up the previous functions into one step for the UI to trigger
async function uploadVideo(userId, file) {
  console.log("uid")
  console.log(userId)
  //let reader = new FileReader();
  //const videoBuffer = (await reader.readAsArrayBuffer(file)) || new ArrayBuffer(0);
  const id = await icdrive.getOwnId()
  const videoBuffer = (await file.arrayBuffer()) || new ArrayBuffer(0);
  const videoInit = getVideoInit(id, file);
  console.log("videoInit")
  console.log(videoInit)
  let videoId = await icdrive.createFile(videoInit);
  videoId = videoId[0]
  let chunk = 1;
  //const thumb = await generateThumbnail(file);
  //await uploadVideoPic(videoId, thumb);

  //const putChunkPromises = Promise<[] | [null]>[];
  for (
    let byteStart = 0;
    byteStart < file.size;
    byteStart += MAX_CHUNK_SIZE, chunk++
  ) {
    await processAndUploadChunk(videoBuffer, byteStart, file.size, videoId, chunk)
  }
  console.log("resultFromCanCan")
  console.log(typeof(videoId))
  const resultFromCanCan = await icdrive.getFileInfo(videoId);
  console.log(resultFromCanCan)
  //console.log("put chunk promise")
  //console.log(putChunkPromises)
  //await Promise.all(putChunkPromises);

  //return await checkVidFromIC(videoId);
}

export function useUploadVideo(userId) {
  //const [completedVideo, setCompletedVideo] = useState<VideoInfo>();
  const [file, setFile] = useState();
  const [ready, setReady] = useState(false);

  async function handleUpload(fileToUpload) {
    console.info("Storing video...");
    try {
      console.time("Stored in");
      const video = await uploadVideo(userId, fileToUpload);

      //setCompletedVideo(video);
      setReady(false);
      setFile(undefined);
      console.timeEnd("Stored in");
    } catch (error) {
      console.error("Failed to store video.", error);
    }
  }

  useEffect(() => {
    if (ready && file !== undefined) {
      handleUpload(file);
    }
  }, [ready]);

  return {
    setFile,
    setReady,
  };
}
