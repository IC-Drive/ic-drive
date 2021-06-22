import React from "react";
import styled from 'styled-components';

// custom imports
import {httpAgent} from '../../httpAgent'

// 3rd party imports
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
  const [loadingFlag, setLoadingFlag] = React.useState(false)
  const userNumber = React.useRef("")

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
    const icdrive = await httpAgent();
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

  const handleMarked = async(record) =>{
    let temp = [...files]
    for(let i=0; i<temp.length; i++){
      if(temp[i]["fileId"]===record["fileId"]){
        temp[i]["marked"] = !temp[i]["marked"]
      }
    }
    dispatch(filesUpdate(temp));
    const icdrive = await httpAgent();
    await icdrive.markFile(record["fileId"]);
  }

  const handleDelete = async(record) =>{
    const icdrive = await httpAgent();
    await icdrive.deleteFile(record["fileId"]);
    dispatch(refreshFiles(true));
  }

  const handleShare = async() =>{
    setLoadingFlag(true)
    const icdrive = await httpAgent();
    let userNumberInt = parseInt(userNumber.current.state.value)
    let response = await icdrive.shareFile(modalFlag["fileId"], userNumberInt)
    try{
      if(response.length>0){
        if(response[0]=="success"){
          message.success("File Shared")
          setModalFlag(false)
          setLoadingFlag(false)
        }
        else{
          message.error("Unauthorized")
          setModalFlag(false)
          setLoadingFlag(false)
        }
      }
    } catch{
      message.error("Something Went Wrong!")
      setModalFlag(false)
      setLoadingFlag(false)
    }
  }

  const columns = [
    {
      title: 'File Name',
      dataIndex: 'name',
      key: 'name',
      editable: true,
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
      render: (_, record) => <div>{record.marked?<BookOutlined style={{ height: '14px', color: '#1890ff' }} onClick={()=>handleMarked(record)} />:<BookOutlined style={{ height: '14px', color: '#000' }} onClick={()=>handleMarked(record)} />}</div>,
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
        <span>User Number:&nbsp;<Input ref={userNumber} /></span>
        <Button style={{float:"right"}} loading={loadingFlag} onClick={handleShare}>Share</Button>
      </Modal>
    </Style>
  )
}

export default ListView;

const Style = styled.div`

`