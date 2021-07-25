import React from 'react';

// custom imports
import { Result } from 'antd';
import {
  HashRouter as Router, Route, Switch,
} from 'react-router-dom';
import Login from '../LoginPage/Login';
import PublicUrl from '../PublicUrl';

// 3rd party imports

const Routes = () => (
  <Router hashType="slash">
    <Switch>
      <Route exact path="/">
        <Login />
      </Route>

      <Route exact path="/public/*">
        <PublicUrl />
      </Route>

      <Route exact path="/*">
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
        />
      </Route>

    </Switch>
  </Router>
);

export default Routes;
