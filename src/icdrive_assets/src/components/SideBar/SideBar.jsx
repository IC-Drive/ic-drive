import React from "react";
import styled from 'styled-components';

// custom imports
import {useUploadFile} from './File.jsx';
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as icdrive_idl, canisterId as icdrive_id } from 'dfx-generated/icdrive';

// 3rd party imports
import {useDispatch, useSelector} from 'react-redux'
import {uploadUpdate, refreshFiles} from '../../state/actions'

const SideBar = () =>{

  const dispatch = useDispatch();
  //const authClient = await AuthClient.create();
  //const identity = await authClient.getIdentity();
  //const agent = new HttpAgent({ identity });
  //const icdrive = Actor.createActor(icdrive_idl, { agent, canisterId: icdrive_id });

  const files = useSelector(state=>state.FileHandler.files)

  React.useEffect(async()=>{
    
  },[])

  const onFileSelect = async (evt) => {
    const file_list = evt.target.files

    const file_array = [...files]
    for(let i=0; i<file_list.length; i++){
      const file = file_list[i];
      dispatch(uploadUpdate({file_uploading: file.name, file_count: file_list.length, completed: i+1}))
      const file_obj = await useUploadFile(file);
      file_array.push(file_obj)
    }
    dispatch(uploadUpdate({file_uploading: "", file_count: 0, completed: 0}))
    dispatch(refreshFiles(true))
  }

  return(
    <Style>
      <div className="container">
        <div className="content">
          
          <div className="element">
            <label id="label-file" for="upload-file">
            <div className="element-section">
              <div className="icon-part">
              <img src="./icons/upload.svg" style={{ height: '22px', color: '#fff' }} />
              </div>
              <div className="text-part">
                <span>
                  <div>
                    Upload
                    <input type="file" id="upload-file" onChange={onFileSelect} className="file_upload" multiple/>
                  </div>
                </span>
              </div>
            </div>
            </label>
          </div>

          <div className="element">
            <div className="element-section">
              <div className="icon-part">
                <img src="./icons/share.svg" style={{ height: '22px', color: '#fff' }} />
              </div>
              <div className="text-part">
                <span>Shared</span>
              </div>
            </div>
          </div>

          <div className="element">
            <div className="element-section">
              <div className="icon-part">
                <img src="./icons/mark.svg" style={{ height: '22px', color: '#fff' }} />
              </div>
              <div className="text-part">
                <span>Marked</span>
              </div>
            </div>
          </div>

          <div className="element">
            <div className="element-section">
              <div className="icon-part">
                <img src="./icons/import.svg" style={{ height: '22px', color: '#fff' }} />
              </div>
              <div className="text-part">
                <span>Import</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Style>
  )
}

export default SideBar;

const Style = styled.div`
  .container{
    background: #324851;
    height: calc(100vh - 50px);
    width: 225px;
  }
  .content{
    padding-top: 50px;
  }
  .element{
    
  }
  .element-section{
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .text-part{
    font-size: 20px;
    font-weight: 400;
    padding-left: 30px;
  }
  .icon-part{
    padding-left: 22.5px;
  }
  .element-section:hover{
    cursor: pointer;
    background: #425757;
    border-radius: 10px;
  }
  .file_upload {
    opacity: 0.0;
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
    filter: alpha(opacity=0);
    -moz-opacity: 0.0;
    -khtml-opacity: 0.0;
  }
  #upload-file {
    opacity: 0;
    position: absolute;
    z-index: -1;
  }
  #label-file:hover {
    cursor: pointer;
  }
`