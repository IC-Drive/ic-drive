import React from 'react';
import ReactDOM from 'react-dom';

import Create from './components/UploadFiles.jsx';

class App extends React.Component {

  render() {
    return (
      <div>
        <h1>Photo Application</h1>
        <hr/>
        <Create/>
        <hr/>
      </div>
    );
  }
}

export default App;

ReactDOM.render(<App/>, document.getElementById('app'));
