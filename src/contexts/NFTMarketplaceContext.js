// BoxContext.js
import React, { createContext, useContext } from 'react';
import Web3 from 'web3';
import NFTMarketplacArtifactJson from '../contracts/abi/contracts/NFTMarketplace.sol/NFTMarketplace.json';

const ABI = NFTMarketplacArtifactJson.abi;

const NFTMarketplaceContext = createContext();

export const useNFTMarketplace = () => useContext(NFTMarketplaceContext);

const BigNumber = require('bignumber.js');

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
 
    const getMarketItems = async () => // we need to add this logic on the contract
    {
        try 
        {
            const web3 = new Web3(providerAddress);
            const contract = new web3.eth.Contract(ABI, process.env.REACT_APP_CONTRACT_PROXY_ADDRESS);
            const records = await contract.methods.getActiveMarketItems().call();
            const filteredRecords = records.filter(record => record.state === 0n);
            //console.log("NFTMarketContext::getActiveMarketItems: ", filteredRecords);
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
            const web3 = new Web3(window.ethereum);
            const contract = new web3.eth.Contract(ABI, process.env.REACT_APP_CONTRACT_PROXY_ADDRESS);
            const tx = await contract.methods.purchaseMarketItem(tokenId).send
            ({
                from: accounts[0],
                value: web3.utils.toWei(price.toString(), 'ether') // Convert price to Wei
            });
            //console.log("buyMarketItem:purchaseketItem", tx);
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
            const contract = new web3.eth.Contract(ABI, process.env.REACT_APP_CONTRACT_PROXY_ADDRESS);
            const record = await contract.methods.getActiveMarketItem(tokenId).call();
            //console.log("NFTMarketContext::getActiveMarketItems: ", tokenId, record);
            return record;
        }
        catch (error) 
        {
            console.error(error);
            return null;
        }
     };
    const getUserMarketItems = async () => 
    {
        try 
        {
            const accounts = await connectWallet();
            const web3 = new Web3(window.ethereum);
            const contract = new web3.eth.Contract(ABI, process.env.REACT_APP_CONTRACT_PROXY_ADDRESS);
            const records = await contract.methods.getMarketItemsBySeller(accounts[0]).call();
            //console.log("NFTMarketContext::getMarketItemsBySeller: ", records);
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
        const etherPerWei = new BigNumber(10).pow(18); // 1 Ether = 10^18 Wei
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
            const web3 = new Web3(window.ethereum);
            const contract = new web3.eth.Contract(ABI, process.env.REACT_APP_CONTRACT_PROXY_ADDRESS);
            const priceInWei = web3.utils.toWei(price.toString(), "ether");
            const transaction = await contract.methods.changeItemStateAndPrice(tokenId, priceInWei, state).send({ from: accounts[0] });
            //console.log("changeItemStateAndPrice: ", tokenId, price, state, transaction);
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
            const web3 = new Web3(window.ethereum);
            const contract = new web3.eth.Contract(ABI, process.env.REACT_APP_CONTRACT_PROXY_ADDRESS);
            const transaction = await contract.methods.createToken(tokenURI, price).send({ from: accounts[0] });
            //console.log("Market item created successfully: ", transaction);
            return transaction;
        } 
        catch (error) 
        {
            console.error("Error creating market item:", error);
            return null;
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
                    rpcUrls: 
                    [
                        process.env.REACT_APP_CHAIN_ADDRESS_DEV.
                            replace('ws://', 'http://').replace('wss://', 'https://')
                    ],
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
            const accounts = await connectWallet();
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

    return (
        <NFTMarketplaceContext.Provider value={{ formatPrice, buyMarketItem, getMarketItem, getMarketItems, 
            changeItemStateAndPrice, getUserMarketItems, createMarketItem, getBalance, getAccounts, connectWallet }}>
            {children}
        </NFTMarketplaceContext.Provider>
    );
};

