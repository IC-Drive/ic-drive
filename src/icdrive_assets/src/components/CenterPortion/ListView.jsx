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
import {Table, Popconfirm, Space} from 'antd';

const ListView = () =>{

  const files = useSelector(state=>state.FileHandler.files)

  const agent = new HttpAgent();
  const icdrive = Actor.createActor(icdrive_idl, { agent, canisterId: icdrive_id });

  // For large files not working on firefox to be fixed
  /*const download = async (fileId, chunk_count, fileName) => {
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
  };*/

  //Temporary method works well on small files
  //Works for images, file type storage in backend in next commit
  const download = async (fileId, chunk_count, fileName) => {
    const chunkBuffers = [];
    for(let j=0; j<chunk_count; j++){
      const bytes = await icdrive.getFileChunk(fileId, j+1);
      const bytesAsBuffer = Buffer.from(new Uint8Array(bytes));
      chunkBuffers.push(bytesAsBuffer);
    }
    const fileBlob = new Blob([Buffer.concat(chunkBuffers)], {
      type: "image/jpeg",
    });
    const fileURL = URL.createObjectURL(fileBlob);
    var link = document.createElement('a');
    link.href = fileURL;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
  };

  const handleDownload = async (record) =>{
    console.log(record)
    let k = await download(record["fileId"], record["chunkCount"], record["name"])
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
      title: '',
      key: 'operation',
      render: (_, record) => {
        return (
        <Space size="middle">
          <a>
            <DownloadOutlined onClick={()=>handleDownload(record)} />
          </a>
          <a>
            <EditOutlined />
          </a>
          <Popconfirm title="Sure to delete?" onConfirm={() => {}}>
          <a>
            <DeleteOutlined />
          </a>
          </Popconfirm>
        </Space>
        );
      },
    },
  ];

  return(
    <Style>
      <div>
        <Table dataSource={files} columns={columns} footer={false} />
      </div>
    </Style>
  )
}

export default ListView;

const Style = styled.div`

`