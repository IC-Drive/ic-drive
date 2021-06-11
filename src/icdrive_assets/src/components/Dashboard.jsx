import React from "react";
import styled from 'styled-components';

// custom imports
import TopBar from './TopBar/TopBar.jsx';
import SideBar from './SideBar/SideBar.jsx';
import CenterPortion from './CenterPortion/CenterPortion.jsx'

// 3rd party imports
import { idlFactory as icdrive_idl, canisterId as icdrive_id } from 'dfx-generated/icdrive';
import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from "@dfinity/auth-client";
import {useDispatch} from 'react-redux';
import {filesUpdate} from '../state/actions';

const Dashboard = () =>{

  const dispatch = useDispatch();

  React.useEffect(async () => {
    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();
    console.log("identity")
    console.log({identity})
    const agent = new HttpAgent({ identity });
    const icdrive = Actor.createActor(icdrive_idl, { agent, canisterId: icdrive_id });

    const get_files = async() =>{
      const file_list = await icdrive.getFiles()
      dispatch(filesUpdate(file_list[0]))
    }
    get_files();
  }, [])

  return(
    <Style>
      <TopBar />
      <div className="side-center">
        <SideBar />
        <CenterPortion/>
      </div>
    </Style>
  )
}

export default Dashboard;

const Style = styled.div`
  font-style: sans-serif;
  .side-center{
    display: flex;
  }
`