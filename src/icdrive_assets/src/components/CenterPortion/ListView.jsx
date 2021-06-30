import React from "react";
import styled from 'styled-components';

// custom imports
import {httpAgent, canisterHttpAgent} from '../../httpAgent'

// 3rd party imports
import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from "@dfinity/auth-client";
import { idlFactory as icdrive_idl } from 'dfx-generated/icdrive';
import * as streamSaver from 'streamsaver';
import { WritableStream } from 'web-streams-polyfill/ponyfill'
import {useSelector, useDispatch} from 'react-redux';
import {filesUpdate, refreshFiles} from '../../state/actions'
import {DownloadOutlined, DeleteOutlined, EditOutlined, BookOutlined, ShareAltOutlined} from "@ant-design/icons";
import {Table, Popconfirm, Space, Modal, message, Button, Input} from 'antd';

const ListView = () =>{

  const files = useSelector(state=>state.FileHandler.files)
  const dispatch = useDispatch();
  const [modalFlag, setModalFlag] = React.useState(false)
  const [viewFlag, setViewFlag] = React.useState(false)
  const [loadingFlag, setLoadingFlag] = React.useState(false)
  const [image, setImage] = React.useState("")
  const userNumber = React.useRef("")

  // For large files not working on firefox to be fixed
  /*const download = async (fileId, chunk_count, fileName) => {
    streamSaver.WritableStream = WritableStream
    streamSaver.mitm = 'http://localhost:8000/mitm.html'
    const fileStream = streamSaver.createWriteStream(fileName);
    const writer = fileStream.getWriter();
    for(let j=0; j<chunk_count; j++){
      const bytes = await userAgent.getFileChunk(fileId, j+1);
      //const bytesAsBuffer = Buffer.from(new Uint8Array(bytes[0]));
      const bytesAsBuffer = new Uint8Array(bytes[0]);
      writer.write(bytesAsBuffer);
    }
    writer.close();
  };*/

  //Temporary method works well on small files
  const handleDownload = async (record) =>{
    const userAgent = await canisterHttpAgent();

    const chunkBuffers = [];
    for(let j=0; j<record["chunkCount"]; j++){
      const bytes = await userAgent.getFileChunk(record["fileId"], j+1);
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

  const handleMarked = async(record) =>{
    let temp = [...files]
    for(let i=0; i<temp.length; i++){
      if(temp[i]["fileId"]===record["fileId"]){
        temp[i]["marked"] = !temp[i]["marked"]
      }
    }
    dispatch(filesUpdate(temp));
    const userAgent = await canisterHttpAgent();
    await userAgent.markFile(record["fileId"]);
  }

  const handleDelete = async(record) =>{
    const userAgent = await canisterHttpAgent();
    await userAgent.deleteFile(record["fileId"]);
    dispatch(refreshFiles(true));
  }

  const handleShare = async() =>{
    setLoadingFlag(true)
    const icdriveAgent = await httpAgent();
    let userNumberInt = parseInt(userNumber.current.state.value)
    const canisterId = await icdriveAgent.getCanisterId(userNumberInt);
    console.log(canisterId)
    if(canisterId.length>0){
      if(canisterId[0]==="Unauthorized"){
        message.error("Cant Share File to Yourself")
      } else{
        const authClient = await AuthClient.create();
        const identity = await authClient.getIdentity();
        const agent = new HttpAgent({ identity });
        const shareAgent = Actor.createActor(icdrive_idl, { agent, canisterId: canisterId[0] });
        const fileObj = {
          userId: modalFlag["userId"],
          createdAt: parseInt(modalFlag["createdAt"]),
          fileId: modalFlag["fileId"],
          name: modalFlag["name"],
          chunkCount: parseInt(modalFlag["chunkCount"]),
          fileSize: parseInt(modalFlag["fileSize"]),
          mimeType: modalFlag["mimeType"],
          marked: false,
          sharedWith: []
        }
        const resp = shareAgent.shareFile(fileObj);
        if(resp[0]==="Unauthorized"){
          message.error("You are not owner of this file")
        } else{
          message.success("File Shared Successfully")
        }
      }
    } else{
      message.error("User does not exist")
    }
    setLoadingFlag(false)
  }

  const handleView = async(record) =>{
    setViewFlag(true)
    const userAgent = await canisterHttpAgent();
    const chunkBuffers = [];
    for(let j=0; j<record["chunkCount"]; j++){
      const bytes = await userAgent.getFileChunk(record["fileId"], j+1);
      const bytesAsBuffer = new Uint8Array(bytes[0]);
      chunkBuffers.push(bytesAsBuffer);
    }
    const fileBlob = new Blob([Buffer.concat(chunkBuffers)], {
      type: record["mimeType"],
    });
    const fileURL = URL.createObjectURL(fileBlob);
    setImage(fileURL)
  }

  const columns = [
    {
      title: 'File Name',
      dataIndex: 'name',
      key: 'name',
      editable: true,
      render: (text, record) => <div onDoubleClick={()=>handleView(record)}>{text}</div>,
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
      title: 'Mark',
      dataIndex: 'marked',
      key: 'marked',
      render: (_, record) => <div>{record.marked?<img src="./icons/mark-blue.svg" style={{ height: '14px' }} onClick={()=>handleMarked(record)} />:<img src="./icons/mark-gray.svg" style={{ height: '14px' }} onClick={()=>handleMarked(record)} />}</div>,
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
          <Popconfirm title="Sure to delete?" onConfirm={() => {handleDelete(record)}}>
          <a>
            <DeleteOutlined />
          </a>
          </Popconfirm>
          <a>
            <ShareAltOutlined onClick={()=>setModalFlag(record)} />
          </a>
        </Space>
        );
      },
    },
  ];

  return(
    <Style>
      <div>
        <Table dataSource={files} columns={columns} />
      </div>
      <Modal footer={null} title={false} visible={modalFlag} onCancel={()=>setModalFlag(false)}>
        <div>
        <span>User Number:&nbsp;<Input ref={userNumber} /></span>
        <Button type="primary" style={{float:"right", marginTop:"10px"}} loading={loadingFlag} onClick={handleShare}>Share</Button>
        <br/><br/><br/>
        </div>
      </Modal>

      <Modal
        footer={null}
        width="600px"
        visible={viewFlag}
        destroyOnClose = {true}
        centered = {true}
        onCancel={()=>setViewFlag(false)}
        closeIcon = {null}
      >
        <img src={image} width="500px" />
      </Modal>
    </Style>
  )
}

export default ListView;

const Style = styled.div`
  thead[class*="ant-table-thead"] th{
    font-weight: bold !important;
  }
`