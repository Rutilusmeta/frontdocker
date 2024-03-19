import React from 'react';
import ReactDOM from 'react-dom/client'
import { AuthType } from '@particle-network/auth-core';
import { EthereumGoerli } from '@particle-network/chains';
import { AuthCoreContextProvider, PromptSettingType } from '@particle-network/auth-core-modal';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '../src/assets/css/tailwind.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
