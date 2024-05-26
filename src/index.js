import React from "react";
import ReactDOM from "react-dom/client";
import { ModalProvider } from '@particle-network/connectkit';
import { PolygonAmoy } from '@particle-network/chains';
import { /*evmWallets, */metaMask, rainbow, walletconnect } from '@particle-network/connectors';
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "../src/assets/css/tailwind.css";
import '@particle-network/connectkit/dist/index.css';

/*ParticleChains["localdev"] = {
  id: 1337,
  chainType: 'evm',
  name: 'localdev',
  icon: "https://static.particle.network/token-list/gmnetwork/native.png",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18
  },
  fullname: "Ganache Test Node",
  rpcUrls: { default: { http: [process.env].REACT_APP_CHAIN_DEV_ADDRESS } },
  //blockExplorerUrl: "https://gmnetwork-testnet-explorer.alt.technology",
};*/

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ModalProvider
      options={{
        projectId: process.env.REACT_APP_PARTICLE_PROJECT_ID,
        clientKey: process.env.REACT_APP_PARTICLE_CLIENT_KEY,
        appId: process.env.REACT_APP_PARTICLE_APP_ID,
        chains: [
          ((process.env.REACT_APP_CHAIN_ENV === 'testing') ? PolygonAmoy : '')
        ],
        wallet: {
          visible: ((process.env.REACT_APP_CHAIN_ENV === 'dev') ? false : true),
          supportChains: [
            ((process.env.REACT_APP_CHAIN_ENV === 'testing') ? PolygonAmoy : '')
          ],
          themeType: "dark"
        },
        promptSettingConfig: {
          promptPaymentPasswordSettingWhenSign: 1,
          promptMasterPasswordSettingWhenLogin: 1
        },
        connectors: [
          /*...evmWallets({ 
            projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID,
            showQrModal: false
          })*/
          metaMask({ }),
          rainbow({ projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID }),
          walletconnect({ projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID })
        ]
      }}
      theme={'dark'}
      language={'en'}
      preferredAuthType={[
        'email'
      ]}
      walletSort={['Particle Auth', 'Wallet']}
    >
      <App />
    </ModalProvider>
  </React.StrictMode>
);
reportWebVitals();