import React from "react"
import axios from 'axios';
import mimetypes from './mimetypes';
import useDrivePicker from 'react-google-drive-picker'
import { canisterHttpAgent } from '../../httpAgent';
import { uploadUpdate, refreshFiles, uploadProgress, sizeUpdate } from '../../state/actions';
import { useDispatch } from 'react-redux';

const GoogleDriveImport = () =>{

  const dispatch = useDispatch();

  const MAX_CHUNK_SIZE = 1024 * 1024 * 1.5; // 1.5MB
  const encodeArrayBuffer = (file) => Array.from(new Uint8Array(file));

  const [openPicker, data, authResponse] = useDrivePicker();  
  // const customViewsArray = [new google.picker.DocsView()]; // custom view

  React.useEffect(() =>{
    const startUpload = async()=>{
      if(data){
        let file = data.docs
        for(let i=0; i<file.length; i+=1){
          dispatch(uploadUpdate({ file_uploading: file[i]['name'], file_count: file.length, completed: i + 1 }));
          dispatch(sizeUpdate(file[i]['sizeBytes']));
          const chunkCount = Number(Math.ceil(file[i]['sizeBytes'] / MAX_CHUNK_SIZE));

          let fileInit = {
            chunkCount: chunkCount,
            fileSize: file[i]['sizeBytes'],
            name: file[i]['name'],
            mimeType: file[i]['mimeType'],
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
            byteStart < file[i]['sizeBytes'];
            byteStart += MAX_CHUNK_SIZE, chunk += 1
          ) {

            let response = await axios({
              method: "GET",
              headers:{
                'Authorization': `Bearer ${authResponse.access_token}`,
                'Range': `bytes=${byteStart}-${Math.min(file[i]['sizeBytes'], byteStart + MAX_CHUNK_SIZE)}`
              },
              url: 'https://www.googleapis.com/drive/v3/files/'+file[i]['id']+'?alt=media',
              // responseType: "stream",
              responseType: 'blob',
            })

            //const fileSlice = data.slice(byteStart, Math.min(file[i]['sizeBytes'], byteStart + MAX_CHUNK_SIZE));
            const fileSlice = response.data;
            const fileSliceBuffer = (await fileSlice.arrayBuffer()) || new ArrayBuffer(0);
            const sliceToNat = encodeArrayBuffer(fileSliceBuffer);
            await userAgent.putFileChunk(fileId, chunk, sliceToNat);
            dispatch(uploadProgress(100 * (chunk / fileInit.chunkCount).toFixed(2)));
          }
          dispatch(uploadUpdate({ file_uploading: '', file_count: 0, completed: 0 }));
          dispatch(refreshFiles(true));
        }
      }
    }
    startUpload()
  }, [data])

  const handleOpenPicker = () => {
    openPicker({
      clientId: "38299970165-o2f1srqnhu7gvn8mgsnbi6ldst5sejem.apps.googleusercontent.com",
      developerKey: "AIzaSyAE1DWpTCUaiGsWfdcK3sN1fYavB4obU9I",
      viewId: "DOCS",
      viewMimeTypes: mimetypes,
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      customScopes: ['https://www.googleapis.com/auth/drive.readonly']
      // customViews: customViewsArray, // custom view
    })
  }

  return (
    <div className="google-container">
      <img onClick={()=>handleOpenPicker()} height="24px" src="./icons/google-drive.png" />
    </div>
  );
}

export default GoogleDriveImport;