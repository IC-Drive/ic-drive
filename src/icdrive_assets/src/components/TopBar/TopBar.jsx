import React from 'react'
import styled from 'styled-components'

// custom imports
import {updateState} from '../../state/actions'

// 3rd party imports
import {Input} from 'antd'
import {useDispatch} from 'react-redux'
import { QuestionCircleOutlined } from '@ant-design/icons'

const TopBar = () =>{

  const dispatch = useDispatch();
  
  return(
    <Style>
      <div className="container">
        <div className="left-section">
          <span id="icdrive_top" onClick={()=>{dispatch(updateState())}}>IC Drive</span>
        </div>
        <div className="right-section">
          <span><Input placeholder="Search Files" /></span>
          <span><QuestionCircleOutlined style={{ fontSize: '25px' }} /></span>
          <span className="dot"></span>
        </div>
      </div>
    </Style>
  )
}

export default TopBar;

const Style = styled.div`

  .container {
    height: 50px;
    width: 100vw;
    background: #21353E;
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .left-section {
    font-size: 22.5px;
    font-weight: 700;
    padding-left: 22px;
  }
  .right-section{
    width: 420px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
  .dot {
    height: 25px;
    width: 25px;
    background-color: #324851;
    border-radius: 50%;
    display: inline-block;
  }
  #icdrive_top:hover{
    cursor: pointer;
  }
  .icdrive_top{
    
  }

  @media only screen and (min-width: 600px){
    .ant-input {
      height: 25px;
      width: 250px;
    }
  }

  @media only screen and (max-width: 600px){
    .ant-input {
      height: 25px;
      width: 100px;
    }
    .right-section{
      width: 250px;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
    }
  }
`