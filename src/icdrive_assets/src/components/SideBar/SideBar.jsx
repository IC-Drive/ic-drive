import React from 'react';

// 3rd party imports
import { message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  uploadUpdate, refreshFiles, switchHome, switchMarked, switchShared, uploadProgress, sizeUpdate, uploadFileId, SideBarShow,
} from '../../state/actions';

// custom imports
import DropboxImport from '../ImportFiles/DropboxImport';
import GoogleDriveImport from '../ImportFiles/GoogleDriveImport';
import { useUploadFile } from './File';
import '../../../assets/css/SideBar.css';

const SideBar = () => {
  const dispatch = useDispatch();
  const [uploadFlag, setUploadFlag] = React.useState(false);
  const [importModal, setImportModal] = React.useState(false);
  const optionSelected = useSelector((state) => state.OptionSelected.option);
  const uploadInProgress = useSelector((state) => state.FileHandler.upload);
  const sideBarShow = useSelector((state) => state.SideBarShow.sideBar);

  const onFileSelect = async (evt) => {
    dispatch(SideBarShow(!sideBarShow));
    if (uploadInProgress.file_count > 0) {
      message.info('Wait for previous files to upload!!!');
    } else {
      setUploadFlag(true);
      const fileList = evt.target.files;
      let folder = '';
      if (optionSelected === 'home' || optionSelected === 'marked' || optionSelected === 'shared' || optionSelected === 'search') {
        folder = '';
      } else {
        folder = optionSelected;
      }

      for (let i = 0; i < fileList.length; i += 1) {
        const file = fileList[i];
        dispatch(uploadUpdate({ file_uploading: file.name, file_count: fileList.length, completed: i + 1 }));
        dispatch(sizeUpdate(file.size));
        await useUploadFile(file, folder, dispatch, uploadProgress, uploadFileId);
      }
      dispatch(uploadUpdate({ file_uploading: '', file_count: 0, completed: 0 }));
      dispatch(refreshFiles(true));
      setUploadFlag(false);
    }
  };

  return (
    <div className="side-bar-container">
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
                        <input style={{ display: 'none' }} type="file" id="upload-file" onChange={(e) => { onFileSelect(e); }} className="file_upload" multiple />
                      </div>
                    </span>
                  </div>
                </div>
              </div>
            </label>
          )
        }
      <div className="side-bar-content">

        <div className="element">
          <div className="element-section" role="button" tabIndex={0} onClick={() => { dispatch(SideBarShow(!sideBarShow)); dispatch(switchHome('home')); }}>
            <div className="side-bar-icon-part">
              <img src="./icons/home.svg" alt="home icon" style={{ height: '22px', color: '#fff' }} />
            </div>
            <div className="side-bar-text-part">
              <span>Home</span>
            </div>
          </div>
        </div>

        <div className="element">
          <div className="element-section" role="button" tabIndex={0} onClick={() => { dispatch(SideBarShow(!sideBarShow)); dispatch(switchShared('shared')); }}>
            <div className="side-bar-icon-part">
              <img src="./icons/share.svg" alt="home icon" style={{ height: '22px', color: '#fff' }} />
            </div>
            <div className="side-bar-text-part">
              <span>Shared</span>
            </div>
          </div>
        </div>

        <div className="element">
          <div className="element-section" role="button" tabIndex={0} onClick={() => { dispatch(SideBarShow(!sideBarShow)); dispatch(switchMarked('marked')); }}>
            <div className="side-bar-icon-part">
              <img src="./icons/mark.svg" alt="home icon" style={{ height: '22px', color: '#fff' }} />
            </div>
            <div className="side-bar-text-part">
              <span>Marked</span>
            </div>
          </div>
        </div>

        <div className="element">
          <div className="element-section" onClick={() => { setImportModal(!importModal); }}>
            <div className="side-bar-icon-part">
              <img src="./icons/import.svg" alt="home icon" style={{ height: '22px', color: '#fff' }} />
            </div>
            <div className="side-bar-text-part">
              <span>Import</span>
            </div>
          </div>
          {
            importModal
              ? (
                <div style={{ display: 'flex' }}>
                  <div className="side-bar-import-icon-part-2">
                    <span><GoogleDriveImport /></span>
                  </div>
                  <div className="side-bar-import-icon-part-3" onClick={() => { setImportModal(false); }}>
                    <span><DropboxImport /></span>
                  </div>
                </div>
              )
              : null
          }
        </div>

      </div>
    </div>
  );
};

export default SideBar;
