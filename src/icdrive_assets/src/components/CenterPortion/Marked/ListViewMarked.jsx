import React from 'react'
import styled from 'styled-components'

// custom imports
import { filesUpdate, refreshFiles } from '../../../state/actions'
import { downloadFile, viewFile, markFile, deleteFile, shareFile, bytesToSize } from '../Methods'

// 3rd party imports
import { useSelector, useDispatch } from 'react-redux'
import { Table, Popconfirm, Space, Modal, message, Button, Input } from 'antd'
import { DownloadOutlined, DeleteOutlined, EditOutlined, ShareAltOutlined } from '@ant-design/icons'

const ListView = () =>{

  const files = useSelector(state=>state.FileHandler.files)
  const [data, setData] = React.useState("")
  const dispatch = useDispatch();

  const fileObj = React.useRef({})
  const [shareModal, setShareModal] = React.useState(false)
  const [loadingFlag, setLoadingFlag] = React.useState(false)
  const userNumber = React.useRef("")

  //Functions
  React.useEffect(()=>{
    let temp = []
    for(let i=0; i<files.length; i++){
      if(files[i]["marked"]){
        temp.push(files[i])
      }
    }
    setData(temp)
  },[])

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
    setLoadingFlag(true)
    let response = shareFile(fileObj.current, parseInt(userNumber.current.state.value))
    if(response){
      message.success("File Shared")
    } else{
      message.error("Something Went Wrong! Check User Number")
    }
    setLoadingFlag(false)
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
        <Table dataSource={data} columns={columns} />
      </div>

      {/* Modal For INput User Number */}
      <Modal footer={null} title={false} visible={shareModal} onCancel={()=>{setShareModal(false); fileObj.current = {} }}>
        <div>
        <span>User Number:&nbsp;<Input ref={userNumber} /></span>
        <Button type="primary" style={{float:"right", marginTop:"10px"}} loading={loadingFlag} onClick={handleShare}>Share</Button>
        <br/><br/><br/>
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