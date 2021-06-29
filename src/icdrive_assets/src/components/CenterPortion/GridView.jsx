import React from "react";
import styled from 'styled-components';

// custom imports
import {httpAgent} from '../../httpAgent'

// 3rd party imports
import {useSelector, useDispatch} from 'react-redux';
import {filesUpdate, refreshFiles} from '../../state/actions'
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import {Modal, message, Button, Input} from 'antd';

const GridView = () =>{

  const files = useSelector(state=>state.FileHandler.files)
  const dispatch = useDispatch();
  const [modalFlag, setModalFlag] = React.useState(false)
  const [viewFlag, setViewFlag] = React.useState(false)
  const [loadingFlag, setLoadingFlag] = React.useState(false)
  const [image, setImage] = React.useState("")
  const userNumber = React.useRef("")
  const [record, setRecord] = React.useState({})

  const download = async () => {
    console.log(record)
    const icdrive = await httpAgent();
    const chunkBuffers = [];
    for(let j=0; j<record["chunkCount"]; j++){
      const bytes = await icdrive.getFileChunk(record["fileId"], j+1);
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
  };

  const handleView = async() =>{
    setViewFlag(true)
    const icdrive = await httpAgent();
    const chunkBuffers = [];
    for(let j=0; j<record["chunkCount"]; j++){
      const bytes = await icdrive.getFileChunk(record["fileId"], j+1);
      const bytesAsBuffer = new Uint8Array(bytes[0]);
      chunkBuffers.push(bytesAsBuffer);
    }
    const fileBlob = new Blob([Buffer.concat(chunkBuffers)], {
      type: record["mimeType"],
    });
    const fileURL = URL.createObjectURL(fileBlob);
    setImage(fileURL)
  }

  const handleShare = async() =>{
    setLoadingFlag(true)
    const icdrive = await httpAgent();
    let userNumberInt = parseInt(userNumber.current.state.value)
    let response = await icdrive.shareFile(record["fileId"], userNumberInt)
    try{
      if(response.length>0){
        if(response[0]=="success"){
          message.success("File Shared")
          setModalFlag(false)
          setLoadingFlag(false)
        }
        else{
          message.error("Unauthorized")
          setLoadingFlag(false)
        }
      }else{
        message.error("Something Went Wrong! Check User Number")
        setLoadingFlag(false)
      }
    } catch{
      message.error("Something Went Wrong! Check User Number")
      setLoadingFlag(false)
    }
  }

  const handleMarked = async() =>{
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

  const handleClick = async (e, data) => {
    let option = data.selected
    if(option==="download"){
      await download()
    }
    if(option==="view"){
      await handleView()
    }
    if(option==="share"){
      await setModalFlag(true)
    }
    if(option==="mark"){
      await handleMarked()
    }
    if(option==="delete"){
      await handleDelete()
    }
  }

  return(
    <Style>
      <div className="grid-container">
        {
          files.map((value, index)=>{
            return(
              <ContextMenuTrigger id="same_unique_identifier">
                <div className="file-div" onContextMenu={()=>setRecord(value)}>
                  <div className="icon-part">
                    <img src="./icons/file-icon.svg" style={{ width: '60px' }}/>
                  </div>
                  <div className="text-part truncate-overflow">
                    {value.name}
                  </div>
                </div>
              </ContextMenuTrigger>
            )
          })
        }
      </div>
      
      <ContextMenu id="same_unique_identifier">
        <MenuItem data={{selected: 'download'}} onClick={handleClick}>
          <div id="context-download">
            Download
          </div>
        </MenuItem>
        <MenuItem data={{selected: 'edit'}} onClick={handleClick}>
          <div id="context-edit">
            Edit
          </div>
        </MenuItem>
        <MenuItem data={{selected: 'view'}} onClick={handleClick}>
          <div id="context-view">
            View
          </div>
        </MenuItem>
        <MenuItem data={{selected: 'share'}} onClick={handleClick}>
          <div id="context-share">
            Share
          </div>
        </MenuItem>
        <MenuItem divider />
        <MenuItem data={{selected: 'mark'}} onClick={handleClick}>
          <div id="context-mark">
            Mark
          </div>
        </MenuItem>
        <MenuItem data={{selected: 'delete'}} onClick={handleClick}>
          <div id="context-delete">
            Delete
          </div>
        </MenuItem>
      </ContextMenu>

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

export default GridView;

const Style = styled.div`

  .grid-container{
    display: flex;
    flex-flow: row wrap;
  }
  .file-div{
    margin-top: 30px;
    margin-left: 30px;
    width: 60px;
    height: 60px;
    justify-content: center;  
    align-items: center;
  }
  .text-part{
    font-size: 12px;
    word-wrap: break-word;
  }
  #context-download, #context-edit, #context-view, #context-share, #context-mark, #context-delete{
    background: #324851;
    font-size: 14px;
    height: 28px;
    width: 150px;
    color: #fff;
    padding-left: 20px;
    display: flex;
    align-items: center;
  }
  #context-download: hover, #context-edit: hover, #context-view: hover, #context-share: hover, #context-mark: hover, #context-delete: hover{
    background: #425757;
  }
  .truncate-overflow{
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow:hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
  }
`