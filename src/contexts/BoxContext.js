// BoxContext.js
import React, { createContext, useContext, useCallback } from 'react';
import Web3 from 'web3';
//import BoxArtifactJson from '../contracts/abi/contracts/BoxV3.sol/BoxV3.json';
import BoxArtifactJson from '../contracts/abi/contracts/NFTMarketplace.sol/NFTMarketplace.json';
import { useAccount as useParticleAccount, useConnectModal } from '@particle-network/connectkit';

const ABI = BoxArtifactJson.abi;

const BoxContext = createContext();

export const useBox = () => useContext(BoxContext);

export const BoxContextProvider = ({ children }) => {

    const account = useParticleAccount();
    const connectModal = useConnectModal();
    let providerAddress;

    switch (process.env.REACT_APP_NETWORK) {
        case 'dev':
            providerAddress = process.env.REACT_APP_CHAIN_DEV_ADDRESS;
            break;
        case 'testing':
            providerAddress = process.env.REACT_APP_CHAIN_TESTING_ADDRESS;
            break;
        case 'prod':
            providerAddress = process.env.REACT_APP_CHAIN_PROD_ADDRESS;
            break;
        default:
            // Default to dev environment if REACT_APP_NETWORK is not set or unrecognized
            providerAddress = process.env.REACT_APP_CHAIN_DEV_ADDRESS;
            break;
    }

    const fetchData = async () => {
        try 
        {
            const web3 = new Web3(providerAddress); // Assuming Hardhat is running on port 8545 locally
            const contract = new web3.eth.Contract(ABI, process.env.REACT_APP_CONTRACT_PROXY_ADDRESS);
            //const value = await contract.methods.retrieve().call();
            const value = await contract.methods.getMarketItems("0x0000000000000000000000000000000000000000").call();
            console.log("fetchData value: ", value);
            return value;
        } 
        catch (error) 
        {
            console.error(error);
        }
    };

    const storeData = async (newValue) => {
        if (!window.ethereum) 
        {
            console.error('MetaMask is not installed or enabled');
            // You can prompt the user to install MetaMask or enable it
            return;
        }
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        // Get the user's Ethereum address
        const web3 = new Web3(providerAddress);
        const accounts = await web3.eth.getAccounts();
        const userAddress = accounts[0]; // Assuming the user is logged in and has at least one account
        // Get the contract instance
        const contract = new web3.eth.Contract(ABI, process.env.REACT_APP_CONTRACT_PROXY_ADDRESS);
        // Call the store function from the contract
        await contract.methods.store(newValue).send({ from: userAddress });
        console.log("Data stored successfully: " , newValue);
        // Refresh data after storing
        await fetchData();
    };

    const handleAccountCheck = () => {
        if (!account) {
            //console.log("No wallet connected");
            connectModal.openConnectModal();
            return false;
        }
        return account;
    };

    const getTransactionFees = async () => {
        console.log("TRANFEEEES");
        try {
            const web3 = new Web3(providerAddress);
            const contract = new web3.eth.Contract(ABI, process.env.REACT_APP_CONTRACT_PROXY_ADDRESS);
            
            // Estimate gas for the transaction
            const estimatedGas = await contract.methods.increment().estimateGas({ from: account , data:{a:"bbb"}});
            console.log("Estimated Gas:", estimatedGas);
            // Get current gas price
            const gasPrice = await web3.eth.getGasPrice();
            console.log("Gas Price:", gasPrice);
            // Calculate transaction fees
            const transactionFees = web3.utils.toBigInt(estimatedGas) * web3.utils.toBigInt(gasPrice);
            const fees = web3.utils.fromWei(transactionFees, 'ether')
            console.log("Transaction Fees:", fees, "ETH");
            return fees;
            // Proceed with sending the transaction
            //const txReceipt = await contract.methods.increment().send({ from: account });
    
            //console.log("Transaction Hash:", txReceipt.transactionHash);
           // console.log("Data incremented successfully");
    
            // Fetch updated data after the transaction
            //await fetchData();
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const increment = async (price) => {

       // if (!handleAccountCheck()) {
        //    return;
       // }
        try 
        {
            const web3 = new Web3(providerAddress); // Assuming Hardhat is running on port 8545 locally
            const contract = new web3.eth.Contract(ABI, process.env.REACT_APP_CONTRACT_PROXY_ADDRESS);
            const transaction = await contract.methods.increment().send({ from: account/*, value: price*/});
            console.log("Transaction hash:", transaction.transactionHash);
            console.log("Data incremented successfully");
            await fetchData();
        } 
        catch (error) 
        {
            console.error(error);
        }
    };

   /* const setName = async (newName) => {
        if (!window.ethereum) 
        {
            console.error('MetaMask is not installed or enabled');
            // You can prompt the user to install MetaMask or enable it
            return;
        }
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        // Get the contract instance
        const contract = new web3.eth.Contract(ABI, process.env.REACT_APP_PROXY_ADDRESS);
        // Call the setName function from the contract
        await contract.methods.setName(newName).send({ from: userAddress });
        console.log(`Name set to ${newName} successfully`);
        // Refresh data after setting name
        await fetchData();
    };*/

    return (
        <BoxContext.Provider value={{ fetchData, storeData, increment, getTransactionFees, handleAccountCheck }}>
            {children}
        </BoxContext.Provider>
    );
};

