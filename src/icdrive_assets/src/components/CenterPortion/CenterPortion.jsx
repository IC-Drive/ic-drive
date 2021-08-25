import React from 'react';
import '../../../assets/css/CenterPortion.css';

// custom imports
import ListView from './Home/ListView';
import GridView from './Home/GridView';
import { folderUpdate } from '../../state/actions';
import ListViewMarked from './Marked/ListViewMarked';
import ListViewShared from './Shared/ListViewShared';
import GridViewMarked from './Marked/GridViewMarked';
import GridViewShared from './Shared/GridViewShared';
import ListViewFolder from './Folder/ListViewFolder';
import GridViewFolder from './Folder/GridViewFolder';
import ListViewSearch from './SearchFile/ListViewSearch';
import GridViewSearch from './SearchFile/GridViewSearch';

// 3rd party imports
import { Progress, Menu, Dropdown, Input, Button, Modal } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  MenuOutlined, AppstoreOutlined, CaretDownOutlined, CaretUpOutlined,
} from '@ant-design/icons';

const CenterPortion = () => {
  const [selectedView, setSelectedView] = React.useState('gridView');
  const [minimizeUpload, setMinimizeUpload] = React.useState(false);
  const [createFolderModal, setCreateFolderModal] = React.useState(false);
  const uploadInProgress = useSelector((state) => state.FileHandler.upload);
  const optionSelected = useSelector((state) => state.OptionSelected.option);
  const uploadProgress = useSelector((state) => state.UploadProgress.progress);
  const uploadSize = useSelector((state) => state.UploadProgress.size);
  const folders = useSelector((state) => state.FolderHandle.folders);
  const folderName = React.useRef('');
  const dispatch = useDispatch();

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => { setCreateFolderModal(true) }}>
        <span id="context-download" role="button" tabIndex={0}>New Folder</span>
      </Menu.Item>
    </Menu>
  );

  const createNewFolder = () =>{
    const temp = [...folders];
    temp.push(folderName.current.state.value);
    dispatch(folderUpdate(temp));
    folderName.current.state.value = '';
    setCreateFolderModal(false);
  }

  return (
    <div className="central-portion-container">
      <div className="central-portion-top-bar">
        <div>
          {
          optionSelected === 'home' ? (
            <div className="show-section">
            &nbsp;&nbsp;<b>Home</b>
            </div>
          )
            : optionSelected === 'marked' ? (
              <div className="show-section">
            &nbsp;&nbsp;<b>Marked</b>
              </div>
            )
              : optionSelected === 'shared' ? (
                <div className="show-section">
            &nbsp;&nbsp;<b>Files shared with me</b>
                </div>
              )
                : optionSelected === 'search' ? (
                  <div className="show-section">
              &nbsp;&nbsp;<b>Search</b>
                  </div>
                )
                : <div className="show-section">
                &nbsp;&nbsp;{optionSelected}
                  </div>
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

      <Dropdown overlayStyle={{ width: '150px', background: '#324851 !important', color: '#fff !important' }} overlay={menu} trigger={['contextMenu']}>
      <div className='content-area'>
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
          : optionSelected === 'search' ? (
            <div>
              {
          selectedView === 'listView'
            ? <ListViewSearch />
            : <GridViewSearch />
        }
            </div>
          )
            : <div>
                {
            selectedView === 'listView'
              ? <ListViewFolder />
              : <GridViewFolder />
          }
              </div>
      }
      </div>
      </Dropdown>

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
      <Modal
        footer={null}
        title={false}
        visible={createFolderModal}
        onCancel={() => { setCreateFolderModal(false); }}
      >
        <span>
          Folder Name:&nbsp;
          <Input ref={folderName} />
        </span>
        <br/><br/>
        <Button type="primary" style={{ float: 'right', marginTop: '10px' }} onClick={()=>{createNewFolder()}}>Create</Button>
        <br/><br/>
      </Modal>
    </div>
  );
};

export default CenterPortion;
