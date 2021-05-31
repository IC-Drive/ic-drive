import React from "react";
import styled from 'styled-components';

// custom imports
import icdrive from 'ic:canisters/icdrive';

// 3rd party imports
import { CloudUploadOutlined, ShareAltOutlined, SyncOutlined, BookOutlined } from '@ant-design/icons';

const SideBar = () =>{

  return(
    <Style>
      <div className="container">
        <div className="content">
          <div className="element">
            <div className="icon-part">
              <CloudUploadOutlined style={{ fontSize: '25px', color: '#fff' }} />
            </div>
            <div className="text-part">
              <span>Upload</span>
            </div>
          </div>

          <div className="element">
            <div className="icon-part">
              <ShareAltOutlined style={{ fontSize: '25px', color: '#fff' }} />
            </div>
            <div className="text-part">
              <span>Share</span>
            </div>
          </div>

          <div className="element">
            <div className="icon-part">
              <BookOutlined style={{ fontSize: '25px', color: '#fff' }} />
            </div>
            <div className="text-part">
              <span>Marked</span>
            </div>
          </div>

          <div className="element">
            <div className="icon-part">
              <SyncOutlined style={{ fontSize: '25px', color: '#fff' }} />
            </div>
            <div className="text-part">
              <span>Import Data</span>
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
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .text-part{
    font-size: 18px;
    padding-left: 20px;
  }
  .element:hover{
    cursor: pointer;
  }
`