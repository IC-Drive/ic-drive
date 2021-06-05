import React from "react";
import styled from 'styled-components';

// custom imports

// 3rd party imports
import { HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";

const Dashboard = () =>{

  const [authClient, setAuthClient] = React.useState()

  async function handleAuthenticated(authClient) {
    const identity = await authClient.getIdentity();
    console.log(identity)
    const agent = new HttpAgent({ identity });
    console.log(agent);
  }
  
  React.useEffect(async ()=>{
    const authClient_t = await AuthClient.create();
    setAuthClient(authClient_t)
    if (await authClient.isAuthenticated()) {
      handleAuthenticated(authClient);
    }
  },[])

  const handleLogin = async () => {
    await authClient.login({
      onSuccess: async () => {
        handleAuthenticated(authClient);
      },
      identityProvider: "http://localhost:8000/?canisterId=rwlgt-iiaaa-aaaaa-aaaaa-cai"
    })
  };

  return(
    <Style>
      <button onClick={handleLogin}>Login</button>
    </Style>
  )
}

export default Dashboard;

const Style = styled.div`
  
`