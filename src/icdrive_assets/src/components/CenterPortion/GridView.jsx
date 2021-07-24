import React from 'react';
import styled from 'styled-components';

// custom imports
// import { image_types, pdf_type } from './MimeTypes'

// 3rd party imports
import {
  Modal, message, Button, Input, Menu, Dropdown
} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  downloadFile, viewFile, markFile, deleteFile, shareFile,
} from './Methods';
import { filesUpdate, refreshFiles } from '../../state/actions';

const GridView = () => {
  const files = useSelector((state) => state.FileHandler.files);
  const dispatch = useDispatch();

  const fileObj = React.useRef({});
  const [shareModal, setShareModal] = React.useState(false);
  const [loadingFlag, setLoadingFlag] = React.useState(false);
  const userName = React.useRef('');

  const handleDownload = async () => {
    await downloadFile(fileObj.current);
  };

  const handleMarked = async () => {
    const temp = [...files];
    for (let i = 0; i < temp.length; i += 1) {
      if (temp[i].fileId === fileObj.current.fileId) {
        temp[i].marked = !temp[i].marked;
      }
    }
    dispatch(filesUpdate(temp));
    await markFile(fileObj.current);
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
    const response = await shareFile(fileObj.current, (userName.current.state.value));
    if (response) {
      message.success('File Shared');
    } else {
      message.error('Something Went Wrong! Check User Name');
    }
    setLoadingFlag(false);
  };

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <span id="context-download" role="button" tabIndex={0} onClick={() => { handleDownload(); }}>Download</span>
      </Menu.Item>
      <Menu.Item key="2">
        <span id="context-view" role="button" tabIndex={0} onClick={() => { handleView(); }}>View</span>
      </Menu.Item>
      <Menu.Item key="3">
        <span id="context-share" role="button" tabIndex={0} onClick={() => { setShareModal(true); }}>Share</span>
      </Menu.Item>
      <Menu.Item key="4">
        <span id="context-mark" role="button" tabIndex={0} onClick={() => { handleMarked(); }}>Mark</span>
      </Menu.Item>
      <Menu.Item key="5">
        <span id="context-delete" role="button" tabIndex={0} onClick={() => { handleDelete(); }}>Delete</span>
      </Menu.Item>
    </Menu>
  );

  /* const isImage = (mimeType) =>{
    let flag = false
    for(let i=0; i<image_types.length;i++){
      if(mimeType===image_types[i]){
        flag=true
        break
      }
    }
    return(flag)
  }
  const isPdf = (mimeType) =>{
    let flag = false
    if(fileInfo["mimeType"].toString()===pdf_type){
      flag = true
    }
    return(flag)
  } */

  return (
    <Style>
      <div className="grid-container">
        {
          files.map((value, _) => (
            <Dropdown overlayStyle={{width: '150px', background: '#324851 !important', color: '#fff !important'}} overlay={menu} trigger={['contextMenu']}>
              <div className="file-div" onContextMenu={() => { fileObj.current = value; }}>
                <div className="icon-part">
                  <img src="./icons/file-icon.svg" alt="file icon" style={{ width: '60px' }} />
                </div>
                <div className="text-part truncate-overflow">
                  {value.name}
                </div>
              </div>
            </Dropdown>
          ))
        }
      </div>

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
    justif
    overflow:hidden;y-content: center;  
    align-items: center;
  }
  .text-part{
    font-size: 12px;
    word-wrap: break-word;
  }
  .ant-dropdown-menu, .ant-dropdown-menu-item, .ant-dropdown-menu-submenu-title{
    color: #fff !important;
  }
  .ant-dropdown-menu, .ant-dropdown-menu-item: hover, .ant-dropdown-menu-submenu-title: hover{
    background: #425757 !important;
  }
  .ant-dropdown-menu{
    background: #324851 !important;
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

  .truncate-overflow{
    -webkit-line-clamp: 3 !important;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    display: -webkit-box;
  }
`;
