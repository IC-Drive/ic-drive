import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import icdrive from 'ic:canisters/icdrive';
import { useUploadVideo } from "./video.jsx";

const UploadFiles = () =>{

  const [videoFile, setVideoFile] = useState();
  const [uploading, setUploading] = useState(false);
  const [uploadingClean, setUploadingClean] = useState(true);
  const [id, setId] = React.useState("6xdxb-7x3to-6jznm-nkldc-5n76r-csrgg-47owm-hbc3p-5zblf-eongq-rqe")
  const videoUploadController = useUploadVideo(id);
  const [i, setI] = useState("");

  useEffect(async () => {
    const id = await icdrive.getOwnId()
    //console.log(id)
    setId(id)
  }, []);

  useEffect(() => {
    if (uploading && uploadingClean) {
      setUploadingClean(false);
    }
  }, [uploading]);

  async function onChange(evt) {
    const { files } = evt.target;
    if (files && files.length === 1 && files.item(0)) {
      const file = files[0];
      setVideoFile(file);
      console.log(file)
    }
  }
  
  async function videoInfo() {
    //const videoId = "6xdxb-7x3to-6jznm-nkldc-5n76r-csrgg-47owm-hbc3p-5zblf-eongq-rqe-VID_20200116_195645-1621593711132203605"
    const resultFromCanCan = await icdrive.getFiles();
    console.log(resultFromCanCan)
    for(let i=0; i<resultFromCanCan.length; i++){
      if(resultFromCanCan[i][0]["name"].split(".")[1]==="jpeg" || resultFromCanCan[i][0]["name"].split(".")[1]==="jpg" || resultFromCanCan[i][0]["name"].split(".")[1]==="png"){
        let c_count = resultFromCanCan[i][0]["chunkCount"]["c"][0]
        const chunkBuffers = [];
        for(let j=0; j<c_count; j++){
          const bytes = await icdrive.getFileChunk(resultFromCanCan[i][0]["fileId"], j+1);
          const bytesAsBuffer = Buffer.from(new Uint8Array(bytes[0]));
          console.log(bytes)
          console.log(bytesAsBuffer)
          chunkBuffers.push(bytesAsBuffer);
          console.log(chunkBuffers)
        }
        const picBlob = new Blob([Buffer.concat(chunkBuffers)], {
          type: "image/jpeg",
        });
        console.log(picBlob)
        const pic = URL.createObjectURL(picBlob);
        console.log(pic)
        setI(pic)
        //const picBlob = new Blob([Buffer.concat(chunkBuffers)], {
        //  type: "image/jpeg",
        //});
        
      }
    }
  }
  // Wraps and triggers several functions in the videoUploadController to
  // generate a videoId and begin uploading.
  function upload() {
    
    videoUploadController.setFile(videoFile);
    videoUploadController.setReady(true);
    setUploading(true);
  }

  return(
    <main
      id="video-upload-container"
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      
      <input
        
        id="video-upload"
        type="file"
        onChange={onChange}
      />
      {videoFile && (
        <div className="video-add-details">
          
          <div className="details-entry">
            <button className="medium primary" onClick={upload}>
              Post
            </button>
            <button className="medium primary" onClick={videoInfo}>
              videoInfo
            </button>
          </div>
        </div>
      )}
      <img src={i} />
    </main>
  )
}

export default UploadFiles;

