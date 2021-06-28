import React from "react";
import styled from 'styled-components';

// custom imports

// 3rd party imports
import * as streamSaver from 'streamsaver';
import { WritableStream } from 'web-streams-polyfill/ponyfill'
import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from "@dfinity/auth-client";
import { idlFactory as icdrive_idl, canisterId as icdrive_id } from 'dfx-generated/icdrive';
import {useSelector, useDispatch} from 'react-redux';
import {DownloadOutlined, DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {Table, Popconfirm, Space} from 'antd';

const ListViewMarked = () =>{

  const files = useSelector(state=>state.FileHandler.files);
  const [data, setData] = React.useState("")
  //const data = useRef([]);
  const dispatch = useDispatch();

  React.useEffect(()=>{
    let temp = []
    for(let i=0; i<files.length; i++){
      if(files[i]["marked"]){
        temp.push(files[i])
      }
    }
    console.log("here")
    console.log(temp)
    setData(temp)
  },[])

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
  const download = async (fileId, chunk_count, fileName, mimeType) => {
    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();
    const agent = new HttpAgent({ identity });
    const icdrive = Actor.createActor(icdrive_idl, { agent, canisterId: icdrive_id });

    const chunkBuffers = [];
    for(let j=0; j<chunk_count; j++){
      const bytes = await icdrive.getFileChunk(fileId, j+1);
      const bytesAsBuffer = new Uint8Array(bytes[0]);
      chunkBuffers.push(bytesAsBuffer);
    }
    
    const fileBlob = new Blob([Buffer.concat(chunkBuffers)], {
      type: mimeType,
    });
    const fileURL = URL.createObjectURL(fileBlob);
    var link = document.createElement('a');
    link.href = fileURL;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
  };

  const handleDownload = async (record) =>{
    let k = await download(record["fileId"], record["chunkCount"], record["name"], record["mimeType"])
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
      render: text => <div>{text/2}MB</div>,
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
          data===""?null:<Table dataSource={data} columns={columns} />
        }
        
      </div>
    </Style>
  )
}

export default ListViewMarked;

const Style = styled.div`
  thead[class*="ant-table-thead"] th{
    font-weight: bold !important;
  }
`