import React from 'react';
import styled from 'styled-components';

// custom imports
import { useDispatch } from 'react-redux';
import { useUploadFile } from './File';

// 3rd party imports
import {
  uploadUpdate, refreshFiles, switchHome, switchMarked, switchShared, uploadProgress, sizeUpdate, uploadFileId,
} from '../../state/actions';

const SideBar = () => {
  const dispatch = useDispatch();
  const [uploadFlag, setUploadFlag] = React.useState(false);

  const onFileSelect = async (evt) => {
    setUploadFlag(true);
    const fileList = evt.target.files;
    for (let i = 0; i < fileList.length; i += 1) {
      const file = fileList[i];
      dispatch(uploadUpdate({ file_uploading: file.name, file_count: fileList.length, completed: i + 1 }));
      dispatch(sizeUpdate(file.size));
      await useUploadFile(file, dispatch, uploadProgress, uploadFileId);
    }
    dispatch(uploadUpdate({ file_uploading: '', file_count: 0, completed: 0 }));
    dispatch(refreshFiles(true));
    setUploadFlag(false);
  };

  return (
    <Style>
      <div className="container">
        {
          uploadFlag
            ? (
              <div className="upload-button">
                <div className="upload-element-section active">
                  <div className="upload-icon-part">
                    <img src="./icons/upload.svg" alt="upload icon" style={{ height: '22px', color: '#fff' }} />
                  </div>
                  <div className="upload-text-part">
                    <span>Upload</span>
                  </div>
                </div>
              </div>
            )
            : (
              <label id="label-file" htmlFor="upload-file">
                <div className="upload-button">
                  <div className="upload-element-section inactive">
                    <div className="upload-icon-part">
                      <img src="./icons/upload.svg" alt="upload icon" style={{ height: '22px', color: '#fff' }} />
                    </div>
                    <div className="upload-text-part">
                      <span>
                        <div>
                          Upload
                          <input type="file" id="upload-file" onChange={onFileSelect} className="file_upload" multiple />
                        </div>
                      </span>
                    </div>
                  </div>
                </div>
              </label>
            )
          }
        <div className="content">

          <div className="element">
            <div className="element-section" role="button" tabIndex={0} onClick={() => { dispatch(switchHome('home')); }}>
              <div className="icon-part">
                <img src="./icons/home.svg" alt="home icon" style={{ height: '22px', color: '#fff' }} />
              </div>
              <div className="text-part">
                <span>Home</span>
              </div>
            </div>
          </div>

          <div className="element">
            <div className="element-section" role="button" tabIndex={0} onClick={() => { dispatch(switchShared('shared')); }}>
              <div className="icon-part">
                <img src="./icons/share.svg" alt="home icon" style={{ height: '22px', color: '#fff' }} />
              </div>
              <div className="text-part">
                <span>Shared</span>
              </div>
            </div>
          </div>

          <div className="element">
            <div className="element-section" role="button" tabIndex={0} onClick={() => { dispatch(switchMarked('marked')); }}>
              <div className="icon-part">
                <img src="./icons/mark.svg" alt="home icon" style={{ height: '22px', color: '#fff' }} />
              </div>
              <div className="text-part">
                <span>Marked</span>
              </div>
            </div>
          </div>

          <div className="element">
            <div className="element-section">
              <div className="icon-part">
                <img src="./icons/import.svg" alt="home icon" style={{ height: '22px', color: '#fff' }} />
              </div>
              <div className="text-part">
                <span>Import</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Style>
  );
};

export default SideBar;

const Style = styled.div`
  .container{
    background: #324851;
    height: calc(100vh - 50px);
    width: 225px;
  }
  .content{
    padding-top: 20px;
  }
  .element{
    
  }
  .element-section{
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .text-part{
    font-size: 20px;
    font-weight: 400;
    padding-left: 30px;
  }
  .icon-part{
    padding-left: 22.5px;
  }
  .element-section:hover{
    cursor: pointer;
    background: #425757;
    border-radius: 10px;
  }
  .file_upload {
    opacity: 0.0;
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
    filter: alpha(opacity=0);
    -moz-opacity: 0.0;
    -khtml-opacity: 0.0;
  }
  #upload-file {
    opacity: 0;
    position: absolute;
    z-index: -1;
  }
  #label-file:hover {
    cursor: pointer;
  }

  .upload-button{
    padding-top: 25px;
    padding-left: 22.5px;
  }
  .upload-element-section{
    border-radius: 20px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 170px;
    height: 50px;
  }
  .active{
    background: #eaeaea;
  }
  .inactive{
    background: #7DA3A1;
  }
  .upload-text-part{
    font-size: 20px;
    font-weight: 400;
    padding-left: 20px;
  }
  .upload-icon-part{
    padding-left: 22.5px;
  }
`;
