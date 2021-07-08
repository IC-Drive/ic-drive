import React from 'react'
import styled from 'styled-components'

// custom imports
import TopBar from './TopBar/TopBar.jsx'
import SideBar from './SideBar/SideBar.jsx'
import { canisterHttpAgent } from '../httpAgent'
import CenterPortion from './CenterPortion/CenterPortion.jsx'

// 3rd party imports
import { useDispatch, useSelector } from 'react-redux'
import { filesUpdate, sharedUpdate, refreshFiles } from '../state/actions'

const Dashboard = () =>{

  const refresh_files = useSelector(state=>state.FileHandler.refresh_files);
  const sidebar = useSelector(state=>state.SideBarShow.state);
  const dispatch = useDispatch();

  React.useEffect(async () => {
    dispatch(refreshFiles(false))
    const userAgent = await canisterHttpAgent()
    const file_list = await userAgent.getFiles()
    console.log("dash")
    let files = []
    let sharedFiles = []
    if(file_list.length>0){
      for(let i=0; i<file_list[0].length; i++){
        file_list[0][i]["chunkCount"] = file_list[0][i]["chunkCount"]
        let temp = new Date(parseInt(Number(file_list[0][i]["createdAt"]).toString().slice(0, -6)))
        file_list[0][i]["createdAt"] = temp.getDate() + "-" + (temp.getMonth()+1) + "-" + temp.getFullYear()
        console.log(localStorage.getItem("userNumber"), file_list[0][i]["userNumber"])
        if(localStorage.getItem("userNumber")===file_list[0][i]["userNumber"].toString()){
          files.push(file_list[0][i])
        } else{
          sharedFiles.push(file_list[0][i])
        }
      }
      dispatch(filesUpdate(files))
      dispatch(sharedUpdate(sharedFiles))
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
      <div className="side-center-mobile">
        {
          sidebar?
          <SideBar />
          :
          <CenterPortion/>
        }
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
  .side-center-mobile{
    display: none;
  }
  @media only screen and (max-width: 600px){
    .side-center{
      display: none;
    }
    .side-center-mobile{
      display: block;
    }
  }
`