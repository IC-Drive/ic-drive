import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './components/Dashboard.jsx';
import styled from 'styled-components';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import reducers from './state/reducers';

const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

class App extends React.Component {

  render() {
    return (
      <div>
        <Style>
        <Provider store={store}>
        <React.StrictMode>
          <Dashboard />
        </React.StrictMode>
        </Provider>
        </Style>
      </div>
    );
  }
}

export default App;
const Style = styled.div`
  margin: -8px -8px -8px -8px;
`

ReactDOM.render(<App/>, document.getElementById('app'));
