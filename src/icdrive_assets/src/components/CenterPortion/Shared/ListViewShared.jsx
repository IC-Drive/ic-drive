import React from 'react';

// custom imports
import '../../../../assets/css/ListViewShared.css'

// 3rd party imports
import { useSelector, useDispatch } from 'react-redux';
import {
  Table, Popconfirm, Space, message,
} from 'antd';
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  downloadSharedFile, viewSharedFile, deleteSharedFile, bytesToSize,
} from '../Methods';
import { refreshFiles } from '../../../state/actions';

const ListViewShared = () => {
  const shared = useSelector((state) => state.FileHandler.shared);
  const [deletingFlag, setDeletingFlag] = React.useState(false);
  const dispatch = useDispatch();

  // Functions
  const handleDownload = async (record) => {
    await downloadSharedFile(record, localStorage.getItem('userName'));
  };

  const handleDelete = async (record) => {
    if(!deletingFlag){
      setDeletingFlag(true);
      await deleteSharedFile(record);
      dispatch(refreshFiles(true));
      setDeletingFlag(false);
    } else{
      message.info('Please wait for previous file to delete!!!');
    }
  };

  const handleView = async (record) => {
    const response = await viewSharedFile(record, localStorage.getItem('userName'));
    if (!response) {
      message.info('Only PDF and Images can be viewed');
    }
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
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div>
        <Table dataSource={shared} columns={columns} />
      </div>
    </div>
  );
};

export default ListViewShared;

