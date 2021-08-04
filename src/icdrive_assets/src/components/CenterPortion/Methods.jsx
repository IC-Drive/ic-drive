// custom imports
//import { idlFactory as FileHandleIdl } from 'dfx-generated/FileHandle/FileHandle.did.js';

// 3rd party imports
// import * as streamSaver from 'streamsaver';
// import { WritableStream } from 'web-streams-polyfill/ponyfill'
import sha256 from 'sha256';
//import { Actor } from '@dfinity/agent';
import { imageTypes, pdfType } from './MimeTypes';
//import { httpAgent, canisterHttpAgent, httpAgentIdentity } from '../../httpAgent';

import { icdrive } from "../../../../declarations/icdrive";
import { createActor } from "../../../../declarations/FileHandle";

/* Contain Download, File View, Mark File, Delete File and File Share Implementation */

// Temporary method works well on small files
export const downloadFile = async (fileInfo) => {
  const userAgent = createActor(localStorage.getItem('fileCanister'));
  const chunkBuffers = [];
  for (let j = 0; j < fileInfo.chunkCount; j += 1) {
    const bytes = await userAgent.getFileChunk(fileInfo.fileId, j + 1);
    const bytesAsBuffer = new Uint8Array(bytes[0]);
    chunkBuffers.push(bytesAsBuffer);
  }

  const fileBlob = new Blob([Buffer.concat(chunkBuffers)], {
    type: fileInfo.mimeType,
  });
  const fileURL = URL.createObjectURL(fileBlob);
  const link = document.createElement('a');
  link.href = fileURL;
  link.download = fileInfo.name;
  document.body.appendChild(link);
  link.click();
};

export const viewFile = async (fileInfo) => {
  // Currently View only image and pdf files
  let flag = 0;
  for (let i = 0; i < imageTypes.length; i += 1) {
    if (fileInfo.mimeType === imageTypes[i]) {
      flag = 1;
      break;
    }
  }
  if (fileInfo.mimeType.toString() === pdfType) {
    flag = 1;
  }

  // If file is image or pdf
  if (flag) {
    const userAgent = createActor(localStorage.getItem('fileCanister'));
    const chunkBuffers = [];
    for (let j = 0; j < fileInfo.chunkCount; j += 1) {
      const bytes = await userAgent.getFileChunk(fileInfo.fileId, j + 1);
      const bytesAsBuffer = new Uint8Array(bytes[0]);
      chunkBuffers.push(bytesAsBuffer);
    }
    const fileBlob = new Blob([Buffer.concat(chunkBuffers)], {
      type: fileInfo.mimeType,
    });
    const fileURL = URL.createObjectURL(fileBlob);
    window.open(fileURL, '_blank');
    return (true);
  }
  return (false);
};

export const markFile = async (fileInfo) => {
  const userAgent = createActor(localStorage.getItem('fileCanister'));
  await userAgent.markFile(fileInfo.fileId);
};

export const deleteFile = async (fileInfo) => {
  const userAgent = createActor(localStorage.getItem('fileCanister'));
  await userAgent.deleteFile(fileInfo.fileId);
};

export function bytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  return `${Math.round(bytes / Math.pow(1024, i), 2)} ${sizes[i]}`;
}

// Temporary, relook the logic
export const shareFile = async (fileObj, userName) => {
  const userAgent = createActor(localStorage.getItem('fileCanister'));

  const canisterIdShared = await icdrive.getUserCanister(userName);
  try {
    if (canisterIdShared.length === 1) {
      const respShare = await userAgent.shareFile(fileObj.fileId, userName, localStorage.getItem('userName'));
      if (respShare[0] === 'Success') {
        const userAgentShare = createActor(canisterIdShared[0]);
        const fileInfo = {
          fileId: fileObj.fileId,
          userName: fileObj.userName,
          createdAt: Date.now(),
          name: fileObj.name,
          chunkCount: fileObj.chunkCount,
          fileSize: fileObj.fileSize,
          mimeType: fileObj.mimeType,
          marked: false,
          sharedWith: [],
          madePublic: false,
          fileHash: "",
        };
        await userAgentShare.addSharedFile(fileInfo);
        return (true);
      }
    } else {
      return (false);
    }
  } catch (err) {
    return (false);
  }
};

export const shareFilePublic = async (fileObj) => {
  let flag = 0;
  for (let i = 0; i < imageTypes.length; i += 1) {
    if (fileObj.mimeType === imageTypes[i]) {
      flag = 1;
      break;
    }
  }
  if (fileObj.mimeType.toString() === pdfType) {
    flag = 1;
  }
  if (flag) {
    const userAgent = createActor(localStorage.getItem('fileCanister'));
    const data = `${fileObj.mimeType}$${fileObj.chunkCount.toString()}$${localStorage.getItem('fileCanister')}$${fileObj.fileId}`;
    const fileHash = sha256(data);
    await icdrive.makeFilePublic(fileHash, data);
    await userAgent.makeFilePublic(fileObj.fileId, fileHash);
    return (fileHash);
  }
  return (false);
};

export const removeFilePublic = async (fileObj) => {
  const userAgent = createActor(localStorage.getItem('fileCanister'));
  await icdrive.removeFilePublic(fileObj.fileHash);
  await userAgent.removeFilePublic(fileObj.fileId);
  return (true);
};

export const downloadSharedFile = async (fileInfo, userName) => {
  const canisterIdShared = await icdrive.getUserCanister(fileInfo.userName); // Canister id of owner

  const userAgentShare = createActor(canisterIdShared[0]);

  const chunkBuffers = [];
  for (let j = 0; j < fileInfo.chunkCount; j += 1) {
    const bytes = await userAgentShare.getSharedFileChunk(fileInfo.fileId, j + 1, userName);
    const bytesAsBuffer = new Uint8Array(bytes[0]);
    chunkBuffers.push(bytesAsBuffer);
  }

  const fileBlob = new Blob([Buffer.concat(chunkBuffers)], {
    type: fileInfo.mimeType,
  });
  const fileURL = URL.createObjectURL(fileBlob);
  const link = document.createElement('a');
  link.href = fileURL;
  link.download = fileInfo.name;
  document.body.appendChild(link);
  link.click();
};

export const viewSharedFile = async (fileInfo, userName) => {
  // Currently View only image and pdf files
  let flag = 0;
  for (let i = 0; i < imageTypes.length; i += 1) {
    if (fileInfo.mimeType === imageTypes[i]) {
      flag = 1;
      break;
    }
  }
  if (fileInfo.mimeType.toString() === pdfType) {
    flag = 1;
  }

  // If file is image or pdf
  if (flag) {
    const canisterIdShared = await icdrive.getUserCanister(fileInfo.userName); // Canister id of owner

    const userAgentShare = createActor(canisterIdShared[0]);

    const chunkBuffers = [];
    for (let j = 0; j < fileInfo.chunkCount; j += 1) {
      const bytes = await userAgentShare.getSharedFileChunk(fileInfo.fileId, j + 1, userName);
      const bytesAsBuffer = new Uint8Array(bytes[0]);
      chunkBuffers.push(bytesAsBuffer);
    }
    const fileBlob = new Blob([Buffer.concat(chunkBuffers)], {
      type: fileInfo.mimeType,
    });
    const fileURL = URL.createObjectURL(fileBlob);
    window.open(fileURL, '_blank');
    return (true);
  }
  return (false);
};

export const deleteSharedFile = async (fileInfo) => {
  const userAgent = createActor(localStorage.getItem('fileCanister'));
  await userAgent.deleteSharedFile(fileInfo.fileId);
};

export const sendFeedback = async (feed) => {
  await icdrive.addFeedback(feed);
};

/* ----------------------------------------------Testing--------------------------------------*/
// For large files not working on firefox to be fixed
/* const download = async (fileId, chunk_count, fileName) => {
    streamSaver.WritableStream = WritableStream
    streamSaver.mitm = 'http://localhost:8000/mitm.html'
    const fileStream = streamSaver.createWriteStream(fileName);
    const writer = fileStream.getWriter();
    for(let j=0; j<chunk_count; j++){
      const bytes = await icdrive.getFileChunk(fileId, j+1);
      //const bytesAsBuffer = Buffer.from(new Uint8Array(bytes[0]));
      const bytesAsBuffer = new Uint8Array(bytes[0]);
      writer.write(bytesAsBuffer);
    }
    writer.close();
  }; */
