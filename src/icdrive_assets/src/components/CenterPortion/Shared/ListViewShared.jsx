import React from "react";
import styled from 'styled-components';

// custom imports

// 3rd party imports
import * as streamSaver from 'streamsaver';
import { WritableStream } from 'web-streams-polyfill/ponyfill'
import { Actor } from '@dfinity/agent';
import {httpAgent, canisterHttpAgent, httpAgentIdentity} from '../../../httpAgent'
import { idlFactory as FileHandle_idl } from 'dfx-generated/FileHandle';
import {useSelector, useDispatch} from 'react-redux';
import {DownloadOutlined, DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {Table, Popconfirm, Space} from 'antd';

const ListViewShared = () =>{

  const shared = useSelector(state=>state.FileHandler.shared);
  const [data, setData] = React.useState("")
  //const data = useRef([]);
  const dispatch = useDispatch();

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
  const handleDownload = async (record) =>{
    const icdrive = await httpAgent();
    const canisterIdShared = await icdrive.getUser(record["userNumber"]);
    const identityAgent = await httpAgentIdentity();
    const userAgentShare = Actor.createActor(FileHandle_idl, { agent: identityAgent, canisterId: canisterIdShared[0] });
    const chunkBuffers = [];
    for(let j=0; j<record["chunkCount"]; j++){
      const bytes = await userAgentShare.getSharedFileChunk(record["fileId"], j+1);
      const bytesAsBuffer = new Uint8Array(bytes[0]);
      chunkBuffers.push(bytesAsBuffer);
    }
    
    const fileBlob = new Blob([Buffer.concat(chunkBuffers)], {
      type: record["mimeType"],
    });
    const fileURL = URL.createObjectURL(fileBlob);
    var link = document.createElement('a');
    link.href = fileURL;
    link.download = record["name"];
    document.body.appendChild(link);
    link.click();
  }

  const columns = [
    {
      title: 'File Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'File Size',
      dataIndex: 'fileSize',
      key: 'fileSize',
      render: text => <div>{(Number(text)/(1024*1024)).toFixed(2)}&nbsp;MB</div>,
    },
    {
      title: 'Created',
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
        {
          shared===""?null:<Table dataSource={shared} columns={columns} />
        }
        
      </div>
    </Style>
  )
}

export default ListViewShared;

const Style = styled.div`
  thead[class*="ant-table-thead"] th{
    font-weight: bold !important;
  }
`