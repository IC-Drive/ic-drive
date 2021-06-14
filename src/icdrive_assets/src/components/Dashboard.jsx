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
import {useDispatch,useSelector} from 'react-redux';
import {filesUpdate,refreshFiles} from '../state/actions';

const Dashboard = () =>{

  const refresh_files = useSelector(state=>state.FileHandler.refresh_files);
  const dispatch = useDispatch();

  React.useEffect(async () => {
    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();
    const agent = new HttpAgent({ identity });
    const icdrive = Actor.createActor(icdrive_idl, { agent, canisterId: icdrive_id });

    console.log("dashboard")
    const get_files = async() =>{
      const file_list = await icdrive.getFiles()
      for(let i=0; i<file_list[0].length; i++){
        file_list[0][i]["chunkCount"] = file_list[0][i]["chunkCount"].toString()
        let temp = new Date(parseInt(Number(file_list[0][i]["createdAt"]).toString().slice(0, -6)))
        file_list[0][i]["createdAt"] = temp.getDate() + "-" + (temp.getMonth()+1) + "-" + temp.getFullYear()
      }
      dispatch(filesUpdate(file_list[0]))
      dispatch(refreshFiles(false))
    }
    get_files();
  }, [refresh_files])

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