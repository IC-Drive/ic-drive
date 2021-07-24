import React from 'react';
import styled from 'styled-components';

// custom imports
import { useDispatch, useSelector } from 'react-redux';
import Profile from './Profile';
import TopBar from './TopBar/TopBar';
import SideBar from './SideBar/SideBar';
import { canisterHttpAgent } from '../httpAgent';
import CenterPortion from './CenterPortion/CenterPortion';

// 3rd party imports
import { filesUpdate, sharedUpdate, refreshFiles } from '../state/actions';

const Dashboard = () => {
  const refreshFilesData = useSelector((state) => state.FileHandler.refreshFiles);
  const optionSelected = useSelector((state) => state.OptionSelected.option);
  const sidebar = useSelector((state) => state.SideBarShow.state);
  const dispatch = useDispatch();

  React.useEffect(async () => {
    dispatch(refreshFiles(false));
    const userAgent = await canisterHttpAgent();
    const fileList = await userAgent.getFiles();

    const files = [];
    const sharedFiles = [];
    if (fileList.length > 0) {
      for (let i = 0; i < fileList[0].length; i += 1) {
        const dateNumber = Number(fileList[0][i].createdAt);
        const temp = new Date(parseInt(dateNumber.toString().slice(0, -6), 10));
        fileList[0][i].createdAt = `${temp.getDate()}-${temp.getMonth() + 1}-${temp.getFullYear()}`;
        if (localStorage.getItem('userName') === fileList[0][i].userName) {
          files.push(fileList[0][i]);
        } else {
          sharedFiles.push(fileList[0][i]);
        }
      }
      console.log(files);
      dispatch(filesUpdate(files));
      dispatch(sharedUpdate(sharedFiles));
    }
  }, [refreshFilesData]);

  return (
    <Style>
      <TopBar />
      {
        optionSelected === 'profile' ? (
          <div>
            <div className="side-center">
              <SideBar />
              <Profile />
            </div>
            <div className="side-center-mobile">
              {
              sidebar
                ? <SideBar />
                : <Profile />
            }
            </div>
          </div>
        )
          : (
            <div>
              <div className="side-center">
                <SideBar />
                <CenterPortion />
              </div>
              <div className="side-center-mobile">
                {
              sidebar
                ? <SideBar />
                : <CenterPortion />
            }
              </div>
            </div>
          )
      }
    </Style>
  );
};

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
`;
