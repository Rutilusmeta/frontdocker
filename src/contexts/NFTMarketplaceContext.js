// BoxContext.js
import React, { createContext, useContext } from 'react';
import Web3 from 'web3';
import NFTMarketplacArtifactJson from '../contracts/abi/contracts/NFTMarketplace.sol/NFTMarketplace.json';

const ABI = NFTMarketplacArtifactJson.abi;

const NFTMarketplaceContext = createContext();

export const useNFTMarketplace = () => useContext(NFTMarketplaceContext);

export const NFTMarketplaceContextProvider = ({ children }) => 
{
    let providerAddress;

    switch (process.env.REACT_APP_CURRENT_ENV) 
    {
        case 'dev':
            providerAddress = process.env.REACT_APP_CHAIN_ADDRESS_DEV;
            break;
        case 'testing':
            providerAddress = process.env.REACT_APP_CHAIN_ADDRESS_TESTING;
            break;
        case 'prod':
            providerAddress = process.env.REACT_APP_CHAIN_ADDRESS_PROD;
            break;
        default:
            // Default to dev environment if REACT_APP_NETWORK is not set or unrecognized
            providerAddress = process.env.REACT_APP_CHAIN_ADDRESS_DEV;
            break;
    }

    const getMarketItems = async () => 
    {
        try 
        {
            const web3 = new Web3(providerAddress); // Assuming Hardhat is running on port 8545 locally
            //const web3 = new Web3(window.etherium);
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

    const createMarketItem = async (tokenURI, price, collectionAddress) => 
    {
        try 
        {
            const accounts = await connectWallet();
            // Perform validations
            if (price <= 0) 
            {
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
            
        } 
        catch (error) 
        {
            console.error("Error creating market item:", error);
            return false;
        }
    };

    const connectWallet = async () => 
    {
        switch (process.env.REACT_APP_CURRENT_ENV) 
        {
            case 'dev':
                const decimalNumber = parseInt(process.env.REACT_APP_CHAIN_ID_DEV);
                const hexString = decimalNumber.toString(16); // Convert to hexadecimal
                const customChainId = '0x' + hexString; // Add '0x' prefix
                //console.log("customChainId",decimalNumber,hexString,customChainId);
                const customNetwork = 
                {
                    chainId: customChainId,
                    chainName: 'GANACHE SERVER TEST',
                    nativeCurrency: 
                    {
                        name: 'ETH',
                        symbol: 'ETH',
                        decimals: 18,
                    },
                    rpcUrls: [process.env.REACT_APP_CHAIN_ADDRESS_DEV.replace('ws://', 'http://')],
                    //blockExplorerUrls: ['https://custom-block-explorer-url.com']
                };
                const result = await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [customNetwork]
                });
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: customChainId }]
                });
                break;
            //case 'testing':
            //    break;
            //case 'prod':
            //    break;
            default:
                // Default to dev environment if REACT_APP_NETWORK is not set or unrecognized
               //providerAddress = process.env.REACT_APP_CHAIN_ADDRESS_DEV;
                break;
        }
        return await window.ethereum.request({ method: 'eth_requestAccounts' });
    }
    const getAccounts = async () => {
        try 
        {
            const accounts = await connectWallet();
            //const web3 = new Web3(window.ethereum);
            //const accounts = await web3.eth.getAccounts();
            //console.log("Accounts", accounts);
            return accounts;
        } 
        catch (error) 
        {
            console.error('Error fetching accounts from MetaMask:', error);
            return null;
        }
    };

    const getBalance = async (address) => 
    {
        try 
        {
            const accounts = await connectWallet();
            //const web3 = new Web3(providerAddress);
            const web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const balance = await web3.eth.getBalance(address);
            const balanceInEther = web3.utils.fromWei(balance, 'ether');
            //console.log('balanceInEther:', balanceInEther, 'ETH');
            const formattedBalance = parseFloat(balanceInEther).toFixed(4);
            //console.log('Formated Balance:', formattedBalance, 'ETH');
            return formattedBalance;
        }
        catch (error) 
        {
            console.error(error);
            return null;
        }
    }

    const estimateTransactionFees = async (transaction, data) => {
        try {
            //const web3 = new Web3(providerAddress);
            const web3 = new Web3(window.etherium);
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
            //const web3 = new Web3(providerAddress);
            const web3 = new Web3(window.etherium);
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
        <NFTMarketplaceContext.Provider value={{ getMarketItems, getTransactionFees, createMarketItem, getBalance, getAccounts, connectWallet }}>
            {children}
        </NFTMarketplaceContext.Provider>
    );
};

