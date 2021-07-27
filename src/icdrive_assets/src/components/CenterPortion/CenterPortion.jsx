import React from 'react';
import '../../../assets/css/CenterPortion.css';

// custom imports
import { Progress } from 'antd';
import { useSelector } from 'react-redux';
import {
  MenuOutlined, AppstoreOutlined, CaretDownOutlined, CaretUpOutlined,
} from '@ant-design/icons';
import ListView from './Home/ListView';
import GridView from './Home/GridView';
import ListViewMarked from './Marked/ListViewMarked';
import ListViewShared from './Shared/ListViewShared';
import GridViewMarked from './Marked/GridViewMarked';
import GridViewShared from './Shared/GridViewShared';

// 3rd party imports

const CenterPortion = () => {
  const [selectedView, setSelectedView] = React.useState('gridView');
  const [minimizeUpload, setMinimizeUpload] = React.useState(false);
  const uploadInProgress = useSelector((state) => state.FileHandler.upload);
  const optionSelected = useSelector((state) => state.OptionSelected.option);
  const uploadProgress = useSelector((state) => state.UploadProgress.progress);
  const uploadSize = useSelector((state) => state.UploadProgress.size);

  return (
    <div className="central-portion-container">
      <div className="central-portion-top-bar">
        <div>
          {
          optionSelected === 'home' ? (
            <div className="show-section">
            &nbsp;&nbsp;Home
            </div>
          )
            : optionSelected === 'marked' ? (
              <div className="show-section">
            &nbsp;&nbsp;Marked
              </div>
            )
              : optionSelected === 'shared' ? (
                <div className="show-section">
            &nbsp;&nbsp;Shared
                </div>
              )
                : null
        }
        </div>
        <div className="list-grid-view">
          {
          selectedView === 'listView' ? (
            <span>
              <MenuOutlined onClick={() => { setSelectedView('listView'); }} className="list-view" style={{ fontSize: '20px', color: '#21353E' }} />
&nbsp;&nbsp;
              <AppstoreOutlined onClick={() => { setSelectedView('gridView'); }} className="grid-view" style={{ fontSize: '20px', color: '#fff' }} />
            </span>
          )
            : (
              <span>
                <MenuOutlined onClick={() => { setSelectedView('listView'); }} className="list-view" style={{ fontSize: '20px', color: '#fff' }} />
&nbsp;&nbsp;
                <AppstoreOutlined onClick={() => { setSelectedView('gridView'); }} className="grid-view" style={{ fontSize: '20px', color: '#21353E' }} />
              </span>
            )
        }
        </div>
      </div>
      {
      optionSelected === 'marked' ? (
        <div>
          {
          selectedView === 'listView'
            ? <ListViewMarked />
            : <GridViewMarked />
        }
        </div>
      )
        : optionSelected === 'shared' ? (
          <div>
            {
          selectedView === 'listView'
            ? <ListViewShared />
            : <GridViewShared />
        }
          </div>
        )
          : optionSelected === 'home' ? (
            <div>
              {
          selectedView === 'listView'
            ? <ListView />
            : <GridView />
        }
            </div>
          )
            : null
    }
      {
      uploadInProgress.file_count > 0
        ? (
          <div className="upload-container">
            <div className="upload-top-bar">
              <span id="top-bar-text">
                Uploading&nbsp;&nbsp;
                {uploadInProgress.completed}
                /
                {uploadInProgress.file_count}
&nbsp;...
              </span>
              {
            minimizeUpload
              ? <span id="top-bar-minimize" role="button" tabIndex={0} onClick={() => setMinimizeUpload(!minimizeUpload)}><CaretUpOutlined style={{ color: '#fff', fontSize: '18px' }} /></span>
              : <span id="top-bar-minimize" role="button" tabIndex={0} onClick={() => setMinimizeUpload(!minimizeUpload)}><CaretDownOutlined style={{ color: '#fff', fontSize: '18px' }} /></span>
          }

            </div>
            {
          minimizeUpload
            ? null
            : (
              <div className="upload-bottom-bar">
                <span id="bottom-bar-text">
                  <div id="cp-left-section" className="truncate-overflow">
                    {uploadInProgress.file_uploading}
                  </div>
                  <div id="cp-right-section">
                    {
                  uploadSize / (1024 * 1024) < 2
                    ? null
                    : <Progress steps={4} percent={uploadProgress} />
                }
                  </div>
                </span>
              </div>
            )
        }
          </div>
        )
        : null
    }
    </div>
  );
};

export default CenterPortion;
