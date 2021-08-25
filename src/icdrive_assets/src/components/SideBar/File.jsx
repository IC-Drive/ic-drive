import Resizer from 'react-image-file-resizer';
import { canisterHttpAgent } from '../../httpAgent';

const MAX_CHUNK_SIZE = 1024 * 1024 * 1.5; // 1.5MB

const encodeArrayBuffer = (file) => Array.from(new Uint8Array(file));

const resizeFile = (file) => new Promise((resolve) => {
  Resizer.imageFileResizer(
    file,
    70,
    58,
    'JPEG',
    100,
    0,
    (uri) => {
      resolve(uri);
    },
    'base64',
    70,
    58,
  );
});

const isImage = (mimeType) => {
  let flag = false;
  if (mimeType.indexOf('image') !== -1) {
    flag = true;
  }
  return (flag);
};

async function getFileInit(
  file, folder,
) {
  const chunkCount = Number(Math.ceil(file.size / MAX_CHUNK_SIZE));
  if (isImage(file.type)) {
    return {
      chunkCount,
      fileSize: file.size,
      name: file.name,
      mimeType: file.type,
      marked: false,
      sharedWith: [],
      thumbnail: await resizeFile(file),
      folder,
    };
  }
  return {
    chunkCount,
    fileSize: file.size,
    name: file.name,
    mimeType: file.type,
    marked: false,
    sharedWith: [],
    thumbnail: '',
    folder,
  };
}

export async function uploadFile(file, folder, userAgent, dispatch, uploadProgress, uploadFileId) {
  const fileInit = await getFileInit(file, folder);
  const [fileId] = await userAgent.createFile(fileInit, localStorage.getItem('userName'));
  dispatch(uploadFileId(fileId.toString()));

  let chunk = 1;

  for (
    let byteStart = 0;
    byteStart < file.size;
    byteStart += MAX_CHUNK_SIZE, chunk += 1
  ) {
    const fileSlice = file.slice(byteStart, Math.min(file.size, byteStart + MAX_CHUNK_SIZE), file.type);
    const fileSliceBuffer = (await fileSlice.arrayBuffer()) || new ArrayBuffer(0);
    const sliceToNat = encodeArrayBuffer(fileSliceBuffer);
    await userAgent.putFileChunk(fileId, chunk, sliceToNat);
    dispatch(uploadProgress(100 * (chunk / fileInit.chunkCount).toFixed(2)));

    if (chunk >= fileInit.chunkCount) {
      dispatch(uploadFileId(''));
      dispatch(uploadProgress(0));
    }
  }
}

export async function useUploadFile(file, folder, dispatch, uploadProgress, uploadFileId) {
  const userAgent = await canisterHttpAgent();
  console.info('Storing File...');
  try {
    await uploadFile(file, folder, userAgent, dispatch, uploadProgress, uploadFileId);
    console.timeEnd('Stored in');
  } catch (error) {
    console.error('Failed to store file.', error);
    return (0);
  }
}
