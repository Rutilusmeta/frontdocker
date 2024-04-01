// BoxContext.js
import React, { createContext, useContext } from 'react';
import Web3 from 'web3';
import NFTMarketplacArtifactJson from '../contracts/abi/contracts/NFTMarketplace.sol/NFTMarketplace.json';
//import { useAccount as useParticleAccount, useConnectModal } from '@particle-network/connectkit';

const ABI = NFTMarketplacArtifactJson.abi;

const NFTMarketplaceContext = createContext();

export const useNFTMarketplace = () => useContext(NFTMarketplaceContext);

export const NFTMarketplaceContextProvider = ({ children }) => {

    //const account = useParticleAccount();
    //const connectModal = useConnectModal();
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

    const getMarketItems = async () => {
        try 
        {
            const web3 = new Web3(providerAddress); // Assuming Hardhat is running on port 8545 locally
            const contract = new web3.eth.Contract(ABI, process.env.REACT_APP_CONTRACT_PROXY_ADDRESS);
            const records = await contract.methods.getMarketItems("0x0000000000000000000000000000000000000000").call();
            console.log("NFTMarketContext::getMarketItems: ", records);
            return records;
        } 
        catch (error) 
        {
            console.error(error);
        }
    };

    const createMarketItem = async (tokenURI, price, collectionAddress) => {
        try {
            // Perform validations
            if (price <= 0) {
                throw new Error("Price must be greater than 0");
            }
            const web3 = new Web3(providerAddress);
            const contract = new web3.eth.Contract(ABI, process.env.REACT_APP_CONTRACT_PROXY_ADDRESS);

            const transaction = await contract.methods.createToken(tokenURI, price, collectionAddress);
            //const fees = await estimateTransactionFees(transaction);
            //console.log("Transaction fees", fees);
            //const estimatedGas = await transaction.estimateGas({ from: account });
            //console.log("EStimated Gas:", estimatedGas);
            //const gasPrice = await web3.eth.getGasPrice();
            //const transactionFees = web3.utils.toBigInt(estimatedGas) * web3.utils.toBigInt(gasPrice);
            //console.log(transactionFees);
            //const recepit = await transaction.send({ from: account, gas: estimatedGas });
            //console.log("Market item created successfully: ", recepit);
            //return recepit;
            
        } catch (error) {
            console.error("Error creating market item:", error);
            return false;
        }
    };

    const handleAccountCheck = () => {
        /*if (!account) {
            //console.log("No wallet connected");
            connectModal.openConnectModal();
            return false;
        }
        return account;*/
    };

    const getBalance = async (address) => {
        try {
            const web3 = new Web3(providerAddress);
            const balance = await web3.eth.getBalance(address);
            const balanceInEther = web3.utils.fromWei(balance, 'ether');
            console.log('Balance:', balanceInEther, 'ETH');
            const formattedBalance = parseFloat(balanceInEther).toFixed(4);
            console.log('Formated Balance:', formattedBalance, 'ETH');
            return formattedBalance;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    const estimateTransactionFees = async (transaction, data) => {
        try {
            const web3 = new Web3(providerAddress);
            // Estimate gas for the transaction
           // const estimatedGas = await transaction.estimateGas({ from: account });
            //onsole.log("Estimated Gas:", estimatedGas);
            // Get current gas price
            //const gasPrice = await web3.eth.getGasPrice();
            // Calculate transaction fees
            //const transactionFees = web3.utils.toBigInt(estimatedGas) * web3.utils.toBigInt(gasPrice);
            //const fees = web3.utils.fromWei(transactionFees, 'ether')
           // console.log("Transaction Fees:", fees, "ETH");
            //return fees;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    const getTransactionFees = async () => {
        try {
            const web3 = new Web3(providerAddress);
            const contract = new web3.eth.Contract(ABI, process.env.REACT_APP_CONTRACT_PROXY_ADDRESS);
            
            // Estimate gas for the transaction
            //const estimatedGas = await contract.methods.createToken().estimateGas({ from: account , data:{a:"bbb"}});
            //console.log("Estimated Gas:", estimatedGas);
            // Get current gas price
           // const gasPrice = await web3.eth.getGasPrice();
            //console.log("Gas Price:", gasPrice);
            // Calculate transaction fees
            //const transactionFees = web3.utils.toBigInt(estimatedGas) * web3.utils.toBigInt(gasPrice);
           // const fees = web3.utils.fromWei(transactionFees, 'ether')
           // console.log("Transaction Fees:", fees, "ETH");
           // return fees;
           return 1000;
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

    return (
        <NFTMarketplaceContext.Provider value={{ getMarketItems,  handleAccountCheck, getTransactionFees, createMarketItem, getBalance }}>
            {children}
        </NFTMarketplaceContext.Provider>
    );
};

