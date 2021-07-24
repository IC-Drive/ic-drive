import React from 'react';
import styled from 'styled-components';

// custom imports

// 3rd party imports
import {
  Modal, message, Button, Input,
} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import {
  downloadFile, viewFile, markFile, deleteFile, shareFile,
} from '../Methods';
import { filesUpdate, refreshFiles } from '../../../state/actions';

const GridView = () => {
  const files = useSelector((state) => state.FileHandler.files);
  const [data, setData] = React.useState([]);
  const dispatch = useDispatch();

  const fileObj = React.useRef({});
  const [shareModal, setShareModal] = React.useState(false);
  const [loadingFlag, setLoadingFlag] = React.useState(false);
  const userName = React.useRef('');

  // Functions
  React.useEffect(() => {
    const temp = [];
    for (let i = 0; i < files.length; i+=1) {
      if (files[i].marked) {
        temp.push(files[i]);
      }
    }
    setData(temp);
  }, []);

  const handleDownload = async () => {
    await downloadFile(fileObj.current);
  };

  const handleMarked = async () => {
    const temp = [...files];
    for (let i = 0; i < temp.length; i+=1) {
      if (temp[i].fileId === fileObj.current.fileId) {
        temp[i].marked = !temp[i].marked;
      }
    }
    dispatch(filesUpdate(temp));
    await markFile(fileObj.current, files, dispatch, filesUpdate);
  };

  const handleDelete = async () => {
    await deleteFile(fileObj.current);
    dispatch(refreshFiles(true));
  };

  const handleView = async () => {
    const response = await viewFile(fileObj.current);
    if (!response) {
      message.info('Only PDF and Images can be viewed');
    }
  };

  const handleShare = async () => {
    setLoadingFlag(true);
    const response = await shareFile(fileObj.current, userName.current.state.value);
    if (response) {
      message.success('File Shared');
    } else {
      message.error('Something Went Wrong! Check User Name');
    }
    setLoadingFlag(false);
  };

  const handleClick = async (e, target) => {
    const option = target.selected;
    if (option === 'download') {
      await handleDownload();
    }
    if (option === 'view') {
      await handleView();
    }
    if (option === 'share') {
      await setShareModal(true);
    }
    if (option === 'mark') {
      await handleMarked();
    }
    if (option === 'delete') {
      await handleDelete();
    }
  };

  return (
    <Style>
      <div className="grid-container">
        {
          data.map((value, _) => (
            <ContextMenuTrigger id="same_unique_identifier">
              <div className="file-div" onContextMenu={() => { fileObj.current = value; }}>
                <div className="icon-part">
                  <img src="./icons/file-icon.svg" alt="file-icon" style={{ width: '60px' }} />
                </div>
                <div className="text-part truncate-overflow">
                  {value.name}
                </div>
              </div>
            </ContextMenuTrigger>
          ))
        }
      </div>

      <ContextMenu id="same_unique_identifier">
        <MenuItem data={{ selected: 'download' }} onClick={handleClick}>
          <div id="context-download">
            Download
          </div>
        </MenuItem>
        <MenuItem data={{ selected: 'edit' }} onClick={handleClick}>
          <div id="context-edit">
            Edit
          </div>
        </MenuItem>
        <MenuItem data={{ selected: 'view' }} onClick={handleClick}>
          <div id="context-view">
            View
          </div>
        </MenuItem>
        <MenuItem data={{ selected: 'share' }} onClick={handleClick}>
          <div id="context-share">
            Share
          </div>
        </MenuItem>
        <MenuItem divider />
        <MenuItem data={{ selected: 'mark' }} onClick={handleClick}>
          <div id="context-mark">
            Mark
          </div>
        </MenuItem>
        <MenuItem data={{ selected: 'delete' }} onClick={handleClick}>
          <div id="context-delete">
            Delete
          </div>
        </MenuItem>
      </ContextMenu>

      <Modal
        footer={null}
        title={false}
        visible={shareModal}
        onCancel={() => { setShareModal(false); fileObj.current = {}; }}
      >
        <div>
          <span>
            User Name:&nbsp;
            <Input ref={userName} />
          </span>
          <Button type="primary" style={{ float: 'right', marginTop: '10px' }} loading={loadingFlag} onClick={handleShare}>Share</Button>
          <br />
          <br />
          <br />
        </div>
      </Modal>

    </Style>
  );
};

export default GridView;

const Style = styled.div`

  .grid-container{
    display: flex;
    flex-flow: row wrap;
  }
  .file-div{
    margin-top: 30px;
    margin-left: 30px;
    width: 60px;
    height: 60px;
    justify-content: center;  
    align-items: center;
  }
  .text-part{
    font-size: 12px;
    word-wrap: break-word;
  }
  #context-download, #context-edit, #context-view, #context-share, #context-mark, #context-delete{
    background: #324851;
    font-size: 14px;
    height: 28px;
    width: 150px;
    color: #fff;
    padding-left: 20px;
    display: flex;
    align-items: center;
  }
  #context-download: hover, #context-edit: hover, #context-view: hover, #context-share: hover, #context-mark: hover, #context-delete: hover{
    background: #425757;
  }
  .truncate-overflow{
    -webkit-line-clamp: 3 !important;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    display: -webkit-box;
  }
`;
