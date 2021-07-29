import React from 'react';
import styled from 'styled-components';

// custom imports
import {bytesToSize} from './CenterPortion/Methods';
import { canisterHttpAgent } from '../httpAgent';

// 3rd party imports
import { useSelector } from 'react-redux';

const ProfilePage = () => {

  const [cycles, setCycles] = React.useState(0)
  const [storage, setStorage] = React.useState(0)
  const files = useSelector((state) => state.FileHandler.files);

  React.useEffect(() => {
    let size = 0
    for (let i = 0; i < files.length; i += 1) {
      size = size + Number(files[i].fileSize)
    }

    setStorage(bytesToSize(size))
    const getBalance = async()=>{
      let userAgent = await canisterHttpAgent()
      let userCycles = await userAgent.getCycles()
      setCycles(Number(userCycles))
    }
    getBalance()
  }, []);

  return (
    <Style>
      <div className="profile-block">
        <div className="details">
          <table>
            <tr>
              <td>username:&nbsp;&nbsp;&nbsp;{localStorage.getItem("userName")}</td>
            </tr>
            <tr>
              <td>cycles:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{cycles}</td>
            </tr>
            <tr>
              <td>storage:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{storage} / 4 GB</td>
            </tr>
          </table>
        </div>
      </div>
    </Style>
  );
};

export default ProfilePage;

const Style = styled.div`
  font-style: sans-serif;
  
  .details{
    padding-left: 40px;
    padding-top: 40px;
    font-size: 18px;
    color: #fff;
  }
  @media only screen and (max-width: 600px){
    .profile-block{
      height: 150px;
      width: 300px;
      margin-top: calc(50vh - 50px - 75px);
      margin-left: calc(50vw - 150px);
      background: #324851;
      border-radius: 20px;
    }
    
  }
  @media only screen and (min-width: 600px){
    .profile-block{
      height: 150px;
      width: 300px;
      margin-top: calc(50vh - 50px - 75px);
      margin-left: calc(50vw - 225px - 150px);
      background: #324851;
      border-radius: 20px;
    }
  }
`;
