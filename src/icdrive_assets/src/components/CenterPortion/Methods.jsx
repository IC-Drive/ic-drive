// custom imports
import { httpAgent, canisterHttpAgent, httpAgentIdentity } from '../../httpAgent'
import { idlFactory as FileHandle_idl } from 'dfx-generated/FileHandle'
import { image_types, pdf_type } from './MimeTypes'

// 3rd party imports
//import * as streamSaver from 'streamsaver';
//import { WritableStream } from 'web-streams-polyfill/ponyfill'
import sha256 from 'sha256';
import { Actor } from '@dfinity/agent'
/* Contain Download, File View, Mark File, Delete File and File Share Implementation */

// Temporary method works well on small files
export const downloadFile = async (fileInfo) =>{
  const userAgent = await canisterHttpAgent();
  const chunkBuffers = [];
  for(let j=0; j<fileInfo["chunkCount"]; j++){
    const bytes = await userAgent.getFileChunk(fileInfo["fileId"], j+1);
    const bytesAsBuffer = new Uint8Array(bytes[0]);
    chunkBuffers.push(bytesAsBuffer);
  }
  
  const fileBlob = new Blob([Buffer.concat(chunkBuffers)], {
    type: fileInfo["mimeType"],
  });
  const fileURL = URL.createObjectURL(fileBlob);
  var link = document.createElement('a');
  link.href = fileURL;
  link.download = fileInfo["name"];
  document.body.appendChild(link);
  link.click();
}

export const viewFile = async(fileInfo) =>{
  // Currently View only image and pdf files
  let flag = 0
  for(let i=0; i<image_types.length;i++){
    if(fileInfo["mimeType"]===image_types[i]){
      flag=1
      break
    }
  }
  if(fileInfo["mimeType"].toString()===pdf_type){
    flag=1
  }

  // If file is image or pdf
  if(flag){
    const userAgent = await canisterHttpAgent();
    const chunkBuffers = [];
    for(let j=0; j<fileInfo["chunkCount"]; j++){
      const bytes = await userAgent.getFileChunk(fileInfo["fileId"], j+1);
      const bytesAsBuffer = new Uint8Array(bytes[0]);
      chunkBuffers.push(bytesAsBuffer);
    }
    const fileBlob = new Blob([Buffer.concat(chunkBuffers)], {
      type: fileInfo["mimeType"],
    });
    const fileURL = URL.createObjectURL(fileBlob);
    window.open(fileURL, '_blank');
    return(true)
  } else{
    return(false)
  }
}

export const markFile = async(fileInfo) =>{
  const userAgent = await canisterHttpAgent();
  await userAgent.markFile(fileInfo["fileId"]);
}

export const deleteFile = async(fileInfo) =>{
  const userAgent = await canisterHttpAgent();
  await userAgent.deleteFile(fileInfo["fileId"]);
}

export function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

//Temporary, relook the logic
export const shareFile = async(fileObj, userName) =>{
  const icdrive = await httpAgent();
  const userAgent = await canisterHttpAgent();

  let canisterIdShared = await icdrive.getUserCanister(userName)

  try{
    if(canisterIdShared.length===1){
      let resp_share = await userAgent.shareFile(fileObj["fileId"], userName, localStorage.getItem("userName"))
      if(resp_share[0]==="Success"){
        const identityAgent = await httpAgentIdentity()
        const userAgentShare = Actor.createActor(FileHandle_idl, { agent: identityAgent, canisterId: canisterIdShared[0] });
        let fileInfo = {
          fileId: fileObj["fileId"],
          userName: fileObj["userName"],
          createdAt: Date.now(),
          name: fileObj["name"],
          chunkCount: fileObj["chunkCount"],
          fileSize: fileObj["fileSize"],
          mimeType: fileObj["mimeType"],
          marked: false,
          sharedWith: []
        }
        let res = await userAgentShare.addSharedFile(fileInfo)
        return(true)
      }
    }else{
      return(false)
    }
  } catch(err){
    return(false)
  }
}

export const shareFilePublic = async(fileObj) =>{
  let flag = 0
  for(let i=0; i<image_types.length;i++){
    if(fileObj["mimeType"]===image_types[i]){
      flag=1
      break
    }
  }
  if(fileObj["mimeType"].toString()===pdf_type){
    flag=1
  }
  if(flag){
    const icdrive = await httpAgent();
    const userAgent = await canisterHttpAgent();
    let data = fileObj["mimeType"] + "$" + fileObj["chunkCount"].toString() + "$" + localStorage.getItem("fileCanister") + "$" + fileObj["fileId"];
    let hash = sha256(data);
    console.log(hash);
    await icdrive.makeFilePublic(hash, data);
    await userAgent.makeFilePublic(fileObj["fileId"], hash);
    return(hash)
  } else{
    return(false)
  }
}

export const downloadSharedFile = async (fileInfo, userName) =>{
  const icdrive = await httpAgent();
  const canisterIdShared = await icdrive.getUserCanister(fileInfo["userName"]); //Canister id of owner

  const identityAgent = await httpAgentIdentity();
  const userAgentShare = Actor.createActor(FileHandle_idl, { agent: identityAgent, canisterId: canisterIdShared[0] });
  
  const chunkBuffers = [];
  for(let j=0; j<fileInfo["chunkCount"]; j++){
    const bytes = await userAgentShare.getSharedFileChunk(fileInfo["fileId"], j+1, userName);
    const bytesAsBuffer = new Uint8Array(bytes[0]);
    chunkBuffers.push(bytesAsBuffer);
  }
  
  const fileBlob = new Blob([Buffer.concat(chunkBuffers)], {
    type: fileInfo["mimeType"],
  });
  const fileURL = URL.createObjectURL(fileBlob);
  var link = document.createElement('a');
  link.href = fileURL;
  link.download = fileInfo["name"];
  document.body.appendChild(link);
  link.click();
}

export const viewSharedFile = async(fileInfo, userName) =>{
  // Currently View only image and pdf files
  let flag = 0
  for(let i=0; i<image_types.length;i++){
    if(fileInfo["mimeType"]===image_types[i]){
      flag=1
      break
    }
  }
  if(fileInfo["mimeType"].toString()===pdf_type){
    flag=1
  }

  // If file is image or pdf
  if(flag){
    const icdrive = await httpAgent();
    const canisterIdShared = await icdrive.getUserCanister(fileInfo["userName"]); //Canister id of owner
    
    const identityAgent = await httpAgentIdentity();
    const userAgentShare = Actor.createActor(FileHandle_idl, { agent: identityAgent, canisterId: canisterIdShared[0] });

    const chunkBuffers = [];
    for(let j=0; j<fileInfo["chunkCount"]; j++){
      const bytes = await userAgentShare.getSharedFileChunk(fileInfo["fileId"], j+1, userName);
      const bytesAsBuffer = new Uint8Array(bytes[0]);
      chunkBuffers.push(bytesAsBuffer);
    }
    const fileBlob = new Blob([Buffer.concat(chunkBuffers)], {
      type: fileInfo["mimeType"],
    });
    const fileURL = URL.createObjectURL(fileBlob);
    window.open(fileURL, '_blank');
    return(true)
  } else{
    return(false)
  }
}

export const deleteSharedFile = async(fileInfo) =>{
  const userAgent = await canisterHttpAgent();
  await userAgent.deleteSharedFile(fileInfo["fileId"]);
}

/*----------------------------------------------Testing--------------------------------------*/
// For large files not working on firefox to be fixed
  /*const download = async (fileId, chunk_count, fileName) => {
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
  };*/
