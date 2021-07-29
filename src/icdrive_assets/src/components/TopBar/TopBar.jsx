import React from 'react';

// custom imports
import '../../../assets/css/TopBar.css';
import { SideBarShow, switchProfile, switchSearch, searchedFile } from '../../state/actions';

// 3rd party imports
import { useDispatch, useSelector } from 'react-redux';
import {
  AutoComplete, Dropdown, Menu, Modal,
} from 'antd';
import { AuthClient } from '@dfinity/auth-client';
import { QuestionCircleOutlined, MenuOutlined } from '@ant-design/icons';

const TopBar = () => {
  const dispatch = useDispatch();
  const sideBarShow = useSelector((state) => state.SideBarShow.sideBar);
  const files = useSelector((state) => state.FileHandler.files);
  const [helpModal, setHelpModal] = React.useState(false);

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

  const [value, setValue] = React.useState('');
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
          <span className="dot" />
        </Dropdown>
      </div>
      <Modal
        visible={helpModal}
        onCancel={() => setHelpModal(false)}
        footer={null}
        title={null}
      >
        <span className="help-modal">
          <strong>Please share your feedback at:</strong>
          <br />
          nanditmehra123@gmail.com
          <br />
          ravish1729@gmail.com
        </span>
      </Modal>
    </div>
  );
};

export default TopBar;
