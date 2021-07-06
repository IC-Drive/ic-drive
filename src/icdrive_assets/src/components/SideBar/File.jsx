import {canisterHttpAgent} from '../../httpAgent'

const MAX_CHUNK_SIZE = 1024 * 1024 * 2; // 4MB

const encodeArrayBuffer = (file) =>
  Array.from(new Uint8Array(file));

function getFileInit(
    file
  ) {
    const chunkCount = Number(Math.ceil(file.size / MAX_CHUNK_SIZE));
    return {
      chunkCount,
      fileSize: file.size,
      name: file.name,
      mimeType: file.type,
      marked: false,
      sharedWith: []
    };
}

async function uploadFile(file, userAgent, dispatch, uploadProgress, uploadFileId) {
  const fileInit = getFileInit(file);
  let fileId = await userAgent.createFile(fileInit, parseInt(localStorage.getItem("userNumber")));
  fileId = fileId[0]
  console.log("id")
  console.log(fileId)
  dispatch(uploadFileId(fileId.toString()));
  console.log("file id")
  let file_obj = {
    chunkCount: fileInit["chunkCount"],
    fileSize: file.size,
    fileId: fileId,
    name: file.name,
    marked: false,
    sharedWith: [],
    mimeType: fileInit["mimeType"]
  }
  
  let chunk = 1;

  for (
    let byteStart = 0;
    byteStart < file.size;
    byteStart += MAX_CHUNK_SIZE, chunk++
  ) {
    let fileSlice = file.slice(byteStart, Math.min(file.size, byteStart + MAX_CHUNK_SIZE))
    let fileSliceBuffer = (await fileSlice.arrayBuffer()) || new ArrayBuffer(0);
    const sliceToNat = encodeArrayBuffer(fileSliceBuffer);
    await userAgent.putFileChunk(fileId, chunk, sliceToNat);
    
    dispatch(uploadProgress(100*(chunk/file_obj["chunkCount"]).toFixed(2)));

    if(chunk >= fileInit["chunkCount"]){
      dispatch(uploadFileId(""));
      dispatch(uploadProgress(0))
      return(file_obj)
    }
  }
}

export async function useUploadFile(file, dispatch, uploadProgress, uploadFileId) {
  const userAgent = await canisterHttpAgent();
  console.info("Storing File...");
  try {
    console.time("Stored in");
    const file_obj = await uploadFile(file, userAgent, dispatch, uploadProgress, uploadFileId);
    console.timeEnd("Stored in");
    console.log(file_obj);
    return(file_obj);
  } catch (error) {
    console.error("Failed to store file.", error);
    return(0);
  }
}