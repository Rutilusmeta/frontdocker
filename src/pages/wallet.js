import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import MetaMaskImage from '../assets/images/wallet/metamask.png';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Switcher from '../components/switcher';

const Wallet = () => {
    const [metaMaskInstalled, setMetaMaskInstalled] = useState(false);
    const [metaMaskConnected, setMetaMaskConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');
    const [ethBalance, setEthBalance] = useState('');

    useEffect(() => {
        document.documentElement.classList.add('dark');
        checkMetaMaskInstallation();
        checkMetaMaskConnection();
    }, []);

    const checkMetaMaskInstallation = () => {
        if (window.ethereum) {
            setMetaMaskInstalled(true);
            window.ethereum.on('accountsChanged', handleAccountsChanged);
        } else {
            setMetaMaskInstalled(false);
        }
    };
    const checkMetaMaskConnection = async () => {
        if (window.ethereum) {
            const isConnected = window.ethereum.isConnected();
            if (isConnected) {
                try {
                    const web3 = new Web3(window.ethereum);
                    const accounts = await web3.eth.getAccounts();
                    if (accounts.length > 0) {
                        setMetaMaskConnected(true);
                        fetchWalletDetails();
                    } else {
                        setMetaMaskConnected(false);
                    }
                } catch (error) {
                    console.error('Error checking MetaMask connection:', error);
                    setMetaMaskConnected(false);
                }
            } else {
                setMetaMaskConnected(false);
            }
        }
    };

    const fetchWalletDetails = async () => {
        try {
            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            if (accounts.length > 0) {
                setWalletAddress(accounts[0]);
                const balance = await web3.eth.getBalance(accounts[0]);
                setEthBalance(web3.utils.fromWei(balance, 'ether'));
            } else {
                // Handle case where no account is available
                console.error('No account available');
            }
        } catch (error) {
            console.error('Error fetching wallet details:', error);
        }
    };

    const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
            setMetaMaskConnected(false);
            setWalletAddress('');
            setEthBalance('');
        } else {
            setMetaMaskConnected(true);
            setWalletAddress(accounts[0]);
            fetchWalletDetails();
        }
    };

    const connectToMetaMask = async () => {
        if (!metaMaskInstalled) {
            alert('MetaMask is not installed or not accessible. Please install MetaMask to continue.');
            return;
        }

        try {
            await window.ethereum.enable();
            setMetaMaskConnected(true);
            fetchWalletDetails();
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
        }
    };

    const disconnectFromMetaMask = () => {
        window.ethereum.removeAllListeners('accountsChanged');
        setMetaMaskConnected(false);
        setWalletAddress('');
        setEthBalance('');
    };

    return (
        <>
            <Navbar />
            <section className="flex justify-center items-center h-screen">
                <div className="max-w-lg w-full rounded-xl bg-white dark:bg-slate-900 shadow dark:shadow-gray-800 p-6 text-center mt-10 hover:shadow-md dark:hover:shadow-gray-800 transition-all duration-500">
                    <div className="relative">
                        <img src={MetaMaskImage} className="bg-white dark:bg-slate-900 h-20 w-20 rounded-full shadow-md dark:shadow-gray-800 mx-auto p-3" alt="" />
                        <h5 className="text-lg font-semibold mt-5">MetaMask</h5>
                        {metaMaskConnected ? (
                            <>
                                <p className="text-slate-400 mt-3">Connected: {walletAddress}</p>
                                <p className="text-slate-400 mt-1">Balance: {ethBalance} ETH</p>
                                <p className="text-slate-400 mt-3">You are connected to MetaMask. Disconnect manually using MetaMask's UI.</p>
                            </>
                        ) : (
                            <button onClick={connectToMetaMask} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mt-4 transition duration-300 ease-in-out">Connect to MetaMask</button>
                        )}
                    </div>
                </div>
            </section>
            <Footer />
            <Switcher />
        </>
    );
};

export default Wallet;