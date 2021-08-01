import React from 'react';

// 3rd party imports
import { useDispatch, useSelector } from 'react-redux';
import { filesUpdate, sharedUpdate, refreshFiles } from '../state/actions';

// custom imports
import TopBar from './TopBar/TopBar';
import ProfilePage from './ProfilePage';
import SideBar from './SideBar/SideBar';
import '../../assets/css/Dashboard.css';
import { canisterHttpAgent } from '../httpAgent';
import CenterPortion from './CenterPortion/CenterPortion';

const Dashboard = () => {
  const refreshFilesData = useSelector((state) => state.FileHandler.refreshFiles);
  const optionSelected = useSelector((state) => state.OptionSelected.option);
  const sideBarShow = useSelector((state) => state.SideBarShow.sideBar);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(refreshFiles(false));
    const fileJSON = async () => {
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
        dispatch(filesUpdate(files));
        dispatch(sharedUpdate(sharedFiles));
      }
    };
    fileJSON();
  }, [refreshFilesData]);

  return (
    <div className="dashboard-div">
      <TopBar />
      {
        optionSelected === 'profile' ? (
          <div>
            <div className="dashboard-side-center">
              <SideBar />
              <ProfilePage />
            </div>
            <div className="dashboard-side-center-mobile">
              {
              sideBarShow
                ? (
                  <div>
                    <SideBar />
                    <ProfilePage />
                  </div>
                )
                : <ProfilePage />
            }
            </div>
          </div>
        )
          : (
            <div>
              <div className="dashboard-side-center">
                <SideBar />
                <CenterPortion />
              </div>
              <div className="dashboard-side-center-mobile">
                {
              sideBarShow
                ? (
                  <div>
                    <SideBar />
                    <CenterPortion />
                  </div>
                )
                : <CenterPortion />
            }
              </div>
            </div>
          )
      }
    </div>
  );
};

export default Dashboard;
