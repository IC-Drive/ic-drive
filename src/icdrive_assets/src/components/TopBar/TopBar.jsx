import React from 'react';

// custom imports
import '../../../assets/css/TopBar.css';

// 3rd party imports
import { useDispatch, useSelector } from 'react-redux';
import {
  Input, Dropdown, Menu, Modal,
} from 'antd';
import { AuthClient } from '@dfinity/auth-client';
import { QuestionCircleOutlined, MenuOutlined } from '@ant-design/icons';
import { SideBarShow, switchProfile } from '../../state/actions';

const TopBar = () => {
  const dispatch = useDispatch();
  const sideBarShow = useSelector((state) => state.SideBarShow.state);
  const [helpModal, setHelpModal] = React.useState(false);

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <span role="button" tabIndex={0} onClick={() => { dispatch(switchProfile('profile')); }}>Profile</span>
      </Menu.Item>
      <Menu.Item key="1">
        <span role="button" tabIndex={0} onClick={async () => { const authClient = await AuthClient.create(); await authClient.logout(); window.location.reload(); }}>Logout</span>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="top-bar-container">
      <div className="top-bar-left-section">
        <div className="slide-menu-mobile">
          <div>
            <MenuOutlined onClick={() => { dispatch(SideBarShow(!sideBarShow)); }} style={{ fontSize: '22.5px', color: '#fff' }} />
&nbsp;&nbsp;
          </div>
        </div>
        <div id="top-bar-icdrive">IC Drive</div>
      </div>
      <div className="top-bar-right-section">
        <span id="ant-input-span"><Input placeholder="Search Files" /></span>
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
          Please share your feedback at:
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
