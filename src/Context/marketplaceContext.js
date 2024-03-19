import React, { useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { readContract, writeContract } from "@wagmi/core";
import {
	NFTMarketplaceAddress,
	NFTMarketplaceABI,
	nft_contract,
	nft_contract_abi,
	NftContractABI,
} from "./constants";
import axios from "axios";
import { createWalletClient, http, publicActions } from "viem";
import { polygonMumbai } from "viem/chains";
import { Network, Alchemy } from "alchemy-sdk";
import { ethers } from "ethers";
export const MarketplaceContext = React.createContext();
export const MarketplaceContextProvider = ({ children }) => {
	const { address } = useAccount();
	const [nfts, setNfts] = useState([]);
	const [userNfts, setUserNfts] = useState([]);
	const settings = {
		apiKey: "", // Replace with your Alchemy API Key.
		network: Network.MATIC_MUMBAI, // Replace with your network.
	};
	const alchemy = new Alchemy(settings);
	useEffect(() => {
		if (address) {
			fn();
		}
	}, [address]);

	const fn = async () => {
		const data = await fetchMarketPlaceItems();
		setNfts(data);
		await getUserNFTs();
	};

	const createToken = async (tokenURI) => {
		const { hash } = await writeContract({
			address: nft_contract,
			abi: nft_contract_abi,
			functionName: "createToken",
			args: [tokenURI],
		});

		return hash;
	};
	const listNFT = async (tokenId, price, tokenContract) => {
		try {
			const client = createWalletClient({
				chain: polygonMumbai,
				transport: http(),
			}).extend(publicActions);
			const { hash: approvalHash } = await writeContract({
				address: tokenContract,
				abi: NftContractABI,
				functionName: "approve",
				args: [NFTMarketplaceAddress, tokenId],
			});
			await client.waitForTransactionReceipt({
				hash: approvalHash,
			});

			const { hash } = await writeContract({
				address: NFTMarketplaceAddress,
				abi: NFTMarketplaceABI,
				functionName: "listNFT",
				args: [tokenId, ethers.utils.parseEther(price), tokenContract],
			});
			await client.waitForTransactionReceipt({
				hash,
			});
			alert("NFT Listed Successfully");
			return hash;
		} catch (e) {
			console.log(e);
			alert("Try Again!! Something went wrong.");
		}
	};
	const createAunction = async (
		tokenId,
		price,
		minimumBid,
		tokenContract,
		days
	) => {
		try {
			const client = createWalletClient({
				chain: polygonMumbai,
				transport: http(),
			}).extend(publicActions);
			const { hash: approvalHash } = await writeContract({
				address: tokenContract,
				abi: NftContractABI,
				functionName: "approve",
				args: [NFTMarketplaceAddress, tokenId],
			});
			await client.waitForTransactionReceipt({
				hash: approvalHash,
			});
			const duration = Date.now() + Number(days) * 24 * 60 * 60;
			const { hash } = await writeContract({
				address: NFTMarketplaceAddress,
				abi: NFTMarketplaceABI,
				functionName: "startAuction",
				args: [
					tokenId,
					ethers.utils.parseEther(minimumBid),
					duration,
					tokenContract,
				],
				value: 1,
			});

			await client.waitForTransactionReceipt({
				hash,
			});

			alert("Auction Created Successfully");
		} catch (e) {
			console.log(e);
			alert("Try Again!! Something went wrong.");
		}
	};
	const bidOnAuction = async (auctionId, nft, bidPrice) => {
		try {
			if (Number(bidPrice) <= Number(nft.price)) {
				alert("Bid Price should be greater than the current price");
				return;
			}
			const client = createWalletClient({
				chain: polygonMumbai,
				transport: http(),
			}).extend(publicActions);
			const { hash } = await writeContract({
				address: NFTMarketplaceAddress,
				abi: NFTMarketplaceABI,
				functionName: "placeBid",
				args: [auctionId],
				value: ethers.utils.parseEther(bidPrice.toString()),
			});
			await client.waitForTransactionReceipt({
				hash: hash,
			});

			alert("NFT Bought Successfully");
			return hash;
		} catch (e) {
			console.log(e);
			alert("Try Again!! Something went wrong.");
		}
	};
	const getUserNFTs = async () => {
		if (!address) {
			return [];
		}
		const nftData = [];
		try {
			(async () => {
				const response = await axios.post(
					"https://rpc.particle.network/evm-chain",
					{
						chainId: 80001,
						jsonrpc: "2.0",
						id: 1,
						method: "particle_getNFTs",
						params: [address],
					},
					{
						auth: {
							username: process.env.REACT_APP_PROJECT_ID,
							password: process.env.REACT_APP_SERVERKEY,
						},
					}
				);

				console.log("Particle:", response.data);
				for (let i = 0; i < response.data.result.length; i++) {
					const nft = response.data.result[i];
					nft.metadata = nft.data;
					nft.tokenAdress = nft.address;
					nft.owner = address;
					nft.seller = address;
					if (nft.data.image.includes("ipfs://")) {
						const image = nft.data.image.replace(
							"ipfs://",
							"https://ipfs.io/ipfs/"
						);
						nft.metadata.image = image;
					}
					console.log("NFT Data from Particle:", nft);
					nftData.push(nft);
				}
			})();
		} catch (e) {
			console.log(e);
		}

		try {
			let pageKey = null;

			do {
				const response = await alchemy.nft.getNftsForOwner(address, {
					withMetadata: true,
					pageKey: pageKey, // Provide the page key if available
				});
				for (let i = 0; i < response.ownedNfts.length; i++) {
					const nft = response.ownedNfts[i];
					nft.metadata = nft.raw.metadata;
					nft.tokenAdress = nft.contract.address;
					nft.owner = address;
					nft.seller = address;
					if (nft.raw.metadata.image.includes("ipfs://")) {
						const image = nft.raw.metadata.image.replace(
							"ipfs://",
							"https://ipfs.io/ipfs/"
						);
						nft.metadata.image = image;
					}
					nftData.push(nft);
				}

				pageKey = response.pageKey;
			} while (pageKey);
			console.log(nftData, "nftData");
			setUserNfts(nftData);
		} catch (error) {
			console.error("Error fetching NFTs:", error);
			return [];
		}
	};

	const fetchMarketPlaceItems = async () => {
		const data = await readContract({
			address: NFTMarketplaceAddress,
			abi: NFTMarketplaceABI,
			functionName: "fetchMarketItems",
		});
		let nfts = [];
		for (let i = 0; i < data.length; i++) {
			const nftAddress = data[i].collectionAddress;
			const tokenId = data[i].tokenId;
			const listingId = i;
			const price = ethers.utils.formatEther(data[i].price, toString());
			const owner = data[i].seller;
			const tokenURI = await readContract({
				address: nftAddress,
				abi: NftContractABI,
				functionName: "tokenURI",
				args: [Number(tokenId)],
			});
			data[i].tokenURI = tokenURI;
			if (tokenURI.includes("ipfs://")) {
				const url = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
				const metadata = await axios.get(url);
				data[i].metadata = metadata.data;
				try {
					if (metadata.data.image.includes("ipfs://")) {
						const image = metadata.data.image.replace(
							"ipfs://",
							"https://ipfs.io/ipfs/"
						);
						data[i].metadata.image = image;
					}
				} catch (e) {
					console.log(e);
				}
			} else {
				const metadata = await axios.get(tokenURI);
				data[i].metadata = metadata.data;
			}
			data[i].price = price;
			data[i].owner = owner;
			data[i].nftAddress = nftAddress;
			data[i].tokenId = tokenId;
			data[i].seller = owner;
			data[i].listingId = listingId;
			data[i].type = "sell";
			nfts.push(data[i]);
		}
		const auctionsData = await readContract({
			address: NFTMarketplaceAddress,
			abi: NFTMarketplaceABI,
			functionName: "getAllAuctionListings",
		});
		for (let i = 0; i < auctionsData.length; i++) {
			const nftAddress = auctionsData[i].collectionAddress;
			const tokenId = auctionsData[i].tokenId;
			const listingId = i;
			const price = ethers.utils.formatEther(
				auctionsData[i].highestBid,
				toString()
			);
			const owner = auctionsData[i].owner;
			const tokenURI = await readContract({
				address: nftAddress,
				abi: NftContractABI,
				functionName: "tokenURI",
				args: [Number(tokenId)],
			});
			auctionsData[i].tokenURI = tokenURI;
			if (tokenURI.includes("ipfs://")) {
				const url = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
				const metadata = await axios.get(url);
				auctionsData[i].metadata = metadata.data;
				try {
					if (metadata.data.image.includes("ipfs://")) {
						const image = metadata.data.image.replace(
							"ipfs://",
							"https://ipfs.io/ipfs/"
						);
						auctionsData[i].metadata.image = image;
					}
				} catch (e) {
					console.log(e);
				}
			} else {
				const metadata = await axios.get(tokenURI);
				auctionsData[i].metadata = metadata.data;
			}
			auctionsData[i].price = price;
			auctionsData[i].owner = owner;
			auctionsData[i].nftAddress = nftAddress;
			auctionsData[i].tokenId = tokenId;
			auctionsData[i].seller = owner;
			auctionsData[i].owner = owner;
			auctionsData[i].listingId = listingId;
			auctionsData[i].type = "auction";
			auctionsData[i].bids = auctionsData[i].bids;
			auctionsData[i].totalBids = Number(auctionsData[i].totalBids);
			nfts.push(auctionsData[i]);
		}

		return nfts;
	};

	const buyToken = async (listingId, nft) => {
		const client = createWalletClient({
			chain: polygonMumbai,
			transport: http(),
		}).extend(publicActions);
		const { hash } = await writeContract({
			address: NFTMarketplaceAddress,
			abi: NFTMarketplaceABI,
			functionName: "buyFromListing",
			args: [listingId],
			value: ethers.utils.parseEther(nft.price),
		});
		await client.waitForTransactionReceipt({
			hash: hash,
		});

		alert("NFT Bought Successfully");
		return hash;
	};

	const endAuction = async (auctionId) => {
		try {
			const client = createWalletClient({
				chain: polygonMumbai,
				transport: http(),
			}).extend(publicActions);
			const { hash } = await writeContract({
				address: NFTMarketplaceAddress,
				abi: NFTMarketplaceABI,
				functionName: "endAuction",
				args: [auctionId],
			});
			await client.waitForTransactionReceipt({
				hash: hash,
			});

			alert("NFT Bought Successfully");
			return hash;
		} catch (e) {
			console.log(e);
			alert("Try Again!! Something went wrong.");
		}
	};
	const createMarketSale = async (tokenId) => {
		const nft = nfts.find((nft) => Number(nft.tokenId) === Number(tokenId));
		const { hash } = await writeContract({
			address: NFTMarketplaceAddress,
			abi: NFTMarketplaceABI,
			functionName: "createMarketSale",
			args: [tokenId],
			value: (Number(nft.price) * 10 ** 18).toString(),
		});
		return hash;
	};

	const getSingleNFT = async (tokenId) => {
		const nft = nfts.find((nft) => Number(nft.tokenId) === Number(tokenId));
		return nft;
	};

	const fetchMyNFTs = async (address) => {
		const data = await readContract({
			address: NFTMarketplaceAddress,
			abi: NFTMarketplaceABI,
			functionName: "fetchMyNFTs",
			args: [address],
		});
		const nfts = [];
		for (let i = 0; i < data.length; i++) {
			const tokenURI = await readContract({
				address: NFTMarketplaceAddress,
				abi: NFTMarketplaceABI,
				functionName: "tokenURI",
				args: [Number(data[i].tokenId)],
			});
			data[i].tokenURI = tokenURI;
			nfts.push(data[i]);
		}
		return nfts;
	};
	const fetchItemsListed = async (address) => {
		const data = await readContract({
			address: NFTMarketplaceAddress,
			abi: NFTMarketplaceABI,
			functionName: "fetchItemsListed",
			args: [address],
		});
		// return data;
		const nfts = [];
		for (let i = 0; i < data.length; i++) {
			const tokenURI = await readContract({
				address: NFTMarketplaceAddress,
				abi: NFTMarketplaceABI,
				functionName: "tokenURI",
				args: [Number(data[i].tokenId)],
			});
			data[i].tokenURI = tokenURI;
			nfts.push(data[i]);
		}
		return nfts;
	};

	return (
		<MarketplaceContext.Provider
			value={{
				createToken,
				createMarketSale,
				fetchMarketPlaceItems,
				fetchMyNFTs,
				fetchItemsListed,
				nfts,
				getSingleNFT,
				address,
				buyToken,
				getUserNFTs,
				userNfts,
				listNFT,
				bidOnAuction,
				createAunction,
				endAuction,
			}}
		>
			{children}
		</MarketplaceContext.Provider>
	);
};
