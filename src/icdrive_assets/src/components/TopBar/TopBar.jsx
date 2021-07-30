import React from 'react';

// custom imports
import '../../../assets/css/TopBar.css';
import { SideBarShow, switchProfile, switchSearch, searchedFile } from '../../state/actions';
import {sendFeedback} from '../../components/CenterPortion/Methods'

// 3rd party imports
import { useDispatch, useSelector } from 'react-redux';
import {
  AutoComplete, Dropdown, Menu, Modal, Input, Button, message
} from 'antd';
import { AuthClient } from '@dfinity/auth-client';
import { QuestionCircleOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons';

const TopBar = () => {
  const dispatch = useDispatch();
  const { TextArea } = Input;
  const feedback = React.useRef('');
  const sideBarShow = useSelector((state) => state.SideBarShow.sideBar);
  const files = useSelector((state) => state.FileHandler.files);
  const [helpModal, setHelpModal] = React.useState(false);
  const [loadingFlag, setLoadingFlag] = React.useState(false);

  const menu = (
    <Menu>
      <Menu.Item key="0" onClick={() => { dispatch(switchProfile('profile')); }}>
        <span role="button" tabIndex={0}>Profile</span>
      </Menu.Item>
      <Menu.Item key="1" onClick={async () => { const authClient = await AuthClient.create(); await authClient.logout(); window.location.reload(); }}>
        <span role="button" tabIndex={0}>Logout</span>
      </Menu.Item>
    </Menu>
  );

  const [options, setOptions] = React.useState([]);

  const searchFile = (str) => {
    str = str.toLowerCase();
    let temp = []
    for(let i=0; i<files.length; i+=1){
      if(files[i].name.toLowerCase().indexOf(str)>-1){
        temp.push({value: files[i].name, id: files[i].id})
      }
      if(temp.length>5){
        break
      }
    }
    return(temp)
  }

  const sendFeed = async() =>{
    setLoadingFlag(true)
    console.log(feedback.current.resizableTextArea.props.value)
    await sendFeedback(feedback.current.resizableTextArea.props.value)
    message.info("Thank you for the feedback !")
    setHelpModal(false)
    setLoadingFlag(false)
  }

  const onSearch = (searchText) => {
    setOptions(
      !searchText ? [] : searchFile(searchText),
    );
  };

  const onSelect = (data) => {
    console.log(data);
    dispatch(searchedFile(data));
    dispatch(switchSearch('search'));
  };

  return (
    <div className="top-bar-container">
      <div className="top-bar-left-section">
        <div className="slide-menu-mobile">
          <div>
            <MenuOutlined onClick={() => { dispatch(SideBarShow(!sideBarShow)); }} style={{ fontSize: '20px', color: '#fff' }} />
&nbsp;&nbsp;
          </div>
        </div>
        <div id="top-bar-icdrive">IC Drive</div>
      </div>
      <div className="top-bar-right-section">
        <span id="ant-input-span" style={{ marginRight: '10px' }}><AutoComplete options={options} onSelect={onSelect} onSearch={onSearch} placeholder="Search Files" /></span>
        <span><QuestionCircleOutlined onClick={() => setHelpModal(true)} style={{ fontSize: '25px', marginRight: '10px' }} /></span>
        <Dropdown overlay={menu}>
          <UserOutlined style={{ fontSize: '25px', marginRight: '10px' }} />
        </Dropdown>
      </div>
      <Modal
        visible={helpModal}
        onCancel={() => setHelpModal(false)}
        footer={null}
        title={null}
      >
        <p>Report issues, Provide Feedback or Ideas to Improve</p>
        <span className="help-modal">
          <TextArea
            className="textArea"
            ref={feedback}
            autoSize={{ minRows: 6, maxRows: 6 }}
            style={{minWidth: "100%"}}
          />
        </span>
        <br/><br/>
        <Button type="primary" style={{ float: 'right', marginRight: '10px' }} loading={loadingFlag} onClick={()=>sendFeed()}>Send</Button>
        <br/><br/><br/>
      </Modal>
    </div>
  );
};

export default TopBar;
