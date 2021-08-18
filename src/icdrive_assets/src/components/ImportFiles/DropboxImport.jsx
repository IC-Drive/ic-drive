import React from "react"
import axios from 'axios';
import DropboxChooser from './DropBoxChooser';
import { canisterHttpAgent } from '../../httpAgent';
import { uploadUpdate, refreshFiles, uploadProgress, sizeUpdate } from '../../state/actions';
import { useDispatch } from 'react-redux';

const DropboxImport = () =>{

  const dispatch = useDispatch();

  const CLIENT_ID = 'owuibsvme6i5k4w';
  const MAX_CHUNK_SIZE = 1024 * 1024 * 1.5; // 1.5MB
  const encodeArrayBuffer = (file) => Array.from(new Uint8Array(file));

  const onSuccess = async(file) =>{
    for(let i=0; i<file.length; i+=1){
      dispatch(uploadUpdate({ file_uploading: file[i]['name'], file_count: file.length, completed: i + 1 }));
      dispatch(sizeUpdate(file[i]['bytes']));

      let response = await axios({
        method: "get",
        url: file[i]['link'],
        responseType: "stream",
        responseType: 'blob',
      })

      let data = await response.data;
      const chunkCount = Number(Math.ceil(file[i]['bytes'] / MAX_CHUNK_SIZE));
      
      let fileInit = {
        chunkCount: chunkCount,
        fileSize: file[i]['bytes'],
        name: file[i]['name'],
        mimeType: data.type,
        marked: false,
        sharedWith: [],
        thumbnail: '',
        folder: '',
      }
        
      const userAgent = await canisterHttpAgent();
      const [fileId] = await userAgent.createFile(fileInit, localStorage.getItem('userName'));

      let chunk = 1;

      for (
        let byteStart = 0;
        byteStart < file[i]['bytes'];
        byteStart += MAX_CHUNK_SIZE, chunk += 1
      ) {
        const fileSlice = data.slice(byteStart, Math.min(file[i]['bytes'], byteStart + MAX_CHUNK_SIZE));
        const fileSliceBuffer = (await fileSlice.arrayBuffer()) || new ArrayBuffer(0);
        const sliceToNat = encodeArrayBuffer(fileSliceBuffer);
        await userAgent.putFileChunk(fileId, chunk, sliceToNat);
        dispatch(uploadProgress(100 * (chunk / fileInit.chunkCount).toFixed(2)));
      }
    }
    dispatch(uploadUpdate({ file_uploading: '', file_count: 0, completed: 0 }));
    dispatch(refreshFiles(true));
  }

  const onCancel = () =>{
    
  }

  return (
    <div className="dropbox-container">
      <DropboxChooser 
          appKey={CLIENT_ID}
          success={files => onSuccess(files)}
          cancel={() => onCancel()}
          multiselect={true}
          linkType= "direct"
          extensions={['.pdf', '.doc', '.docx']} >
          <div className="dropbox-button"><img height="24px" src="./icons/dropbox-icon.png"/></div>        
      </DropboxChooser>
    </div>
  );
}

export default DropboxImport;