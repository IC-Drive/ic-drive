import React from "react";
import styled from 'styled-components';

// custom imports
import ListView from './ListView';
import GridView from './GridView';
import ListViewMarked from './Marked/ListViewMarked';
import ListViewShared from "./Shared/ListViewShared";

// 3rd party imports
import {MenuOutlined, AppstoreOutlined, CaretDownOutlined, CaretUpOutlined} from "@ant-design/icons";
import {useSelector} from 'react-redux';
import { Progress } from 'antd';

const CenterPortion = () =>{

  const [selectedView, setSelectedView] = React.useState("listView");
  const [minimizeUpload, setMinimizeUpload] = React.useState(false);
  const upload = useSelector(state=>state.FileHandler.upload);
  const optionSelected = useSelector(state=>state.OptionSelected.option);
  const uploadProgress = useSelector(state=>state.UploadProgress.progress);

  return(
    <Style>
      <div className="top-bar">
        <div>
          {
            optionSelected==="marked"?
            <div className="show-section">
              &nbsp;&nbsp;Marked
            </div>
            :
            optionSelected==="shared"?
            <div className="show-section">
              &nbsp;&nbsp;Shared
            </div>
            :
            optionSelected==="home"?
            <div className="show-section">
              &nbsp;&nbsp;Home
            </div>
            :
            null
          }
        </div>
        <div className="list-grid-view">
          {
            selectedView==="listView"?
            <span>
              <MenuOutlined onClick={()=>{setSelectedView("listView")}} className="list-view" style={{fontSize:"20px", color: "#21353E"}} />&nbsp;&nbsp;
              <AppstoreOutlined onClick={()=>{setSelectedView("gridView")}} className="grid-view" style={{fontSize:"20px", color: "#fff"}} />
            </span>
            :
            <span>
              <MenuOutlined onClick={()=>{setSelectedView("listView")}} className="list-view" style={{fontSize:"20px", color: "#fff"}} />&nbsp;&nbsp;
              <AppstoreOutlined onClick={()=>{setSelectedView("gridView")}} className="grid-view" style={{fontSize:"20px", color: "#21353E"}} />
            </span>
          }
        </div>
      </div>
      {
        optionSelected==="marked"?
        <div>
          <ListViewMarked/>
        </div>
        :
        optionSelected==="shared"?
        <div>
          <ListViewShared/>
        </div>
        :
        optionSelected==="home"?
        <div>
          {
            selectedView==="listView"?
            <ListView/>
            :
            <GridView/>
          }
        </div>
        :
        null
      }
      {
        upload["file_count"]>0?
        <div className="upload-container">
          <div className="upload-top-bar">
            <span id="top-bar-text">Uploading&nbsp;&nbsp;{upload["completed"]}/{upload["file_count"]}&nbsp;...</span>
            {
              minimizeUpload?
              <span id="top-bar-minimize" onClick={()=>setMinimizeUpload(!minimizeUpload)} ><CaretUpOutlined style={{color:"#fff", fontSize:"18px"}} /></span>
              :
              <span id="top-bar-minimize" onClick={()=>setMinimizeUpload(!minimizeUpload)} ><CaretDownOutlined style={{color:"#fff", fontSize:"18px"}} /></span>
            }
            
          </div>
          {
            minimizeUpload?
            null
            :
            <div className="upload-bottom-bar">
              <span id="bottom-bar-text">
                <div id="left-section" className="truncate-overflow">
                  {upload["file_uploading"]}
                </div>
                <div id="right-section">
                  <Progress steps={4} percent={uploadProgress} />
                </div>
              </span>
            </div>
          }
        </div>
        :
        null
      }
    </Style>
  )
}

export default CenterPortion;

const Style = styled.div`
  width: calc(100vw - 225px);
  height: calc(100vh - 50px);
  box-sizing: border-box;
  overflow-x: auto;
  overflow-y: auto;

  .top-bar{
    width: calc(100vw - 225px);
    height: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #C9D1C8;
  }
  .list-grid-view{
    display: flex;
    margin-right: 22px;
    width: 60px;
  }
  .show-section{
    font-size: 16px;
    font-weight: 500;
    color: #000;
  }

  .upload-container{
    position: fixed;
    bottom: 0;
    right: 0;
  }
  .upload-top-bar{
    height: 36px;
    width: 350px;
    font-size: 18px;
    background: #324851;
    display: flex;
    align-items: center;
  }
  .upload-bottom-bar{
    height: 80px;
    width: 350px;
    background: #eaeaea;
    font-size: 16px;
    font-weight: 300;
  }
  #top-bar-text{
    margin-left: 5px;
    color: #fff;
    width: calc(100% - 35px);
  }
  #top-bar-minimize{
    width: 25px;
    margin-right: 10px;
  }
  #bottom-bar-text{
    padding-top: 5px;
    margin-left: 5px;
    color: #000;
    display: flex;
  }
  #left-section{
    width: calc(100% - 100px);
    margin-right: 5px;
  }
  #right-section{
    width: 100px;
    margin-right: 5px;
  }
  .truncate-overflow{
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow:hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
  }
  #top-bar-minimize:hover{
    cursor: pointer;
  }
`