import React from 'react';
import styled from 'styled-components';

// custom imports
import { canisterHttpAgent } from '../httpAgent';

// 3rd party imports

const ProfilePage = () => {

  const [cycles, setCycles] = React.useState(0)

  React.useEffect(() => {
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
