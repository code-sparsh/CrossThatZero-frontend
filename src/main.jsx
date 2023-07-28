import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider, positions } from 'react-alert';
import AlertTemplate from "react-alert-template-basic";

const options = {
  timeout: 5000,
  position: positions.BOTTOM_CENTER
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider template={AlertTemplate} {...options}>
      <App />
    </Provider>
  </React.StrictMode>,
)
