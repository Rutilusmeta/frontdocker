import React from "react";
import ReactDOM from "react-dom/client";
import { AuthType } from '@particle-network/auth-core';
import { AuthCoreContextProvider, PromptSettingType } from '@particle-network/auth-core-modal';
import './index.css';
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "../src/assets/css/tailwind.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthCoreContextProvider
      options={{
        projectId: process.env.REACT_APP_PARTICLE_PROJECT_ID,
        clientKey: process.env.REACT_APP_PARTICLE_CLIENT_KEY,
        appId: process.env.REACT_APP_PARTICLE_APP_ID,
        authTypes: [AuthType.email, AuthType.google, AuthType.twitter, AuthType.facebook],
        themeType: 'dark',
        //fiatCoin: 'USD',
        language: 'en',
        //erc4337: {
        //  name: 'SIMPLE',
        //  version: '1.0.0',
        //},
        promptSettingConfig: {
          promptPaymentPasswordSettingWhenSign: PromptSettingType.first,
          promptMasterPasswordSettingWhenLogin: PromptSettingType.first,
        },
        wallet: {
          visible: false,
          /*customStyle: {
            supportChains: [EthereumGoerli],
          }*/
        },
      }}
    >
    <App />
      </AuthCoreContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
