import React from "react";
import styled from 'styled-components';

// custom imports

// 3rd party imports
import {useDispatch, useSelector} from 'react-redux';

const Profile = () =>{

  React.useEffect(() => {

  }, [])

  return(
    <Style>
      <div className="profile-block">
        <div className="details">
          <table>
            <tr>
              <td>username:&nbsp;&nbsp;&nbsp;abcdrd</td>
            </tr>
            <tr>
              <td>cycles:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1000000000000</td>
            </tr>
          </table>
        </div>
      </div>
    </Style>
  )
}

export default Profile;

const Style = styled.div`
  font-style: sans-serif;
  .profile-block{
    height: 150px;
    width: 300px;
    margin-top: calc(50vh - 50px - 75px);
    margin-left: calc(50vw - 225px - 150px);
    background: #324851;
    border-radius: 20px;
  }
  .details{
    padding-left: 40px;
    padding-top: 40px;
    font-size: 18px;
    color: #fff;
  }
`