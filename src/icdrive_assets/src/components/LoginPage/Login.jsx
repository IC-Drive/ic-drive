import React from 'react';

// custom imports
import '../../../assets/css/Login.css';

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
    <div className="login-container">
      {
        isLogin
          ? <Profile />
          : (
            <div className="login">
              <div className="login-LHS">
                <div id="login-content">
                  <div id="ic-title">IC Drive</div>
                  <div id="ic-footer">Secure and Private Decentralized Storage App</div>
                </div>
              </div>
              <div className="login-RHS">
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
    </div>
  );
};

export default Login;
