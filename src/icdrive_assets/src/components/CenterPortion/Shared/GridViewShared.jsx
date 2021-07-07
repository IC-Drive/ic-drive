import React from 'react'
import styled from 'styled-components'

// custom imports
import { refreshFiles } from '../../../state/actions'
import { downloadSharedFile, viewSharedFile, deleteSharedFile } from '../Methods'

// 3rd party imports
import { message } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu'

const GridView = () =>{

  const shared = useSelector(state=>state.FileHandler.shared);
  const dispatch = useDispatch();

  const fileObj = React.useRef({})

  const handleDownload = async () =>{
    await downloadSharedFile(fileObj.current)
  }

  const handleDelete = async() =>{
    await deleteSharedFile(fileObj.current)
    dispatch(refreshFiles(true));
  }

  const handleView = async() =>{
    let response = await viewSharedFile(fileObj.current)
    if(!response){
      message.info("Only PDF and Images can be viewed")
    }
  }

  const handleClick = async (e, data) => {
    let option = data.selected
    if(option==="download"){
      await handleDownload()
    }
    if(option==="view"){
      await handleView()
    }
    if(option==="delete"){
      await handleDelete()
    }
  }

  return(
    <Style>
      <div className="grid-container">
        {
          shared.map((value, index)=>{
            return(
              <ContextMenuTrigger id="same_unique_identifier">
                <div className="file-div" onContextMenu={()=>{fileObj.current = value}}>
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
        <MenuItem data={{selected: 'view'}} onClick={handleClick}>
          <div id="context-view">
            View
          </div>
        </MenuItem>
        <MenuItem divider />
        <MenuItem data={{selected: 'delete'}} onClick={handleClick}>
          <div id="context-delete">
            Delete
          </div>
        </MenuItem>
      </ContextMenu>

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