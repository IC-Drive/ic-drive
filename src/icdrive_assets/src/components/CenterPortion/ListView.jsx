import React from 'react'
import styled from 'styled-components'

// custom imports
import { filesUpdate, refreshFiles } from '../../state/actions'
import { downloadFile, viewFile, markFile, deleteFile, shareFile, shareFilePublic, bytesToSize } from './Methods'

// 3rd party imports
import { useSelector, useDispatch } from 'react-redux'
import { Table, Popconfirm, Space, Modal, message, Button, Input } from 'antd'
import { DownloadOutlined, DeleteOutlined, EditOutlined, ShareAltOutlined } from '@ant-design/icons'

const ListView = () =>{

  const files = useSelector(state=>state.FileHandler.files)
  const dispatch = useDispatch();

  const fileObj = React.useRef({})
  const [shareModal, setShareModal] = React.useState(false)
  const [ShareLoadingFlag, setShareLoadingFlag] = React.useState(false)
  const [PublicLoadingFlag, setPublicLoadingFlag] = React.useState(false)
  const userName = React.useRef("")

  //Functions
  const handleDownload = async (record) =>{
    await downloadFile(record)
  }

  const handleMarked = async(record) =>{
    let temp = [...files]
    for(let i=0; i<temp.length; i++){
      if(temp[i]["fileId"]===record["fileId"]){
        temp[i]["marked"] = !temp[i]["marked"]
      }
    }
    dispatch(filesUpdate(temp));
    await markFile(record)
  }

  const handleDelete = async(record) =>{
    await deleteFile(record)
    dispatch(refreshFiles(true));
  }

  const handleView = async(record) =>{
    let response = await viewFile(record)
    if(!response){
      message.info("Only PDF and Images can be viewed")
    }
  }

  const handleShare = async() =>{
    setShareLoadingFlag(true)
    let response = await shareFile(fileObj.current, userName.current.state.value)
    if(response){
      message.success("File Shared")
    } else{
      message.error("Something Went Wrong! Check User Name")
    }
    setShareLoadingFlag(false)
  }

  const handleSharePublic = async() =>{
    setPublicLoadingFlag(true)
    let response = await shareFilePublic(fileObj.current)
    console.log(response)
    if(response){
      fileObj.current["fileHash"] = response
    } else{
      message.info("Only Images and PDF can be made public!!!")
    }
    setPublicLoadingFlag(false)
  }

  // Defining Columns of Table
  const columns = [
    {
      title: 'File Name',
      dataIndex: 'name',
      key: 'name',
      editable: true,
      render: (text, record) => <div onDoubleClick={()=>{handleView(record)}}>{text}</div>,
    },
    {
      title: 'File Size',
      dataIndex: 'fileSize',
      key: 'fileSize',
      render: text => <div>{(bytesToSize(Number(text)))}</div>,
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
          <Popconfirm title="Sure to delete?" onConfirm={()=>{handleDelete(record)}}>
          <a>
            <DeleteOutlined />
          </a>
          </Popconfirm>
          <a>
            <ShareAltOutlined onClick={()=>{setShareModal(true);fileObj.current = record}} />
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

      {/* Modal For INput User Name */}
      <Modal footer={null} title={false} visible={shareModal} onCancel={()=>{setShareModal(false); fileObj.current = {} }}>
        <div>
        {
          fileObj.current["fileHash"]===""?
          <div>
            <span>User Name:&nbsp;<Input ref={userName} /></span>
            <Button type="primary" style={{float:"right", marginTop:"10px"}} loading={ShareLoadingFlag} onClick={handleShare}>Share</Button>&nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary" style={{float:"right", marginTop:"10px"}} loading={PublicLoadingFlag} onClick={handleSharePublic}>Public</Button>&nbsp;&nbsp;&nbsp;&nbsp;
            <br/><br/>
          </div>
          :
          <a onClick={() => {navigator.clipboard.writeText(window.location.href+"public/"+fileObj.current["fileHash"]); message.info("copied to clipboard")}}>{window.location.href}public/{fileObj.current["fileHash"]}</a>
        }
        <br/>
        </div>
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