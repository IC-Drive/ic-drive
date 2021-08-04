import React from 'react';

// 3rd party imports
import { message, Button, Input } from 'antd';
//import { httpAgent, httpAgentIdentity } from '../../httpAgent';
import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';

// custom imports
import Dashboard from '../Dashboard';
import '../../../assets/css/Profile.css';
//import { idlFactory as FileHandleIdl } from 'dfx-generated/FileHandle/FileHandle.did.js';
import { icdrive } from "../../../../declarations/icdrive";
import { createActor } from "../../../../declarations/FileHandle";

const Profile = () => {
  const [dashboardFlag, setDashboardFlag] = React.useState(false);
  const [userNameFlag, setUserNameFlag] = React.useState(false);
  const [emailFlag, setEmailFlag] = React.useState(false);
  const [emailId, setEmailId] = React.useState('');
  const [loadingFlag, setLoadingFlag] = React.useState(false);
  const userName = React.useRef('');
  const userEmail = React.useRef('');

  const createCanister = async () => {
    setLoadingFlag(true);
    if (userName.current.state.value === '') {
      message.error('Enter User Name');
      setLoadingFlag(false);
    } else {
      const checkName = await icdrive.checkUserName(userName.current.state.value);
      if (!checkName) {
        const create = await icdrive.createProfile(userName.current.state.value, emailId);
        if (create.length === 1) {
          localStorage.setItem('userName', userName.current.state.value);
          localStorage.setItem('fileCanister', create[0].toText());
          setUserNameFlag(false);
          setLoadingFlag(false);
          setDashboardFlag(true);
        } else {
          message.error('Cant access using this Email!');
          setLoadingFlag(false);
        }
      } else {
        message.error('Username Already Taken');
        setLoadingFlag(false);
      }
    }
  };

  const checkEmail = () =>{
    setEmailId(userEmail.current.state.value)
    setEmailFlag(false);
    userEmail.current.state.value = '';
    setUserNameFlag(true);
  }

  React.useEffect(() => {
    const createGetProfile = async () => {
      const profile = await icdrive.getProfile();
      // Check if user already exist else create his canister
      if (profile.length === 0) {
        setEmailFlag(true);
        //setUserNameFlag(true);
      } else {
        if(profile[0].updateCanister){
          //Update canister
          const authClient = await AuthClient.create();
          const identity = await authClient.getIdentity();
          const identityAgent = new HttpAgent({ identity });

          const agent = createActor(localStorage.getItem('fileCanister'));
          const wasm_file = await fetch("./FileHandle.wasm");
          const buffer = await wasm_file.arrayBuffer();
          const buffToArray = new Uint8Array(buffer);
          
          await Actor.install({mode: "upgrade", module: buffToArray }, {agent: identityAgent, canisterId: profile[0].fileCanister.toText()});
          agent = createActor(localStorage.getItem('fileCanister'));
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
          : emailFlag
            ? (
              <div className="innercontainer">
                <div className="waiting">
                  <div style={{ paddingTop: '20%' }}>
                    <span id="username">
                      Your Email:&nbsp;
                      <Input style={{ width: '80% !important' }} ref={userEmail} />
                    </span>
                    <br />
                    <br />
                    <Button type="primary" onClick={checkEmail}>Check Access</Button>
                  </div>
                </div>
              </div>
            ) : userNameFlag
                ? (
                  <div className="innercontainer">
                    <div className="waiting">
                      <div style={{ paddingTop: '20%' }}>
                        <span id="username">
                          Create Username:&nbsp;
                          <Input style={{ width: '80% !important' }} ref={userName} />
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
                    <div className="waiting">
                      <p id="text" style={{ paddingTop: '20%' }}>Updating...</p>
                    </div>
                  </div>
                )
      }
    </div>
  );
};

export default Profile;
