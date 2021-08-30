import React from 'react';

// custom imports
import '../../../../assets/css/GridView.css';

// 3rd party imports
import {
  Modal, message, Button, Input, Tag, Popconfirm, Table, Space
} from 'antd';
import {
  DownloadOutlined, DeleteOutlined, ShareAltOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import {
  downloadFile, viewFile, markFile, deleteFile, shareFile, shareFilePublic, removeFilePublic, bytesToSize
} from '../Methods';
import { filesUpdate } from '../../../state/actions';

const ListViewFolder = () => {
  const optionSelected = useSelector((state) => state.OptionSelected.option);
  const files = useSelector((state) => state.FileHandler.files);
  const [previousFileObjectLength, setPreviousFileObjectLength] = React.useState(0);
  const [data, setData] = React.useState([]);
  const dispatch = useDispatch();

  const fileObj = React.useRef({});
  const [shareModal, setShareModal] = React.useState(false);
  const [refreshData, setRefreshData] = React.useState(true);
  const [ShareLoadingFlag, setShareLoadingFlag] = React.useState(false);
  const [removeFlag, setRemoveLoadingFlag] = React.useState(false);
  const [PublicLoadingFlag, setPublicLoadingFlag] = React.useState(false);
  const userName = React.useRef('');

  // Functions
  React.useEffect(() => {
    setPreviousFileObjectLength(files.length)
    const temp = [];
    for (let i = 0; i < files.length; i+=1) {
      if (files[i].folder===optionSelected) {
        temp.push(files[i]);
      }
    }
    setData(temp);
  }, [previousFileObjectLength!=files.length, refreshData]);

  const handleDownload = async () => {
    await downloadFile(fileObj.current);
  };

  const handleMarked = async () => {
    const temp = [...files];
    for (let i = 0; i < temp.length; i += 1) {
      if (temp[i].fileId === fileObj.current.fileId) {
        temp[i].marked = !temp[i].marked;
        break
      }
    }
    dispatch(filesUpdate(temp));
    markFile(fileObj.current);
    setRefreshData(true);
  };

  const handleDelete = async () => {
    const temp = [...files];
    const newFiles = []
    for (let i = 0; i < temp.length; i += 1) {
      if (temp[i].fileId === fileObj.current.fileId) {
        continue;
      } else{
        newFiles.push(temp[i]);
      }
    }
    dispatch(filesUpdate(newFiles));
    deleteFile(fileObj.current);
    setRefreshData(true);
  };

  const handleView = async () => {
    const response = await viewFile(fileObj.current);
    if (!response) {
      message.info('Only PDF and Images can be viewed');
    }
  };

  const handleShare = async () => {
    if(!userName.current.state.value){
      message.info("Enter User Name")
    }else{
      userName.current.state.value = userName.current.state.value.trim()
      if(userName.current.state.value===''){
        message.info('Username Cant be empty');
        setShareLoadingFlag(false);
      } else{
        setShareLoadingFlag(true);
        const response = await shareFile(fileObj.current, userName.current.state.value);
        if (response) {
          message.success('File Shared');
        } else {
          message.error('Something Went Wrong! Check User Name');
        }
        setShareLoadingFlag(false);
      }
    }
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

  // Defining Columns of Table
  const columns = [
    {
      title: 'File Name',
      dataIndex: 'name',
      key: 'name',
      editable: true,
      render: (text, record) => <div onDoubleClick={() => { handleView(record); }}>{text}</div>,
    },
    {
      title: 'File Size',
      dataIndex: 'fileSize',
      key: 'fileSize',
      render: (text) => <div>{(bytesToSize(Number(text)))}</div>,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Mark',
      dataIndex: 'marked',
      key: 'marked',
      render: (_, record) => <div>{record.marked ? <img src="./icons/mark-blue.svg" alt="mark icon" style={{ height: '14px' }} onClick={() => {fileObj.current = record;handleMarked()}} /> : <img src="./icons/mark-gray.svg" alt="mark icon" style={{ height: '14px' }} onClick={() => {fileObj.current = record;handleMarked(record)}} />}</div>,
    },
    {
      title: '',
      key: 'operation',
      render: (_, record) => (
        <Space size="middle">
          <span>
            <DownloadOutlined style={{ color: '#4D85BD' }} onClick={() => {fileObj.current = record;handleDownload()}} />
          </span>
          <Popconfirm className="popconfirm" title="Sure to delete?" onConfirm={() => { fileObj.current = record;handleDelete(); }}>
            <span>
              <DeleteOutlined style={{ color: '#4D85BD' }} />
            </span>
          </Popconfirm>
          <span>
            <ShareAltOutlined style={{ color: '#4D85BD' }} onClick={() => { fileObj.current = record;setShareModal(true); }} />
          </span>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div>
        <Table dataSource={data} columns={columns} pagination={{
          defaultPageSize: 50
        }} />
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
                  <span id="public-url" style={{color:'#4D85BD'}} onClick={() => { navigator.clipboard.writeText(`${window.location.href}icdrive/*${fileObj.current.fileHash}`); message.info('copied to clipboard'); }}>
                    {window.location.href}
                    icdrive/*
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
    </div>
  );
};

export default ListViewFolder;

