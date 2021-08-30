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
  downloadFile, downloadSharedFile, viewFile, viewSharedFile, markFile, deleteFile, deleteSharedFile, shareFile, shareFilePublic, removeFilePublic, bytesToSize,
} from '../Methods';
import { filesUpdate, refreshFiles } from '../../../state/actions';

const ListViewSearch = () => {
  const files = useSelector((state) => state.FileHandler.files);
  const sharedFiles = useSelector((state) => state.FileHandler.shared);
  const searched = useSelector((state) => state.FileHandler.searched);

  const [data, setData] = React.useState('');
  const dispatch = useDispatch();

  const fileObj = React.useRef({});
  const [shareModal, setShareModal] = React.useState(false);
  const [ShareLoadingFlag, setShareLoadingFlag] = React.useState(false);
  const [removeFlag, setRemoveLoadingFlag] = React.useState(false);
  const [PublicLoadingFlag, setPublicLoadingFlag] = React.useState(false);
  const userName = React.useRef('');

  // Functions
  React.useEffect(async () => {
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

  // Defining Columns of Table
  const columns = [
    {
      title: 'File Name',
      dataIndex: 'name',
      key: 'name',
      editable: true,
      render: (text, record) => <div onDoubleClick={() => { fileObj.current = record;handleView(); }}>{text}</div>,
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
      title: '',
      key: 'operation',
      render: (_, record) => (
        <Space size="middle">
          <span>
            <DownloadOutlined style={{ color: '#4D85BD' }} onClick={() => {fileObj.current = record; handleDownload()}} />
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
    </div>
  );
};

export default ListViewSearch;

