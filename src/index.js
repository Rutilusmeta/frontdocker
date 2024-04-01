import React from "react";
import ReactDOM from "react-dom/client";
import { ModalProvider } from '@particle-network/connectkit';
import { Ethereum } from '@particle-network/chains';
import { evmWallets } from '@particle-network/connectors';
import { ParticleChains } from '@particle-network/chains';
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "../src/assets/css/tailwind.css";

ParticleChains["localdev"] = {
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
  rpcUrls: { default: { http: ['http://185.230.64.119:8545'] } }, // Adjust the URL based on your Hardhat configuration
  //blockExplorerUrl: "https://gmnetwork-testnet-explorer.alt.technology",
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ModalProvider
      options={{
        projectId: process.env.REACT_APP_PARTICLE_PROJECT_ID,
        clientKey: process.env.REACT_APP_PARTICLE_CLIENT_KEY,
        appId: process.env.REACT_APP_PARTICLE_APP_ID,
        chains: [
          Ethereum,
          ParticleChains["localdev"]
        ],
        /*wallet: {
          visible: false,
         supportChains: [
            Ethereum,
            ParticleChains["localdev"]
          ],
          customStyle: {},
        },*/
        promptSettingConfig: {
          promptPaymentPasswordSettingWhenSign: 1,
          promptMasterPasswordSettingWhenLogin: 1
        },
        connectors: evmWallets({ 
          projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID,
          showQrModal: false
        }),
      }}
      theme={'dark'}
      language={'en'}
      walletSort={['Particle Auth', 'Wallet']}
    >
      <App />
    </ModalProvider>
  </React.StrictMode>
);
reportWebVitals();
