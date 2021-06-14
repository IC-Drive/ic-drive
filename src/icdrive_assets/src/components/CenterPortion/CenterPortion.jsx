import React from "react";
import styled from 'styled-components';

// custom imports
import ListView from './ListView';
import GridView from './GridView';

// 3rd party imports
import {MenuOutlined, AppstoreOutlined} from "@ant-design/icons";
import {useSelector} from 'react-redux'

const CenterPortion = () =>{

  const [selectedView, setSelectedView] = React.useState("listView");
  const upload = useSelector(state=>state.FileHandler.upload);

  return(
    <Style>
      <div className="top-bar">
        <div>
          {
            upload["file_count"]>0?
            <div className="show-upload">
              &nbsp;Uploading:&nbsp;{upload["file_uploading"]}&nbsp;&nbsp;{upload["completed"]}/{upload["file_count"]}
            </div>
            :
            null
          }
        </div>
        <div className="list-grid-view">
          {
            selectedView==="listView"?
            <span>
              <MenuOutlined onClick={()=>{setSelectedView("listView")}} className="list-view" style={{fontSize:"20px", color: "#fff"}} />&nbsp;&nbsp;
              <AppstoreOutlined onClick={()=>{setSelectedView("gridView")}} className="grid-view" style={{fontSize:"20px"}} />
            </span>
            :
            <span>
              <MenuOutlined onClick={()=>{setSelectedView("listView")}} className="list-view" style={{fontSize:"20px"}} />&nbsp;&nbsp;
              <AppstoreOutlined onClick={()=>{setSelectedView("gridView")}} className="grid-view" style={{fontSize:"20px", color: "#fff"}} />
            </span>
          }
        </div>
      </div>
      {
        selectedView==="listView"?
        <ListView/>
        :
        <GridView/>
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
  .show-upload{
    font-size: 16px;
    font-weight: 400;
    color: #524f49;
  }
`