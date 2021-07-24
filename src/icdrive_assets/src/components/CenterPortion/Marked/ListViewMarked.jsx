import React from 'react';
import styled from 'styled-components';

// custom imports

// 3rd party imports
import { useSelector, useDispatch } from 'react-redux';
import {
  Table, Popconfirm, Space, Modal, message, Button, Input,
} from 'antd';
import {
  DownloadOutlined, DeleteOutlined, ShareAltOutlined,
} from '@ant-design/icons';
import {
  downloadFile, viewFile, markFile, deleteFile, shareFile, bytesToSize,
} from '../Methods';
import { filesUpdate, refreshFiles } from '../../../state/actions';

const ListView = () => {
  const files = useSelector((state) => state.FileHandler.files);
  const [data, setData] = React.useState('');
  const dispatch = useDispatch();

  const fileObj = React.useRef({});
  const [shareModal, setShareModal] = React.useState(false);
  const [loadingFlag, setLoadingFlag] = React.useState(false);
  const userName = React.useRef('');

  // Functions
  React.useEffect(async () => {
    const temp = [];
    for (let i = 0; i < files.length; i += 1) {
      if (files[i].marked) {
        temp.push(files[i]);
      }
    }
    setData(temp);
  }, []);

  const handleDownload = async (record) => {
    await downloadFile(record);
  };

  const handleMarked = async (record) => {
    const temp = [...files];
    for (let i = 0; i < temp.length; i += 1) {
      if (temp[i].fileId === record.fileId) {
        temp[i].marked = !temp[i].marked;
      }
    }
    dispatch(filesUpdate(temp));
    await markFile(record);
  };

  const handleDelete = async (record) => {
    await deleteFile(record);
    dispatch(refreshFiles(true));
  };

  const handleView = async (record) => {
    const response = await viewFile(record);
    if (!response) {
      message.info('Only PDF and Images can be viewed');
    }
  };

  const handleShare = async () => {
    setLoadingFlag(true);
    const response = shareFile(fileObj.current, userName.current.state.value);
    if (response) {
      message.success('File Shared');
    } else {
      message.error('Something Went Wrong! Check User Name');
    }
    setLoadingFlag(false);
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
          <Popconfirm title="Sure to delete?" onConfirm={() => { handleDelete(record); }}>
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
    <Style>
      <div>
        <Table dataSource={data} columns={columns} />
      </div>

      {/* Modal For Input User Name */}
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

export default ListView;

const Style = styled.div`
  thead[class*="ant-table-thead"] th{
    font-weight: bold !important;
  }
`;
