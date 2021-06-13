import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import {registerWorker} from './mitm.jsx'

import {Provider} from 'react-redux';
import {createStore} from 'redux';
import reducers from './state/reducers';

const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <Provider store={store}>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// thanks to https://github.com/jimmywarting/StreamSaver.js
//registerWorker();