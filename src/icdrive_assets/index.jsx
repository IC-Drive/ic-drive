import React from 'react';
import ReactDOM from 'react-dom';
import UploadFiles from './components/UploadFiles.jsx';

class App extends React.Component {

  render() {
    return (
      <div>
        <h1>Photo Application</h1>
        <hr/>
          <UploadFiles/>
        <hr/>
      </div>
    );
  }
}

export default App;

ReactDOM.render(<App/>, document.getElementById('app'));
