import React from "react";
import styled from 'styled-components';

// custom imports

// 3rd party imports
import * as streamSaver from 'streamsaver';
import { WritableStream } from 'web-streams-polyfill/ponyfill'
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as icdrive_idl, canisterId as icdrive_id } from 'dfx-generated/icdrive';
import {useSelector} from 'react-redux';
import {DownloadOutlined, DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {Table, Popconfirm} from 'antd';

const ListView = () =>{

  const files = useSelector(state=>state.FileHandler.files)

  const agent = new HttpAgent();
  const icdrive = Actor.createActor(icdrive_idl, { agent, canisterId: icdrive_id });

  const download = async (fileId, chunk_count, fileName) => {
    streamSaver.WritableStream = WritableStream
    streamSaver.mitm = 'http://localhost:8000/mitm.html'
    const fileStream = streamSaver.createWriteStream(fileName);
    const writer = fileStream.getWriter();
    for(let j=0; j<chunk_count; j++){
      const bytes = await icdrive.getFileChunk(fileId, j+1);
      //const bytesAsBuffer = Buffer.from(new Uint8Array(bytes[0]));
      const bytesAsBuffer = new Uint8Array(bytes[0]);
      writer.write(bytesAsBuffer);
    }
    writer.close();
  };

  const handleDownload = async (fileId, chunk_count, fileName) =>{
    let k = await download(fileId, chunk_count, fileName)
  }

  const downloadFile = async () =>{
    console.log("here")
    const k = await handleDownload(files[0]["fileId"], files[0]["chunkCount"], files[0]["name"])
    console.log("here over")
  }

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
            <DownloadOutlined onClick={downloadFile} />&nbsp;&nbsp;
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