import React from 'react';

// 3rd party imports
import { message, Button, Input } from 'antd';
import { httpAgent, httpAgentIdentity } from '../../httpAgent';
import { Actor } from '@dfinity/agent';

// custom imports
import Dashboard from '../Dashboard';
import '../../../assets/css/Profile.css';
import { idlFactory as FileHandleIdl } from 'dfx-generated/FileHandle';

const Profile = () => {
  const [dashboardFlag, setDashboardFlag] = React.useState(false);
  const [userNameFlag, setUserNameFlag] = React.useState(false);
  const [loadingFlag, setLoadingFlag] = React.useState(false);
  const userName = React.useRef('');
  const hisName = React.useRef('');
  const userEmail = React.useRef('');

  const createCanister = async () => {
    setLoadingFlag(true);
    if (userName.current.state.value === '') {
      message.error('Enter User Name');
      setLoadingFlag(false);
    } else {
      const icdrive = await httpAgent();
      const checkName = await icdrive.checkUserName(userName.current.state.value);
      if (!checkName) {
        const create = await icdrive.createProfile(userName.current.state.value, userEmail.current.state.value, hisName.current.state.value);
        if (create.length === 1) {
          localStorage.setItem('userName', userName.current.state.value);
          localStorage.setItem('fileCanister', create[0].toText());
          setUserNameFlag(false);
          setLoadingFlag(false);
          setDashboardFlag(true);
        } else {
          message.error('Something Went Wrong!');
          setLoadingFlag(false);
        }
      } else {
        message.error('Username Already Taken');
        setLoadingFlag(false);
      }
    }
  };

  React.useEffect(() => {
    const createGetProfile = async () => {
      const icdrive = await httpAgent();
      const profile = await icdrive.getProfile();
      //console.log(profile)
      // Check if user already exist else create his canister
      if (profile.length === 0) {
        setUserNameFlag(true);
      } else {
        if(profile[0].updateCanister){
          const agent = await httpAgentIdentity();
          const wasm_file = await fetch("./FileHandle.wasm");
          const buffer = await wasm_file.arrayBuffer();
          const buffToArray = new Uint8Array(buffer);
          await Actor.install({mode: "upgrade", module: buffToArray }, {agent: agent, canisterId: profile[0].fileCanister.toText()});
          await Actor.createActor(FileHandleIdl, {agent: agent, canisterId: profile[0].fileCanister.toText()});
          await icdrive.updateDone();
          localStorage.setItem('userName', profile[0].userName);
          localStorage.setItem('fileCanister', profile[0].fileCanister.toText());
          setDashboardFlag(true);
        } else{
          localStorage.setItem('userName', profile[0].userName);
          localStorage.setItem('fileCanister', profile[0].fileCanister.toText());
          setDashboardFlag(true);
        }
      }
    };
    createGetProfile();
  }, []);

  return (
    <div className="profile-container">
      {
        dashboardFlag
          ? <Dashboard />
          : userNameFlag
                ? (
                  <div className="innercontainer">
                    <div className="waiting">
                      <div style={{ paddingTop: '20%' }}>
                        <span id="username">
                          Name:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          <Input style={{ width: '50% !important' }} ref={hisName} />
                        </span>
                        <br/>
                        <span id="username">
                          Email:&nbsp;&nbsp;&nbsp;&nbsp;
                          <Input style={{ width: '50% !important' }} ref={userEmail} />
                        </span>
                        <br/>
                        <span id="username">
                          Username:&nbsp;
                          <Input style={{ width: '50% !important' }} ref={userName} />
                        </span>
                        <br />
                        <br />
                        <Button type="primary" loading={loadingFlag} onClick={createCanister}>Continue</Button>
                      </div>
                    </div>
                  </div>
                )
                : (
                  <div className="innercontainer">
                    <div className="waiting-update">
                      <p id="text" style={{ paddingTop: '20%' }}>Updating...</p>
                    </div>
                  </div>
                )
      }
    </div>
  );
};

export default Profile;
