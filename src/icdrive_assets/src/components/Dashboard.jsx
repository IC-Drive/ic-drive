import React from 'react'
import styled from 'styled-components'

// custom imports
import Profile from './Profile'
import TopBar from './TopBar/TopBar.jsx'
import SideBar from './SideBar/SideBar.jsx'
import { canisterHttpAgent } from '../httpAgent'
import CenterPortion from './CenterPortion/CenterPortion.jsx'

// 3rd party imports
import { useDispatch, useSelector } from 'react-redux'
import { filesUpdate, sharedUpdate, refreshFiles } from '../state/actions'

const Dashboard = () =>{

  const refresh_files = useSelector(state=>state.FileHandler.refresh_files);
  const optionSelected = useSelector(state=>state.OptionSelected.option);
  const sidebar = useSelector(state=>state.SideBarShow.state);
  const dispatch = useDispatch();

  React.useEffect(async () => {
    dispatch(refreshFiles(false))
    const userAgent = await canisterHttpAgent()
    const file_list = await userAgent.getFiles()
    console.log("here")
    let files = []
    let sharedFiles = []
    if(file_list.length>0){
      for(let i=0; i<file_list[0].length; i++){
        file_list[0][i]["chunkCount"] = file_list[0][i]["chunkCount"]
        let temp = new Date(parseInt(Number(file_list[0][i]["createdAt"]).toString().slice(0, -6)))
        file_list[0][i]["createdAt"] = temp.getDate() + "-" + (temp.getMonth()+1) + "-" + temp.getFullYear()
        if(localStorage.getItem("userName")===file_list[0][i]["userName"]){
          files.push(file_list[0][i])
        } else{
          sharedFiles.push(file_list[0][i])
        }
      }
      console.log(files)
      dispatch(filesUpdate(files))
      dispatch(sharedUpdate(sharedFiles))
    }
  }, [refresh_files])

  return(
    <Style>
      <TopBar />
      {
        optionSelected==="profile"?
        <div>
          <div className="side-center">
            <SideBar />
            <Profile/>
          </div>
          <div className="side-center-mobile">
            {
              sidebar?
              <SideBar />
              :
              <Profile/>
            }
          </div>
        </div>
        :
        <div>
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
        </div>
      }
    </Style>
  )
}

export default Dashboard;

const Style = styled.div`
  font-style: sans-serif;
    
  @media only screen and (max-width: 600px){
    .side-center{
      display: none;
    }
    .side-center-mobile{
      display: block;
    }
  }
  @media only screen and (min-width: 600px){
    .side-center{
      display: flex;
    }
    .side-center-mobile{
      display: none;
    }
  }
`