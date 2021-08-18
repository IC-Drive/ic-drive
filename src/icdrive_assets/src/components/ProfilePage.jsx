import React from 'react';
import styled from 'styled-components';

// custom imports
import { useSelector } from 'react-redux';
import { bytesToSize } from './CenterPortion/Methods';
import { canisterHttpAgent } from '../httpAgent';

// 3rd party imports

const ProfilePage = () => {
  const [cycles, setCycles] = React.useState(0);
  const [storage, setStorage] = React.useState(0);
  const files = useSelector((state) => state.FileHandler.files);

  React.useEffect(() => {
    let size = 0;
    for (let i = 0; i < files.length; i += 1) {
      size += Number(files[i].fileSize);
    }

    setStorage(bytesToSize(size));
    const getBalance = async () => {
      const userAgent = await canisterHttpAgent();
      const userCycles = await userAgent.getCycles();
      setCycles(Number(userCycles));
    };
    getBalance();
  }, []);

  return (
    <Style>
      <div className="profile-page-container">
        <div className="profile-block">
          <div className="details">
            <table>
              <tr>
                <td>
                  username:&nbsp;&nbsp;&nbsp;
                  {localStorage.getItem('userName')}
                </td>
              </tr>
              <tr>
                <td>
                  cycles:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {cycles}
                </td>
              </tr>
              <tr>
                <td>
                  storage:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {storage}
                  {' '}
                  / 4 GB
                </td>
              </tr>
              <tr>
                <td>
                  Canister ID:&nbsp;&nbsp;&nbsp;&nbsp;
                  {localStorage.getItem('fileCanister')}
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </Style>
  );
};

export default ProfilePage;

const Style = styled.div`
  font-style: sans-serif;
  .profile-page-container{
    width: calc(100vw - 225px);
    height: calc(100vh - 72px);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .details{
    padding-left: 40px;
    padding-top: 40px;
    font-size: 18px;
    color: #fff;
  }
  @media only screen and (max-width: 600px){
    .profile-page-container{
      width: 100vw;
    }
    .profile-block{
      height: 200px;
      width: 350px;
      background: #324851;
      border-radius: 20px;
    }
  }
  @media only screen and (min-width: 600px){
    .profile-block{
      height: 200px;
      width: 420px;
      background: #324851;
      border-radius: 20px;
    }
  }
`;
