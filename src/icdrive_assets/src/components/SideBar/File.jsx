import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as icdrive_idl, canisterId as icdrive_id } from 'dfx-generated/icdrive';

const agent = new HttpAgent();
const icdrive = Actor.createActor(icdrive_idl, { agent, canisterId: icdrive_id });

const MAX_CHUNK_SIZE = 1024 * 500; // 500kb

// Divides the file into chunks and uploads them to the canister in sequence
async function processAndUploadChunk(
  fileBuffer,
  byteStart,
  fileSize,
  fileId,
  chunk
) {
  const fileSlice = fileBuffer.slice(
    byteStart,
    Math.min(fileSize, byteStart + MAX_CHUNK_SIZE)
  );
  const sliceToNat = encodeArrayBuffer(fileSlice);
  //console.log("slice")
  //console.log(sliceToNat)
  icdrive.putFileChunk(fileId, chunk, sliceToNat);
  //console.log("done")
  return 1;
}

const encodeArrayBuffer = (file) =>
  Array.from(new Uint8Array(file));

function getFileInit(
    userId,
    file
  ) {
    const chunkCount = Number(Math.ceil(file.size / MAX_CHUNK_SIZE));
    return {
      chunkCount,
      createdAt: Number(Date.now() * 1000), // motoko is using nanoseconds
      name: file.name.replace(/\.mp4/, ""),
      userId,
    };
}

// Wraps up the previous functions into one step for the UI to trigger
async function uploadFile(userId, file) {
  const fileBuffer = (await file.arrayBuffer()) || new ArrayBuffer(0);
  const fileInit = getFileInit(userId, file);
  let fileId = await icdrive.createFile(fileInit);
  fileId = fileId[0]

  let file_obj = {
    chunkCount: fileInit["chunkCount"],
    createdAt: fileInit["createdAt"],
    fileId: fileId,
    name: file.name,
    userId: userId
  }

  let chunk = 1;
  
  for (
    let byteStart = 0;
    byteStart < file.size;
    byteStart += MAX_CHUNK_SIZE, chunk++
  ) {
    await processAndUploadChunk(fileBuffer, byteStart, file.size, fileId, chunk)
    if(chunk >= fileInit["chunkCount"]){
      return(file_obj)
    }
  }
}

export async function useUploadFile(userId, file) {
  console.info("Storing File...");
  try {
    console.time("Stored in");
    const file_obj = await uploadFile(userId, file);
    console.timeEnd("Stored in");
    return(file_obj);
  } catch (error) {
    console.error("Failed to store file.", error);
    return(0);
  }
}