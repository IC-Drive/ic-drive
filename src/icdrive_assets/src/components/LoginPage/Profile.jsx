import React from "react";
import styled from 'styled-components';

// custom imports
import Dashboard from '../Dashboard';
import {httpAgent} from '../../httpAgent'

// 3rd party imports
import { Spin, message } from 'antd';

const Profile = () =>{

  const [dashboardFlag, setDashboardFlag] = React.useState(false)

  React.useEffect(async () => {
    const icdrive = await httpAgent()
    let profile = await icdrive.getProfile()

    if(profile.length===0){
      let create = await icdrive.createProfile(parseInt(localStorage.getItem('userNumber')))
      if(create.length===1){
        localStorage.setItem("fileCanister", create[0].toText())
        setDashboardFlag(true)
      } else{
        message.error("Something Went Wrong!!!")
      }
    } else{
      localStorage.setItem("fileCanister", profile[0]["fileCanister"].toText())
      setDashboardFlag(true)
    }
  }, [])

  return(
    <Style>
      {
        dashboardFlag?
        <Dashboard />
        :
        <div className="waiting">
          <Spin size="large"/>
          <p id="text">Loading...</p>
        </div>
      }
    </Style>
  );
}

export default Profile;

const Style = styled.div`
  .waiting{
    text-align: center;
    padding-top: 40vh;
  }
  #text{
    font-size: 24px;
    font-weight: 500;
  }
`