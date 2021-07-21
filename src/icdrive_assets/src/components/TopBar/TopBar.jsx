import React from 'react'
import styled from 'styled-components'

// custom imports
import {updateState} from '../../state/actions'
import {switchHome, switchProfile} from '../../state/actions'

// 3rd party imports
import {useDispatch} from 'react-redux'
import {Input, Dropdown, Menu, Modal} from 'antd'
import { AuthClient } from '@dfinity/auth-client'
import { QuestionCircleOutlined } from '@ant-design/icons'

const TopBar = () =>{

  const dispatch = useDispatch();
  const [helpModal, setHelpModal] = React.useState(false)

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <span onClick={()=>{dispatch(switchProfile("profile"))}}>Profile</span>
      </Menu.Item>
      <Menu.Item key="1">
        <span onClick={async()=>{const authClient = await AuthClient.create();await authClient.logout();window.location.reload();}}>Logout</span>
      </Menu.Item>
    </Menu>
  );
  
  return(
    <Style>
      <div className="container">
        <div className="left-section">
          <span id="icdrive_top" onClick={()=>{dispatch(switchHome("home"));dispatch(updateState())}}>IC Drive</span>
        </div>
        <div className="right-section">
          <span><Input placeholder="Search Files" /></span>
          <span><QuestionCircleOutlined onClick={()=>setHelpModal(true)} style={{ fontSize: '25px' }} /></span>
          <Dropdown overlay={menu}>
            <span className="dot"></span>
          </Dropdown>
        </div>
      </div>
      <Modal
        visible={helpModal}
        onCancel={()=>setHelpModal(false)}
        footer={null}
        title={null}
      >
        <span className="help-modal">
          Please share your feedback at:<br/>
          nanditmehra123@gmail.com<br/>
          ravish1729@gmail.com
        </span>
      </Modal>
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