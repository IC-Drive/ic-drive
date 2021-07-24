import React from 'react';
import styled from 'styled-components';

// custom imports

// 3rd party imports
import { AuthClient } from '@dfinity/auth-client';
import { Spin } from 'antd';
import Profile from './Profile';

const Login = () => {
  const [isLogin, setIsLogin] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  async function handleAuthenticated(authClient) {
    await authClient.getIdentity();
    setIsLogin(true);
  }

  React.useEffect(async () => {
    const authClient = await AuthClient.create();
    if (await authClient.isAuthenticated()) {
      handleAuthenticated(authClient);
    }
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    const authClient = await AuthClient.create();
    await authClient.login({
      onSuccess: async () => {
        handleAuthenticated(authClient);
      },
      identityProvider: 'http://localhost:8000/?canisterId=rwlgt-iiaaa-aaaaa-aaaaa-cai',
    });
  };

  return (
    <Style>
      {
        isLogin
          ? <Profile />
          : (
            <div className="loginPage">
              <div className="LHS">
                <div id="content">
                  <div id="ic-title">IC Drive</div>
                  <div id="ic-footer">Secure and Private Decentralized Storage App</div>
                </div>
              </div>
              <div className="RHS">
                {
              loading
                ? (
                  <div className="login-div">
                    <div id="login-button-loading">
                      <Spin />
                    </div>
                  </div>
                )
                : (
                  <div className="login-div" role="button" tabIndex={0} onClick={() => handleLogin()}>
                    <div id="login-button">
                      Login with &nbsp;&nbsp;
                      {' '}
                      <img src="./icons/dfinity.png" alt="dfinity logo" style={{ height: '16px' }} />
                    </div>
                  </div>
                )
            }

              </div>
              <div className="RHS-mobile">
                {
            loading
              ? (
                <div className="block">
                  <div className="top">
                    <p id="ic-title">IC Drive</p>
                    <p id="ic-footer">Secure and Private Decentralized Storage App</p>
                  </div>
                  <div className="login-div">
                    <div id="login-button-loading">
                      <Spin />
                    </div>
                  </div>
                </div>
              )
              : (
                <div className="block">
                  <div className="top">
                    <p id="ic-title">IC Drive</p>
                    <p id="ic-footer">Secure and Private Decentralized Storage App</p>
                  </div>
                  <div className="login-div" role="button" tabIndex={0} onClick={() => handleLogin()}>
                    <div id="login-button">
                      Login with &nbsp;&nbsp;
                      {' '}
                      <img src="./icons/dfinity.png" alt="dfinity logo" style={{ height: '16px' }} />
                    </div>
                  </div>
                </div>
              )
          }

              </div>
            </div>
          )
      }
    </Style>
  );
};

export default Login;

const Style = styled.div`
 
  .login-div{
    margin-top: calc(100vh/2 - 50px);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 16px;
  }
  #login-button{
    height: 40px;
    width: 200px;
    background: #2A3132;
    border-radius: 10px;
    padding-top: 8px;
    padding-left: 35px;
  }
  #login-button-loading{
    height: 40px;
    width: 200px;
    background: #C7C7C7;
    border-radius: 10px;
    padding-top: 8px;
    padding-left: 35px;
  }
  #login-button:hover{
    cursor: pointer;
  }

@media only screen and (max-width: 600px) {
    .loginPage{
        height: 100vh;
        display: grid;
        grid-template-columns: 0 vw 100vw;
    }
    .login-div{
      margin-top: calc(10vh);
    }
    .LHS{
        display: none;
    }
    .RHS{
        display: none;
    }
    .RHS-mobile{
      background: #324851;
    }
    .block{
      display: flex;
      flex-direction: column;
    }
    .top{
      margin-top: 10vh;
    }
    #ic-title{
      font-size: 72px;
      margin-bottom: 0;
      font-family: Times New Roman;
      text-align: center;
      font-weight: 600;
      color: #fff;
      line-height: 90px;
    }
    #ic-footer{
      font-size: 24px;
      text-align: center;
      font-family: Times New Roman;
      font-weight: 400;
      color: #fff;
    }
}
@media only screen and (min-width: 600px) {
    .loginPage{
      height: 100vh;
      display: grid;
      grid-template-columns: 60vw 40vw;
    }
    .LHS{
      background: #324851;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .RHS{
      background: #FFFFFF;
    }
    .RHS-mobile{
      display: none;
    }
    #content{
      display: flex;
      flex-flow: column;
      align-items: center;
      justify-content: center;
    }
    #ic-title{
      font-size: 72px;
      font-family: Times New Roman;
      font-weight: 600;
      color: #fff;
      line-height: 90px;
    }
    #ic-footer{
      font-size: 24px;
      font-family: Times New Roman;
      font-weight: 400;
      color: #fff;
    }
}
`;
