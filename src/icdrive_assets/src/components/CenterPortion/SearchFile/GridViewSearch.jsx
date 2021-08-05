import React from 'react';

// custom imports
import { imageTypes, pdfType } from '../MimeTypes';
import '../../../../assets/css/GridView.css';

// 3rd party imports
import {
  Modal, message, Button, Input, Menu, Dropdown, Tag, Tooltip
} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  downloadFile, viewFile, markFile, deleteFile, shareFile, shareFilePublic, removeFilePublic, bytesToSize
} from '../Methods';
import { filesUpdate, refreshFiles } from '../../../state/actions';

const GridViewSearch = () => {
  const files = useSelector((state) => state.FileHandler.files);
  const searched = useSelector((state) => state.FileHandler.searched);

  const [data, setData] = React.useState([]);
  const dispatch = useDispatch();

  const fileObj = React.useRef({});
  const [shareModal, setShareModal] = React.useState(false);
  const [ShareLoadingFlag, setShareLoadingFlag] = React.useState(false);
  const [removeFlag, setRemoveLoadingFlag] = React.useState(false);
  const [PublicLoadingFlag, setPublicLoadingFlag] = React.useState(false);
  const userName = React.useRef('');

  // Functions
  React.useEffect(() => {
    const temp = [];
    for (let i = 0; i < files.length; i += 1) {
      if (files[i].name===searched) {
        temp.push(files[i]);
        break
      }
    }
    setData(temp);
  }, []);

  const handleDownload = async () => {
    await downloadFile(fileObj.current);
  };

  const handleMarked = async () => {
    const temp = [...files];
    for (let i = 0; i < temp.length; i += 1) {
      if (temp[i].fileId === fileObj.current.fileId) {
        temp[i].marked = false;
        break
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
    setShareLoadingFlag(true);
    const response = await shareFile(fileObj.current, userName.current.state.value);
    if (response) {
      message.success('File Shared');
    } else {
      message.error('Something Went Wrong! Check User Name');
    }
    setShareLoadingFlag(false);
  };

  const handleSharePublic = async () => {
    setPublicLoadingFlag(true);
    const response = await shareFilePublic(fileObj.current);
    if (response) {
      fileObj.current.fileHash = response;
    } else {
      message.info('Only Images and PDF can be made public!!!');
    }
    setPublicLoadingFlag(false);
  };

  const removeSharePublic = async () => {
    setRemoveLoadingFlag(true);
    const response = await removeFilePublic(fileObj.current);
    if (response) {
      fileObj.current.fileHash = '';
    } else {
      message.info('Something Went Wrong, Try again!!!');
    }
    setRemoveLoadingFlag(false);
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => { handleDownload(); }}>
        <span id="context-download" role="button" tabIndex={0}>Download</span>
      </Menu.Item>
      <Menu.Item key="2" onClick={() => { handleView(); }}>
        <span id="context-view" role="button" tabIndex={0}>View</span>
      </Menu.Item>
      <Menu.Item key="3" onClick={() => { setShareModal(true); }}>
        <span id="context-share" role="button" tabIndex={0}>Share</span>
      </Menu.Item>
      <Menu.Item key="4" onClick={() => { handleMarked(); }}>
        <span id="context-mark" role="button" tabIndex={0}>Mark</span>
      </Menu.Item>
      <Menu.Item key="5" onClick={() => { handleDelete(); }}>
        <span id="context-delete" role="button" tabIndex={0}>Delete</span>
      </Menu.Item>
    </Menu>
  );

  const isImage = (mimeType) =>{
    let flag = false
    for(let i=0; i<imageTypes.length;i++){
      if(mimeType===imageTypes[i]){
        flag=true
        break
      }
    }
    return(flag)
  }
  const isPdf = (mimeType) =>{
    let flag = false
    if(mimeType===pdfType){
      flag = true
    }
    return(flag)
  }
  const getToolTipText = (value) =>{
    return(value.name+' - '+ bytesToSize(Number(value.fileSize)) + ' - ' + value.createdAt)
  }

  return (
    <div className="grid-container">
      {
        data.map((value) => (
            <Dropdown key={value.fileId} overlayStyle={{ width: '150px', background: '#324851 !important', color: '#fff !important' }} overlay={menu} trigger={['contextMenu']}>
              <Tooltip placement="bottom" title={()=>getToolTipText(value)}>
              <div className="file-div" onDoubleClick={()=>{fileObj.current = value; handleView() }} onContextMenu={() => { fileObj.current = value; }}>
                <div className="grid-view-icon-part">
                  {
                    isImage(value.mimeType)?
                    <img src="./icons/image-icon.svg" alt="file icon" style={{ width: '60px' }} />
                    :
                    isPdf(value.mimeType)?
                    <img src="./icons/pdf-icon.svg" alt="file icon" style={{ width: '60px' }} />
                    :
                    <img src="./icons/file-icon.svg" alt="file icon" style={{ width: '60px' }} />
                  }
                </div>
                <div className="grid-view-text-part truncate-overflow">
                  {value.name}
                </div>
              </div>
              </Tooltip>
            </Dropdown>
          ))
      }
      <Modal
        footer={null}
        title={false}
        visible={shareModal}
        onCancel={() => { setShareModal(false); fileObj.current = {}; setRemoveLoadingFlag(false); }}
      >
        <div>
          {
          fileObj.current.fileHash === ''
            ? (
              <div>
                <span>
                  User Name:&nbsp;
                  <Input ref={userName} />
                </span>
                <br />
                {
                  fileObj.current.sharedWith.map((value)=>{
                    return(
                      <Tag color="geekblue">{value}</Tag>
                    )
                  })
                }
                {
                  PublicLoadingFlag?
                  <div>
                  <Button type="primary" style={{ float: 'right', marginTop: '10px' }} loading={ShareLoadingFlag} disabled onClick={()=>handleShare()}>Share</Button>
                  <Button type="primary" style={{ float: 'right', marginTop: '10px', marginRight: '10px' }} loading={PublicLoadingFlag} onClick={handleSharePublic}>Public</Button>
                  </div>
                  :
                  <div>
                  <Button type="primary" style={{ float: 'right', marginTop: '10px' }} loading={ShareLoadingFlag} onClick={()=>handleShare()}>Share</Button>
                  <Button type="primary" style={{ float: 'right', marginTop: '10px', marginRight: '10px' }} loading={PublicLoadingFlag} onClick={handleSharePublic}>Public</Button>
                  </div>
                }
                <br />
                <br />
              </div>
            )
            : (
              <div>
                <span id="public-url" style={{color:'#4D85BD'}} onClick={() => { navigator.clipboard.writeText(`${window.location.href}icdrive/${fileObj.current.fileHash}`); message.info('copied to clipboard'); }}>
                  {window.location.href}
                  icdrive/
                  {fileObj.current.fileHash}
                </span>
                <br />
                <Button type="primary" style={{ float: 'right', marginRight: '10px' }} loading={removeFlag} onClick={()=>removeSharePublic()}>Remove</Button>
                <br />
                <br />
              </div>
            )
        }
          <br />
        </div>
      </Modal>
    </div>
  );
};

export default GridViewSearch;
