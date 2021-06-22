import React from "react";
import styled from 'styled-components';

// custom imports
import TopBar from './TopBar/TopBar.jsx';
import SideBar from './SideBar/SideBar.jsx';
import CenterPortion from './CenterPortion/CenterPortion.jsx'
import {httpAgent} from '../httpAgent'

// 3rd party imports
import {useDispatch,useSelector} from 'react-redux';
import {filesUpdate,refreshFiles} from '../state/actions';

const Dashboard = () =>{

  const refresh_files = useSelector(state=>state.FileHandler.refresh_files);
  const dispatch = useDispatch();

  React.useEffect(async () => {
    const icdrive = await httpAgent()
    let profile = await icdrive.getProfile()
    if(profile.length===0){
      icdrive.createProfile(parseInt(localStorage.getItem('userNumber')))
    }
  }, [])

  React.useEffect(async () => {
    dispatch(refreshFiles(false))
    const icdrive = await httpAgent()
    const file_list = await icdrive.getFiles()
    console.log("list")
    console.log(file_list)
    if(file_list.length>0){
      for(let i=0; i<file_list[0].length; i++){
        file_list[0][i]["chunkCount"] = file_list[0][i]["chunkCount"].toString()
        let temp = new Date(parseInt(Number(file_list[0][i]["createdAt"]).toString().slice(0, -6)))
        file_list[0][i]["createdAt"] = temp.getDate() + "-" + (temp.getMonth()+1) + "-" + temp.getFullYear()
      }
      dispatch(filesUpdate(file_list[0]))
    }
    console.log("over")
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