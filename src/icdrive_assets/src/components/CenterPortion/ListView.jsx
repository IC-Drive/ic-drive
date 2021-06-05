import React from "react";
import styled from 'styled-components';

// custom imports

// 3rd party imports
//import * as streamSaver from 'streamsaver';
//import { WritableStream } from 'web-streams-polyfill/ponyfill'
import {MenuOutlined, AppstoreOutlined} from "@ant-design/icons"

const ListView = ({setSelectedView}) =>{

  const [files, setFiles] = React.useState([])

  return(
    <Style>
      <div className="strip">
        <div className="headings">
          <span id="name">File Name</span>
          <span id="owner">Owner</span>
          <span id="changed">Last Changed</span>
          <span id="size">File Size</span>
          <span id="action">Action</span>
        </div>
        <div className="list-grid-view">
          <span>
            <MenuOutlined onClick={()=>{setSelectedView("listView")}} className="list-view" style={{fontSize:"20px", color: "#fff"}} />&nbsp;&nbsp;
            <AppstoreOutlined onClick={()=>{setSelectedView("gridView")}} className="grid-view" style={{fontSize:"20px"}} />
          </span>
        </div>
      </div>
    </Style>
  )
}

export default ListView;

const Style = styled.div`

  .strip{
    width: calc(100vw - 225px);
    height: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #C9D1C8;
  }
  .headings{
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
  #name{
    margin-left: 10%;
    width: 150px;
  }
  #owner{
    margin-left: 10%;
    width: 70px;
  }
  #changed{
    margin-left: 10%;
    width: 100px;
  }
  #size{
    margin-left: 10%;
    width: 70px;
  }
  #action{
    margin-left: 10%;
    width: 70px;
  }
  #downArrow{
    float: right;
    margin-right: 22px;
  }
  #downArrow:hover{
    cursor: pointer;
  }
`