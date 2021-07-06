import React from "react";
import styled from 'styled-components';

// custom imports
import {httpAgent, canisterHttpAgent, httpAgentIdentity} from '../../httpAgent'

// 3rd party imports
import * as streamSaver from 'streamsaver';
import { WritableStream } from 'web-streams-polyfill/ponyfill'
import { Actor } from '@dfinity/agent';
import { idlFactory as FileHandle_idl } from 'dfx-generated/FileHandle';
import {useSelector, useDispatch} from 'react-redux';
import {filesUpdate, refreshFiles} from '../../state/actions'
import {DownloadOutlined, DeleteOutlined, EditOutlined, ShareAltOutlined} from "@ant-design/icons";
import {Table, Popconfirm, Space, Modal, message, Button, Input} from 'antd';

const ListView = () =>{

  const files = useSelector(state=>state.FileHandler.files)
  const dispatch = useDispatch();
  const [fileObj, setFileObj] = React.useState({name:""})
  const [shareModal, setShareModal] = React.useState(false)
  const [viewFlag, setViewFlag] = React.useState(false)
  const [loadingFlag, setLoadingFlag] = React.useState(false)
  
  const [image, setImage] = React.useState("")
  const [type, setType] = React.useState("")
  const [name, setName] = React.useState("")

  const userNumber = React.useRef("")

  const image_types = ["image/bmp", "image/cis-cod", "image/gif", "image/ief", "image/jpeg",
        "image/pipeg", "image/svg+xml", "image/tiff", "image/tiff", "image/x-cmu-raster",
        "image/x-cmx", "image/x-icon", "image/x-portable-anymap", "image/x-portable-bitmap",
        "image/x-portable-graymap", "image/x-portable-pixmap", "image/x-rgb", "image/x-xbitmap",
        "image/x-xpixmap", "image/x-xwindowdump"]
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
    const icdrive = await httpAgent();
    const userAgent = await canisterHttpAgent();

    let userNumberInt = parseInt(userNumber.current.state.value)
    let canisterIdShared = await icdrive.getUser(userNumberInt)

    try{
      if(canisterIdShared.length===1){
        let resp_share = await userAgent.shareFile(fileObj["fileId"], userNumberInt, parseInt(localStorage.getItem("userNumber")))
        if(resp_share[0]==="Success"){
          const identityAgent = await httpAgentIdentity()
          const userAgentShare = Actor.createActor(FileHandle_idl, { agent: identityAgent, canisterId: canisterIdShared[0] });
          let fileInfo = {
            fileId: fileObj["fileId"],
            userNumber: fileObj["userNumber"],
            createdAt: Date.now(),
            name: fileObj["name"],
            chunkCount: fileObj["chunkCount"],
            fileSize: fileObj["fileSize"],
            mimeType: fileObj["mimeType"],
            marked: false,
            sharedWith: [],
            deleted: false
          }
          let res = await userAgentShare.addSharedFile(fileInfo)
          message.success("File Shared")
          setLoadingFlag(false)
        }
      }else{
        message.error("Something Went Wrong! Check User Number")
        setLoadingFlag(false)
      }
    } catch(err){
      console.log(err)
      message.error("Something Went Wrong! Check User Number")
      setLoadingFlag(false)
    }
  }

  const handleView = async() =>{
    let flag = 0
    console.log(fileObj["mimeType"])
    for(let i=0; i<image_types.length;i++){
      if(fileObj["mimeType"]===image_types[i]){
        flag=1
        setType("image")
        break
      }
    }
    if(fileObj["mimeType"].toString()==="application/pdf"){
      setType("pdf")
      flag=1
    }
    setName(fileObj["name"])
    if(flag){
      //setViewFlag(true)
      const userAgent = await canisterHttpAgent();
      const chunkBuffers = [];
      for(let j=0; j<fileObj["chunkCount"]; j++){
        const bytes = await userAgent.getFileChunk(fileObj["fileId"], j+1);
        const bytesAsBuffer = new Uint8Array(bytes[0]);
        chunkBuffers.push(bytesAsBuffer);
      }
      const fileBlob = new Blob([Buffer.concat(chunkBuffers)], {
        type: fileObj["mimeType"],
      });
      const fileURL = URL.createObjectURL(fileBlob);
      window.open(fileURL, '_blank');
      //setImage(fileURL)
    } else{
      message.info("Only PDF and Images can be viewed")
    }
    setFileObj({name:""})
  }

  const columns = [
    {
      title: 'File Name',
      dataIndex: 'name',
      key: 'name',
      editable: true,
      render: (text, record) => <div onDoubleClick={()=>{setFileObj(record);handleView()}}>{text}</div>,
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
            <ShareAltOutlined onClick={()=>{setShareModal(true);setFileObj(record)}} />
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
      <Modal footer={null} title={false} visible={shareModal} onCancel={()=>{setShareModal(false);setFileObj({name:""})}}>
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
        onCancel={()=>{setImage("");setFileObj({name:""});setViewFlag(false)}}
        closeIcon = {null}
      >
        {
          type=="pdf"?
          <object data={image} name={name} type='application/pdf' width="500px" height="650px"></object>
          :
          <img src={image} width="500px" height="650px" />
        }
      </Modal>
      <div style={{display:"none"}}>{fileObj["name"]}</div>
    </Style>
  )
}

export default ListView;

const Style = styled.div`
  thead[class*="ant-table-thead"] th{
    font-weight: bold !important;
  }
`