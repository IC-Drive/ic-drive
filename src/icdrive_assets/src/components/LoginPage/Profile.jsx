import React from 'react'
import styled from 'styled-components'

// custom imports
import Dashboard from '../Dashboard'
import { httpAgent } from '../../httpAgent'

// 3rd party imports
import { message, Button, Input } from 'antd'

const Profile = () =>{

  const [dashboardFlag, setDashboardFlag] = React.useState(false)
  const [userNameFlag, setUserNameFlag] = React.useState(false)
  const [loadingFlag, setLoadingFlag] = React.useState(false)
  const userName = React.useRef("")

  const createCanister = async() =>{
    setLoadingFlag(true)
    if(userName.current.state.value===""){
      //message.error("Enter User Name")
      message.error("App will be open to public soon!!!")
      setLoadingFlag(false)
    } else{
      const icdrive = await httpAgent()
      let check_name = await icdrive.checkUserName(userName.current.state.value)
      //console.log(check_name)
      if(!check_name){
        let create = await icdrive.createProfile(userName.current.state.value)
        if(create.length===1){
          localStorage.setItem("userName", userName.current.state.value)
          localStorage.setItem("fileCanister", create[0].toText())
          setUserNameFlag(false)
          setLoadingFlag(false)
          setDashboardFlag(true)
        } else{
          message.error("Something Went Wrong!")
          setLoadingFlag(false)
        }
      } else{
        message.error("Username Already Taken")
        setLoadingFlag(false)
      }
    }
  }

  React.useEffect(async () => {
    const icdrive = await httpAgent()
    let profile = await icdrive.getProfile()

    //Check if user already exist else create his canister
    if(profile.length===0){
      setUserNameFlag(true)
    } else{
      //console.log(profile[0])
      localStorage.setItem("userName", profile[0]["userName"])
      localStorage.setItem("fileCanister", profile[0]["fileCanister"].toText())
      setDashboardFlag(true)
    }
  }, [])

  return(
    <Style>
      <div className="profile-container">
        {
          dashboardFlag?
          <Dashboard />
          :
          userNameFlag?
          <div className="innercontainer">
            <div className="waiting">
              <div style={{paddingTop:"20%"}}>
                <span id="username">Create Username:&nbsp;<Input style={{width:"80%"}} ref={userName} /></span>
                <br/><br/>
                <Button type="primary" loading={loadingFlag} onClick={createCanister}>Continue</Button>
              </div>
            </div>
          </div>
          :
          <div className="innercontainer">
            <div className="waiting">
              <p id="text">Loading...</p>
            </div>
          </div>
        }
      </div>
    </Style>
  );
}

export default Profile;

const Style = styled.div`
  overflow: hidden;
  .profile-container{
    height: 100vh;
    width: 100vw;
  }
  .innercontainer{
    margin-top: calc(50vh - 100px);
    margin-left: calc(50vw - 125px);
  }
  .waiting{
    height: 200px;
    width: 250px;
    border-radius: 10px;
    background: #324851;
    text-align: center;
    color: #fff;
  }
  #text{
    font-size: 24px;
    font-weight: 500;
  }
  #username{
    font-size: 18px;
    font-weight: 500;
  }
`