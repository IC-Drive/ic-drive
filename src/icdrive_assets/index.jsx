import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './components/Dashboard.jsx';
import styled from 'styled-components';

class App extends React.Component {

  render() {
    return (
      <div>
        <Style>
          <Dashboard />
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
