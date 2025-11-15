import React from 'react';
// import ReactDOM from 'react-dom';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './Components/App/App.js';
import * as serviceWorker from './serviceWorker';

// ReactDOM.render(<App />, document.getElementById('app'));
const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
