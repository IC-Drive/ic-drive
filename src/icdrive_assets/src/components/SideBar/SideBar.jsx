import React from "react";
import styled from 'styled-components';

// custom imports
import {useUploadFile} from './File.jsx';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as icdrive_idl, canisterId as icdrive_id } from 'dfx-generated/icdrive';

// 3rd party imports
import { CloudUploadOutlined, ShareAltOutlined, SyncOutlined, BookOutlined } from '@ant-design/icons';

const SideBar = () =>{

  const agent = new HttpAgent();
  const icdrive = Actor.createActor(icdrive_idl, { agent, canisterId: icdrive_id });

  const [id, setId] = React.useState("");
  
  React.useEffect(async()=>{
    const id = await icdrive.getOwnId();
    setId(id);
  },[])

  const onFileSelect = async (evt) => {
    console.log(evt.target.files)
    const file_list = evt.target.files
    for(let i=0; i<file_list.length; i++){
      const file = file_list[i];
      //console.log(file)
      let _ = await useUploadFile(id, file)
    }
  }

  return(
    <Style>
      <div className="container">
        <div className="content">
          <div className="element">
            <div className="element-section">
              <div className="icon-part">
                <CloudUploadOutlined style={{ fontSize: '25px', color: '#fff' }} />
              </div>
              <div className="text-part">
                <span>
                  <div>
                    <label id="label-file" for="upload-file">Upload</label>
                    <input type="file" id="upload-file" onChange={onFileSelect} className="file_upload" multiple/>
                  </div>
                </span>
              </div>
            </div>
          </div>

          <div className="element">
            <div className="element-section">
              <div className="icon-part">
                <ShareAltOutlined style={{ fontSize: '25px', color: '#fff' }} />
              </div>
              <div className="text-part">
                <span>Share</span>
              </div>
            </div>
          </div>

          <div className="element">
            <div className="element-section">
              <div className="icon-part">
                <BookOutlined style={{ fontSize: '25px', color: '#fff' }} />
              </div>
              <div className="text-part">
                <span>Marked</span>
              </div>
            </div>
          </div>

          <div className="element">
            <div className="element-section">
              <div className="icon-part">
                <SyncOutlined style={{ fontSize: '25px', color: '#fff' }} />
              </div>
              <div className="text-part">
                <span>Import Data</span>
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
    background: #141C25;
    height: calc(100vh - 50px);
    width: 225px;
  }
  .content{
    padding-top: 20px;
  }
  .element{
    padding: 7.5px 15px 7.5px 10px;
  }
  .element-section{
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .text-part{
    font-size: 18px;
    padding-left: 20px;
  }
  .element-section:hover{
    cursor: pointer;
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