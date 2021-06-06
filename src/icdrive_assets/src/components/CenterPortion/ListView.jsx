import React from "react";
import styled from 'styled-components';

// custom imports

// 3rd party imports
//import * as streamSaver from 'streamsaver';
//import { WritableStream } from 'web-streams-polyfill/ponyfill'
import {useSelector} from 'react-redux';
import {DownloadOutlined, DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {Table, Popconfirm} from 'antd';

const ListView = () =>{

  const files = useSelector(state=>state.FileHandler.files)

  const columns = [
    {
      title: 'File Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'File Size',
      dataIndex: 'chunkCount',
      key: 'chunkCount',
    },
    {
      title: 'Last Updated',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      key: 'operation',
      render: (_, record) => {
        return (
        <span>
          <a>
            <DownloadOutlined />&nbsp;&nbsp;
          </a>
          <a>
            <EditOutlined />&nbsp;&nbsp;
          </a>
          <Popconfirm title="Sure to delete?" onConfirm={() => {}}>
          <a>
            <DeleteOutlined />
          </a>
          </Popconfirm>
        </span>
        );
      },
    },
  ];

  return(
    <Style>
      <div>
        <Table dataSource={files} columns={columns} />
      </div>
    </Style>
  )
}

export default ListView;

const Style = styled.div`

`