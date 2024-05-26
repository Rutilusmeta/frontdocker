import React, { createContext, useContext, useState } from 'react';
import Web3 from 'web3';
import NFTMarketplacArtifactJson from '../contracts/abi/contracts/NFTMarketplace.sol/NFTMarketplace.json';

const ABI = NFTMarketplacArtifactJson.abi;

const NFTMarketplaceContext = createContext();

export const useNFTMarketplace = () => useContext(NFTMarketplaceContext);

const BigNumber = require('bignumber.js');

export const NFTMarketplaceContextProvider = ({ children }) => 
{
    let providerAddress;
    let contractAddress;
    let decimalNumber;
    let hexString;
    let customChainId;
    let customNetwork;
    const [provider, setProvider] = useState(null);

    switch (process.env.REACT_APP_CHAIN_ENV) 
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
            providerAddress = process.env.REACT_APP_CHAIN_ADDRESS_DEV;
            break;
    }

    switch (process.env.REACT_APP_CHAIN_ENV) 
    {
        case 'dev':
            contractAddress = process.env.REACT_APP_CONTRACT_PROXY_ADDRESS_DEV;
            break;
        case 'testing':
            contractAddress = process.env.REACT_APP_CONTRACT_PROXY_ADDRESS_TESTING;
            break;
        case 'prod':
            contractAddress = process.env.REACT_APP_CONTRACT_PROXY_ADDRESS_PROD;
            break;
        default:
            contractAddress = process.env.REACT_APP_CONTRACT_PROXY_ADDRESS_DEV;
            break;
    }

    const updateProvider = (newProvider) => 
    {
        console.log("Updating provider", newProvider);
        setProvider(newProvider);
    };
 
    const getMarketItems = async () =>
    {
        try 
        {
            const web3 = new Web3(providerAddress);
            const contract = new web3.eth.Contract(ABI, contractAddress);
            const records = await contract.methods.getActiveMarketItems().call();
            const filteredRecords = records.filter(record => record.state === 0n);
            return filteredRecords;
        } 
        catch (error) 
        {
            console.error(error);
            return null;
        }
    };

    const buyMarketItem = async (tokenId, price) => 
    {
        try 
        {
            const accounts = await connectWallet();
            const web3 = new Web3(provider);
            const contract = new web3.eth.Contract(ABI, contractAddress);
            const tx = await contract.methods.purchaseMarketItem(tokenId).send
            ({
                from: accounts[0],
                value: web3.utils.toWei(price.toString(), 'ether')
            });
            return tx;
        }
        catch (error) 
        {
            console.error(error);
            return null;
        }
    }
    
    const getMarketItem = async (tokenId) => 
    {
        try 
        {
            const web3 = new Web3(providerAddress);
            const contract = new web3.eth.Contract(ABI, contractAddress);
            const record = await contract.methods.getActiveMarketItem(tokenId).call();
            return record;
        }
        catch (error) 
        {
            console.error(error);
            return null;
        }
     };
    
    const getUserMarketItems = async (address, state = null) => 
    {
        try 
        {
            //const accounts = (address) ? [address] : await connectWallet();
            //const web3 = new Web3(window.ethereum);
            const accounts = [address];
            const web3 = new Web3(providerAddress);
            const contract = new web3.eth.Contract(ABI, contractAddress);
            const records = await contract.methods.getMarketItemsBySeller(accounts[0]).call();
            if (state !== null)
            {
                const filteredRecords = records.filter(record => record.state === state);
                return filteredRecords;
            }
            return records;
        } 
        catch (error) 
        {
            console.error(error);
            return null;
        }
    };

    const formatPrice = (price) =>
    {
        const etherPerWei = new BigNumber(10).pow(18);
        const priceInEther = new BigNumber(price).div(etherPerWei);
        return priceInEther.toString();
    }

    const changeItemStateAndPrice = async (tokenId, price, state) => 
    {
        try 
        {
            const accounts = await connectWallet();
            if (price <= 0 && state === 0n) 
            {
                throw new Error("Price must be greater than 0");
            }
            const web3 = new Web3(provider);
            const contract = new web3.eth.Contract(ABI, contractAddress);
            const priceInWei = web3.utils.toWei(price.toString(), "ether");
            const transaction = await contract.methods.changeItemStateAndPrice(tokenId, priceInWei, state).send({ from: accounts[0] });
            return transaction;
        } 
        catch (error) 
        {
            console.error("Error creating market item:", error);
            return null;
        }
    }
    const createMarketItem = async (tokenURI, price) => 
    {
        try 
        {
            const accounts = await connectWallet();
            const web3 = new Web3(provider);
            const contract = new web3.eth.Contract(ABI, contractAddress);
            const transaction = await contract.methods.createToken(tokenURI, price).send({ from: accounts[0] });
            return transaction;
        } 
        catch (error) 
        {
            console.error("Error creating market item:", error);
            return null;
        }
    };

    const connectWallet = async () => {

        switch (process.env.REACT_APP_CHAIN_ENV) {
            case 'dev':
                decimalNumber = parseInt(process.env.REACT_APP_CHAIN_ID_DEV);
                hexString = decimalNumber.toString(16);
                customChainId = '0x' + hexString;
                customNetwork = {
                    chainId: customChainId,
                    chainName: 'GANACHE SERVER TEST',
                    nativeCurrency: {
                        name: 'ETH',
                        symbol: 'ETH',
                        decimals: 18,
                    },
                    rpcUrls: [
                        process.env.REACT_APP_CHAIN_ADDRESS_DEV
                            .replace('ws://', 'http://').replace('wss://', 'https://')
                    ],
                    //blockExplorerUrls: ['https://custom-block-explorer-url.com']
                };
                await provider.request({
                    method: "wallet_addEthereumChain",
                    params: [customNetwork]
                });
                await provider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: customChainId }]
                });
                break;
            case 'testing':
                decimalNumber = parseInt(process.env.REACT_APP_CHAIN_ID_TESTING);
                hexString = decimalNumber.toString(16);
                customChainId = '0x' + hexString;
                await provider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: customChainId }]
                });
                break;
            case 'prod':
                decimalNumber = parseInt(process.env.REACT_APP_CHAIN_ID_PROD);
                hexString = decimalNumber.toString(16);
                customChainId = '0x' + hexString;
                await provider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: customChainId }]
                });
                break;
            default:
                // Default to dev environment if REACT_APP_NETWORK is not set or unrecognized
               //providerAddress = process.env.REACT_APP_CHAIN_ADDRESS_DEV;
                break;
        }
        return await provider.request({ method: 'eth_requestAccounts' });
    }
    const getAccounts = async () => 
    {
        try 
        {
            const accounts = await connectWallet();
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
            await connectWallet();
            const web3 = new Web3(provider);
            await provider.request({ method: 'eth_requestAccounts' });
            const balance = await web3.eth.getBalance(address);
            const balanceInEther = web3.utils.fromWei(balance, 'ether');
            const formattedBalance = parseFloat(balanceInEther).toFixed(4);
            return formattedBalance;
        }
        catch (error) 
        {
            console.error(error);
            return null;
        }
    }

    return (
        <NFTMarketplaceContext.Provider value={{ formatPrice, buyMarketItem, getMarketItem, getMarketItems, 
            changeItemStateAndPrice, getUserMarketItems, createMarketItem, getBalance, getAccounts, connectWallet, updateProvider }}>
            {children}
        </NFTMarketplaceContext.Provider>
    );
};

