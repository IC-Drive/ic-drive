import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import photo_application from 'ic:canisters/photo_application';
import { useUploadVideo } from "./video.jsx";

const UploadFiles = () =>{

  const [videoFile, setVideoFile] = useState();
  const [uploading, setUploading] = useState(false);
  const [uploadingClean, setUploadingClean] = useState(true);
  const [id, setId] = React.useState("6xdxb-7x3to-6jznm-nkldc-5n76r-csrgg-47owm-hbc3p-5zblf-eongq-rqe")
  const videoUploadController = useUploadVideo(id);

  useEffect(async () => {
    const id = await photo_application.getOwnId()
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
    const videoId = "6xdxb-7x3to-6jznm-nkldc-5n76r-csrgg-47owm-hbc3p-5zblf-eongq-rqe-VID_20200116_195645-1621593711132203605"
    const resultFromCanCan = await photo_application.getVideoInfo(videoId);
    console.log(resultFromCanCan)
  }
  // Wraps and triggers several functions in the videoUploadController to
  // generate a videoId and begin uploading.
  function upload() {
    
    videoUploadController.setFile(videoFile);
//    videoUploadController.setCaption(caption);
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
        
        accept=".mp4"
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
    </main>
  )
}

export default UploadFiles;

