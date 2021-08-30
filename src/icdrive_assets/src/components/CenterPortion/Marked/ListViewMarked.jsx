import React from 'react';

// custom imports
import '../../../../assets/css/ListViewMarked.css';

// 3rd party imports
import { useSelector, useDispatch } from 'react-redux';
import {
  Table, Popconfirm, Space, Modal, message, Button, Input, Tag
} from 'antd';
import {
  DownloadOutlined, DeleteOutlined, ShareAltOutlined,
} from '@ant-design/icons';
import {
  downloadFile, viewFile, markFile, deleteFile, shareFile, shareFilePublic, removeFilePublic, bytesToSize,
} from '../Methods';
import { filesUpdate } from '../../../state/actions';

const ListViewMarked = () => {
  const files = useSelector((state) => state.FileHandler.files);
  const [data, setData] = React.useState('');
  const dispatch = useDispatch();

  const fileObj = React.useRef({});
  const [shareModal, setShareModal] = React.useState(false);
  const [refreshData, setRefreshData] = React.useState(true);
  const [ShareLoadingFlag, setShareLoadingFlag] = React.useState(false);
  const [removeFlag, setRemoveLoadingFlag] = React.useState(false);
  const [PublicLoadingFlag, setPublicLoadingFlag] = React.useState(false);
  const userName = React.useRef('');

  // Functions
  React.useEffect(async () => {
    setRefreshData(false)
    const temp = [];
    for (let i = 0; i < files.length; i += 1) {
      if (files[i].marked) {
        temp.push(files[i]);
      }
    }
    setData(temp);
  }, [refreshData]);

  const handleDownload = async (record) => {
    await downloadFile(record);
  };

  const handleMarked = async (record) => {
    const temp = [...files];
    for (let i = 0; i < temp.length; i += 1) {
      if (temp[i].fileId === record.fileId) {
        temp[i].marked = false;
        break
      }
    }
    dispatch(filesUpdate(temp));
    markFile(record);
    setRefreshData(true);
  };

  const handleDelete = async (record) => {
    const temp = [...files];
    const newFiles = []
    for (let i = 0; i < temp.length; i += 1) {
      if (temp[i].fileId === record.fileId) {
        continue;
      } else{
        newFiles.push(temp[i]);
      }
    }
    dispatch(filesUpdate(newFiles));
    deleteFile(record);
    setRefreshData(true);
  };

  const handleView = async (record) => {
    const response = await viewFile(record);
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
      render: (_, record) => <div>{record.marked ? <img src="./icons/mark-blue.svg" alt="mark icon" style={{ height: '14px' }} onClick={() => handleMarked(record)} /> : <img src="./icons/mark-gray.svg" alt="mark icon" style={{ height: '14px' }} onClick={() => handleMarked(record)} />}</div>,
    },
    {
      title: '',
      key: 'operation',
      render: (_, record) => (
        <Space size="middle">
          <span>
            <DownloadOutlined style={{ color: '#4D85BD' }} onClick={() => handleDownload(record)} />
          </span>
          <Popconfirm className="popconfirm" title="Sure to delete?" onConfirm={() => { handleDelete(record); }}>
            <span>
              <DeleteOutlined style={{ color: '#4D85BD' }} />
            </span>
          </Popconfirm>
          <span>
            <ShareAltOutlined style={{ color: '#4D85BD' }} onClick={() => { setShareModal(true); fileObj.current = record; }} />
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
        }}/>
      </div>

      {/* Modal For Input User Name */}
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
  );
};

export default ListViewMarked;

