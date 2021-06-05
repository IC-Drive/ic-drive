import React from "react";
import styled from 'styled-components';

// custom imports
//import { Actor, HttpAgent } from '@dfinity/agent';
//import { idlFactory as icdrive_idl, canisterId as icdrive_id } from 'dfx-generated/icdrive';

// 3rd party imports
//import * as streamSaver from 'streamsaver';
//import { WritableStream } from 'web-streams-polyfill/ponyfill'
import {MenuOutlined, AppstoreOutlined} from "@ant-design/icons"

const GridView = ({setSelectedView}) =>{

  const [files, setFiles] = React.useState([])

  return(
    <Style>
      <div className="strip">
        <div className="operations">

        </div>
        <div className="list-grid-view">
          <span>
            <MenuOutlined onClick={()=>{setSelectedView("listView")}} className="list-view" style={{fontSize:"20px"}} />&nbsp;&nbsp;
            <AppstoreOutlined onClick={()=>{setSelectedView("gridView")}} className="grid-view" style={{fontSize:"20px", color: "#fff"}} />
          </span>
        </div>
      </div>
    </Style>
  )
}

export default GridView;

const Style = styled.div`

  .strip{
    width: calc(100vw - 225px);
    height: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #C9D1C8;
  }
  .operations{
    width: calc(100% - 60px);
    font-size: 14px;
    font-weight: 500;
    color: #232122;
  }
  .list-grid-view{
    display: flex;
    margin-right: 22px;
    width: 60px;
  }
`