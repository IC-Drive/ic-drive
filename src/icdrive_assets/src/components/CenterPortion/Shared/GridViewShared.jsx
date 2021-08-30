import React from 'react';

// custom imports
import '../../../../assets/css/GridView.css';

// 3rd party imports
import {
  message, Menu, Dropdown, Tooltip, Popconfirm
} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  downloadSharedFile, viewSharedFile, deleteSharedFile, bytesToSize
} from '../Methods';
import { refreshFiles } from '../../../state/actions';

const GridViewShared = () => {
  const shared = useSelector((state) => state.FileHandler.shared);
  const dispatch = useDispatch();
  const [deletingFlag, setDeletingFlag] = React.useState(false);
  const fileObj = React.useRef({});

  const handleDownload = async () => {
    await downloadSharedFile(fileObj.current, localStorage.getItem('userName'));
  };

  const handleDelete = async () => {
    if(!deletingFlag){
      setDeletingFlag(true);
      await deleteSharedFile(fileObj.current);
      dispatch(refreshFiles(true));
      setDeletingFlag(false);
    } else{
      message.info('Please wait for previous file to delete!!!');
    }
  };

  const handleView = async () => {
    const response = await viewSharedFile(fileObj.current, localStorage.getItem('userName'));
    if (!response) {
      message.info('Only PDF and Images can be viewed');
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="0" onClick={() => {  }}>
        <span id="context-download" role="button" tabIndex={0}>{'    '}</span>
      </Menu.Item>
      <Menu.Item key="1" onClick={() => { handleDownload(); }}>
        <span id="context-download" role="button" tabIndex={0}>Download</span>
      </Menu.Item>
      <Menu.Item key="2" onClick={() => { handleView(); }}>
        <span id="context-view" role="button" tabIndex={0}>View</span>
      </Menu.Item>
      <Popconfirm className="popconfirm" title="Sure to delete?" onConfirm={() => { handleDelete(); }}>
        <Menu.Item key="3">
          <span id="context-delete" role="button" tabIndex={0}>Delete</span>
        </Menu.Item>
      </Popconfirm>        
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
          shared.map((value) => (
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

export default GridViewShared;

