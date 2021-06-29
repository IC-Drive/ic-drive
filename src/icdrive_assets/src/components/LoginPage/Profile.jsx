import React from "react";
import styled from 'styled-components';

// custom imports
import Dashboard from '../Dashboard';

// 3rd party imports
import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from "@dfinity/auth-client";
import { idlFactory as icdrive_idl, canisterId as icdrive_id } from 'dfx-generated/icdrive';
import { Spin } from 'antd';

const Profile = () =>{

  const [dashboardFlag, setDashboardFlag] = React.useState(false)

  React.useEffect(async () => {
    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();
    const agent = new HttpAgent({ identity });
    const icdrive = Actor.createActor(icdrive_idl, { agent, canisterId: icdrive_id });

    let profile = await icdrive.getProfile()

    if(profile.length===0){
      const response = await fetch("./icdrive.wasm");
      const buffer = await response.arrayBuffer();
      const buffToArray = new Uint8Array(buffer)
      const installCanister = await Actor.createAndInstallCanister(icdrive_idl, { module: buffToArray }, {agent: agent});
      console.log(installCanister)
      const userCanisterId = Actor.canisterIdOf(installCanister).toText()
      localStorage.setItem('userCanisterId', userCanisterId)
      await icdrive.createProfile(parseInt(localStorage.getItem('userNumber')), userCanisterId)
      console.log(await installCanister.getOwnId())
      setDashboardFlag(true)
    }
    else{
      localStorage.setItem('userCanisterId', profile[0]["userCanisterId"])
      const userAgent = Actor.createActor(icdrive_idl, { agent, canisterId: profile[0]["userCanisterId"] });
      console.log(await userAgent.getOwnId())
      setDashboardFlag(true)
    }
  }, [])

  return(
    <Style>
      {
        dashboardFlag?
        <Dashboard />
        :
        <div className="waiting">
          <Spin size="large"/>
          <p id="text">Loading</p>
        </div>
      }
    </Style>
  );
}

export default Profile;

const Style = styled.div`
  .waiting{
    text-align: center;
    margin-top: 40vh;
  }
  #text{
    font-size: 24px;
    font-weight: 500;
  }
`