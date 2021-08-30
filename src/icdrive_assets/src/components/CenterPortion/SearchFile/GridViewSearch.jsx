import React from 'react';

// custom imports
import '../../../../assets/css/GridView.css';

// 3rd party imports
import {
  Modal, message, Button, Input, Menu, Dropdown, Tag, Tooltip, Popconfirm
} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  downloadFile, viewFile, markFile, deleteFile, shareFile, shareFilePublic, removeFilePublic, bytesToSize,
  downloadSharedFile, deleteSharedFile, viewSharedFile
} from '../Methods';
import { filesUpdate, refreshFiles } from '../../../state/actions';

const GridViewSearch = () => {
  const files = useSelector((state) => state.FileHandler.files);
  const sharedFiles = useSelector((state) => state.FileHandler.shared);
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
    for (let i = 0; i < sharedFiles.length; i += 1) {
      if (sharedFiles[i].name===searched) {
        temp.push(sharedFiles[i]);
        break
      }
    }
    setData(temp);
  }, []);

  const handleDownload = async () => {
    if(fileObj.current.userName===localStorage.getItem('userName')){
      await downloadFile(fileObj.current);
    } else{
      await downloadSharedFile(fileObj.current, localStorage.getItem('userName'));
    }
  };

  const handleDelete = async () => {
    if(fileObj.current.userName===localStorage.getItem('userName')){
      await deleteFile(fileObj.current);
      dispatch(refreshFiles(true));
    } else{
      await deleteSharedFile(fileObj.current);
      dispatch(refreshFiles(true));
    }
  };

  const handleView = async () => {
    if(fileObj.current.userName===localStorage.getItem('userName')){
      const response = await viewFile(fileObj.current);
      if (!response) {
        message.info('Only PDF and Images can be viewed');
      }
    } else{
      const response = await viewSharedFile(fileObj.current, localStorage.getItem('userName'));
      if (!response) {
        message.info('Only PDF and Images can be viewed');
      }
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="0" onClick={() => {  }}>
        <span id="context-download" role="button" tabIndex={0}>{'    '}</span>
      </Menu.Item>
      <Menu.Item key="1" onClick={() => {  }}>
        <span id="context-download" role="button" tabIndex={0}></span>
      </Menu.Item>
      <Menu.Item key="2" onClick={() => { handleDownload(); }}>
        <span id="context-download" role="button" tabIndex={0}>Download</span>
      </Menu.Item>
      <Menu.Item key="3" onClick={() => { handleView(); }}>
        <span id="context-view" role="button" tabIndex={0}>View</span>
      </Menu.Item>
    </Menu>
  );

  const isImage = (mimeType) =>{
    let flag = false
    if(mimeType.indexOf("image")!=-1){
      flag=true
    }
    return(flag)
  }
  const isPdf = (mimeType) =>{
    let flag = false
    if(mimeType.indexOf("pdf")!=-1){
      flag=true
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
            <Dropdown overlayStyle={{ width: '150px', background: '#324851 !important', color: '#fff !important' }} overlay={menu} trigger={['contextMenu']}>
              <Tooltip placement="right" title={()=>getToolTipText(value)}>
              <div className="file-div" onDoubleClick={()=>{fileObj.current = value; handleView() }} onContextMenu={() => { fileObj.current = value; }}>
                <div className="grid-view-icon-part">
                  {
                    isImage(value.mimeType)?
                    <div>
                      {
                        value.thumbnail===''?
                        <img id="display-icon" src="./icons/image-icon.svg" alt="file icon" />
                        :
                        <img id="display-icon" src={value.thumbnail} alt="file icon" />
                      }
                    </div>
                    :
                    isPdf(value.mimeType)?
                    <img id="display-icon" src="./icons/pdf-icon.svg" alt="file icon" />
                    :
                    <img id="display-icon" src="./icons/file-icon.svg" alt="file icon" />
                  }
                </div>
                <div className="grid-view-text-part truncate-overflow">
                  <p align="center">{value.name}</p>
                </div>
              </div>
              </Tooltip>
            </Dropdown>
          ))
      }
    </div>
  );
};

export default GridViewSearch;
