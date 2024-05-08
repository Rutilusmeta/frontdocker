import React, { useEffect, useState, useRef } from 'react'
import { Link, useParams } from 'react-router-dom';
import image from '../../assets/images/items/3.gif';
import Navbar from '../../components/navbar'
import Footer from '../../components/footer'
import Switcher from '../../components/switcher';
import { data } from '../../data/data';
import {IoMdClose,BsExclamationOctagon} from "../../assets/icons/vander"
import misc from "../../constants/misc";
import urls from '../../constants/urls';
import axios from 'axios'; // Import axios for HTTP requests
//import UserContext from '../../contexts/UserContext';
import { useNFTMarketplace } from '../../contexts/NFTMarketplaceContext';

export default function ItemDetail() 
{
    const params = useParams();
    const id = params.id
    const creater = data.find((creatorr) => creatorr.id === parseInt (id));

    const [activeIndex, setIndex] = useState(0);
    const [placeBid , setPlaceBid] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [itemSoldMsg, setItemSoldMsg] = useState('');
    const [buyNow, setBuyNow] =  useState(false);
    const { getMarketItem, formatPrice, buyMarketItem, connectWallet } = useNFTMarketplace();
    const initialized = useRef(false);
    const [marketItem, setMarketItem] = useState(false);

    useEffect(() => 
    {
        document.documentElement.classList.add('dark');
        if (/*userInfo &&*/ !initialized.current) 
        {
            initialized.current = true;
            getMarketItem(id)
                .then(item => {
                    return axios.get(item.tokenURI)
                        .then(response => {
                            const { name, description, image } = response.data;
                            const etherPrice = formatPrice(item.price);
                            const updatedItem = {
                                ...item,
                                name,
                                description,
                                image,
                                etherPrice
                            };
                            //setMarketItem(updatedItem);
                            return updatedItem;
                        }).catch(error => {
                            console.error('Error fetching market item:', error);
                        });

                }).then(updatedItem => {
                    return axios.get(process.env.REACT_APP_API_ADDRESS + '/listing/' + updatedItem.tokenId)
                        .then(response => {
                            const { art_name, avatar, sid } = response.data.result.data;
                            updatedItem.art_name = art_name;
                            updatedItem.avatar = avatar;
                            updatedItem.sid = sid;
                            console.log(updatedItem);
                            setMarketItem(updatedItem);
                        }).catch(error => {
                            console.error('Error fetching additional data:', error);
                        });
                })
                .catch(error => {
                    console.error('Error fetching market item:', error);
                });
        }
    }, [getMarketItem]);

    const buyMarketItemHandler = async (tokenId) => 
    {
        setItemSoldMsg('');
        const accounts = await connectWallet();
        if (marketItem.seller.toLowerCase() === accounts[0].toLowerCase())
        {
            alert("You already alrady selling this item");
            return;
        }
        try
        {
            const result = await buyMarketItem(tokenId, marketItem.etherPrice);
            if (result)
            {
                setItemSoldMsg(`Congratulations, you can now go to <a href="${urls.user_nfts}" style="color: blue;">my nft page</a>.`);
            }
        }
        catch (error) 
        {
            console.error("Error creating market item", error);
        }
	};

    return (
        <>
            <Navbar />
            <section className="relative pt-28 md:pb-24 pb-16">
                <div className="container">
                {marketItem && (
                    <div className="grid lg:grid-cols-12 md:grid-cols-2 grid-cols-1 gap-[30px]">
                        <div className="lg:col-span-5">
                            <img src={marketItem.image} className="rounded-md shadow dark:shadow-gray-700" alt="" />

                            <div className="bg-gray-50 dark:bg-slate-800 rounded-md shadow dark:shadow-gray-800 mt-[30px] p-6">
                                <div>
                                    <span className="font-medium text-slate-400 block mb-1">Contract Address</span>
                                    <Link to="#" className="font-medium text-violet-600 underline block">{process.env.REACT_APP_CONTRACT_PROXY_ADDRESS}</Link>
                                </div>

                                <div className="mt-4">
                                    <span className="font-medium text-slate-400 block mb-1">Token ID</span>
                                    <span className="font-medium block">#{marketItem.tokenId.toString()}</span>
                                </div>

                                <div className="mt-4">
                                    <span className="font-medium text-slate-400 block mb-1">Blockchain</span>
                                    <span className="font-medium block">ETH</span>
                                </div>

                                {/*<div className="mt-4">
                                    <span className="font-medium text-slate-400 block mb-1">Deposit & Withdraw</span>
                                    <span className="font-medium block">Unsupported</span>
                                </div>*/}
                            </div>
                        </div>

                        <div className="lg:col-span-7 lg:ms-8">
                            <h5 className="md:text-2xl text-xl font-semibold">{marketItem.name} (#{marketItem.tokenId.toString()})</h5>

                            {/*<span className="font-medium text-slate-400 block mt-2">From this collection: <Link to="/creator-profile" className="text-violet-600">{creater?.subtext ? creater?.subtext : "@FunnyGuy"}</Link></span>*/}

                            <p className="text-slate-400 mt-4">{marketItem.description}</p>
                           {/*<p className="text-slate-400 mt-4">What does it mean? Biomechanics is the study of the structure, function and motion of the mechanical aspects of biological systems, at any level from whole organisms to organs, cells and cell organelles, using the methods of mechanics. Biomechanics is a branch of biophysics.</p>*/}

                            <div className="mt-4">
                                <span className="text-lg font-medium text-slate-400 block">Market Price</span>
                                {/*<span className="tmd:text-2xl text-xl font-semibold block mt-2"><i className="mdi mdi-ethereum"></i> 3.5 ETH = $ 4,659.75</span>*/}
                                <span className="tmd:text-2xl text-xl font-semibold block mt-2"><i className="mdi mdi-ethereum"></i>{marketItem.etherPrice} {misc.currency}</span>
                            </div>

                            <div className="mt-6">
                                {/*<Link to="#" onClick={()=> setPlaceBid(!placeBid)} className="btn rounded-full bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white"><i className="mdi mdi-gavel"></i> Bid Now</Link>*/}
                                <Link to="#" onClick={() => buyMarketItemHandler(marketItem.tokenId)} className="btn rounded-full bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white ms-1"><i className="mdi mdi-lightning-bolt"></i> Buy Now</Link>
                                {itemSoldMsg && (
                                    <div dangerouslySetInnerHTML={{ __html: itemSoldMsg }} />
                                )}
                            </div>

                            <div className="md:flex p-6 bg-gray-50 dark:bg-slate-800 rounded-lg shadow dark:shadow-gray-700 mt-6">
                                <div className="md:w-1/2">
                                    <div className="flex items-center">
                                        <div className="relative inline-block">
                                            <img src={marketItem.avatar} className="h-16 rounded-md" alt="" />
                                            {/*<i className="mdi mdi-check-decagram text-emerald-600 text-lg absolute -top-2 -end-2"></i>*/}
                                        </div>

                                        <div className="ms-3">
                                            <Link to={`/creator-profile/${marketItem.sid}`} className="font-semibold block hover:text-violet-600">{marketItem.art_name}</Link>
                                            <span className="text-slate-400 text-[16px] block mt-1">Seller</span>
                                        </div>
                                    </div>
                                </div>

                                {/*<div className="md:w-1/2 md:mt-0 mt-4">
                                    <div className="flex items-center">
                                        <div className="relative inline-block">
                                            <img src={creater?.avatar ? creater?.avatar : image} className="h-16 rounded-md" alt="" />
                                            <i className="mdi mdi-check-decagram text-emerald-600 text-lg absolute -top-2 -end-2"></i>
                                        </div>

                                        <div className="ms-3">
                                            <Link to="/creator-profile" className="font-semibold block hover:text-violet-600">{creater?.name ? creater?.name :"Michael Williams"}</Link>
                                            <span className="text-slate-400 text-[16px] block mt-1">Owner</span>
                                        </div>
                                    </div>
                                </div>*/}
                            </div>

                            {/*<div className="grid grid-cols-1 mt-8">
                                <ul className="md:w-fit w-full flex-wrap justify-center text-center p-3 bg-white dark:bg-slate-900 shadow dark:shadow-gray-800 rounded-md" id="myTab" data-tabs-toggle="#StarterContent" role="tablist">
                                    <li role="presentation" className="md:inline-block block md:w-fit w-full">
                                        <button className={`px-6 py-2 font-semibold rounded-md w-full transition-all duration-500 ease-in-out ${activeIndex === 0 ? 'text-white bg-violet-600' : ''}`} id="wednesday-tab" data-tabs-target="#wednesday" type="button" role="tab" aria-controls="wednesday" aria-selected="true"
                                            onClick={() => setIndex(0)}
                                        >Bids</button>
                                    </li>
                                    <li role="presentation" className="md:inline-block block md:w-fit w-full">
                                        <button className={`px-6 py-2 font-semibold rounded-md w-full transition-all duration-500 ease-in-out ${activeIndex === 1 ? 'text-white bg-violet-600' : ''}`} id="thursday-tab" data-tabs-target="#thursday" type="button"
                                            onClick={() => setIndex(1)}
                                            role="tab" aria-controls="thursday" aria-selected="false">Activity</button>
                                    </li>
                                </ul>

                                <div id="StarterContent" className="mt-6">
                                    <div className="" id="wednesday" role="tabpanel" aria-labelledby="wednesday-tab">
                                        {
                                            activeIndex === 0 ? (
                                                <div className="grid grid-cols-1">
                                                    <div className="flex items-center">
                                                        <div className="relative inline-block">
                                                            <img src={image3} className="h-16 rounded-md" alt="" />
                                                            <i className="mdi mdi-check-decagram text-emerald-600 text-lg absolute -top-2 -end-2"></i>
                                                        </div>

                                                        <div className="ms-3">
                                                            <h6 className="font-semibold">2 WETH <span className="text-slate-400">by</span> <Link to="#" className="hover:text-violet-600 duration-500 ease-in-out">0xe849fa28a...ea14</Link></h6>
                                                            <span className="text-slate-400 text-[16px]">6 hours ago</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center mt-4">
                                                        <div className="relative inline-block">
                                                            <img src={image4} className="h-16 rounded-md" alt="" />
                                                            <i className="mdi mdi-check-decagram text-emerald-600 text-lg absolute -top-2 -end-2"></i>
                                                        </div>

                                                        <div className="ms-3">
                                                            <h6 className="font-semibold">0.001 WETH <span className="text-slate-400">by</span> <Link to="#" className="hover:text-violet-600 duration-500 ease-in-out">VOTwear</Link></h6>
                                                            <span className="text-slate-400 text-[16px]">6 hours ago</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center mt-4">
                                                        <div className="relative inline-block">
                                                            <img src={image5} className="h-16 rounded-md" alt="" />
                                                            <i className="mdi mdi-check-decagram text-emerald-600 text-lg absolute -top-2 -end-2"></i>
                                                        </div>

                                                        <div className="ms-3">
                                                            <h6 className="font-semibold">1.225 WETH <span className="text-slate-400">by</span> <Link to="#" className="hover:text-violet-600 duration-500 ease-in-out">PandaOne</Link></h6>
                                                            <span className="text-slate-400 text-[16px]">6 hours ago</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) :
                                                (
                                                    <div className="grid grid-cols-1">
                                                        <div className="flex items-center">
                                                            <div className="relative inline-block">
                                                                <img src={image6} className="h-20 rounded-md" alt="" />
                                                                <i className="mdi mdi-check-decagram text-emerald-600 text-lg absolute -top-2 -end-2"></i>
                                                            </div>

                                                            <span className="content ms-3">
                                                                <Link to="#" className="hover:text-violet-600 font-semibold block">Digital Art Collection</Link>
                                                                <span className="text-slate-400 block text-[16px] mt-1">Started Following <Link to="#" className="font-semibold hover:text-violet-600">@Panda</Link></span>

                                                                <span className="text-slate-400 block text-[16px]">1 hours ago</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                )
                                        }

                                    </div>


                                </div>
                            </div>*/}
                        </div>
                    </div> )}
                </div>
                <div className={`fixed z-50 overflow-hidden inset-0 m-auto justify-center items-center flex bg-gray-900 bg-opacity-50 dark:bg-opacity-80 ${placeBid ? "" : "hidden" }`}>
                <div className="relative w-full h-auto max-w-md p-4">
                    <div className="relative bg-white dark:bg-slate-900 rounded-lg shadow dark:shadow-gray-800">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                            <h5 className="text-xl font-semibold">Place a Bid</h5>
                            <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-lg p-1.5 ms-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" >
                                <IoMdClose onClick={()=> setPlaceBid(!placeBid)}/>
                            </button>
                        </div>
                        <div className="p-6">
                            <form className="text-start">
                                <div className="grid grid-cols-1">
                                    <div className="mb-4">
                                        <label className="font-semibold" >Your Bid Price:</label>
                                        <input name="etherium" id="number" type="number" className="form-input w-full text-[15px] py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-full outline-none border border-gray-200 focus:border-violet-600 dark:border-gray-800 dark:focus:border-violet-600 focus:ring-0 mt-3" placeholder="00.00 ETH" />
                                    </div>

                                    <div className="mb-4">
                                        <label className="font-semibold" >Enter Your QTY:</label>
                                        <input name="quantity" id="number2" type="number" className="form-input w-full text-[15px] py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-full outline-none border border-gray-200 focus:border-violet-600 dark:border-gray-800 dark:focus:border-violet-600 focus:ring-0 mt-3" placeholder="0"/>
                                        <span className="text-slate-400 text-sm"><span className="text-slate-900 dark:text-white mt-1">Note:</span> Max. Qty 5</span>
                                    </div>
                                </div>
                            </form>

                            <div className="pt-4 border-t dark:border-t-gray-800">
                                <div className="flex justify-between">
                                    <p className="font-semibold text-sm"> You must bid at least:</p>
                                    <p className="text-sm text-violet-600 font-semibold"> 1.22 ETH </p>
                                </div>
                                <div className="flex justify-between mt-1">
                                    <p className="font-semibold text-sm"> Service free:</p>
                                    <p className="text-sm text-violet-600 font-semibold"> 0.05 ETH </p>
                                </div>
                                <div className="flex justify-between mt-1">
                                    <p className="font-semibold text-sm"> Total bid amount:</p>
                                    <p className="text-sm text-violet-600 font-semibold"> 1.27 ETH </p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <Link to="#" data-modal-toggle="NftBid" className="btn rounded-full bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white w-full"><i className="mdi mdi-gavel"></i> Place a Bid</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div  className={`fixed z-50 overflow-hidden inset-0 m-auto justify-center items-center flex bg-gray-900 bg-opacity-50 dark:bg-opacity-80 ${buyNow ? "" :"hidden"}`}>
                <div className="relative w-full h-auto max-w-md p-4">
                    <div className="relative bg-white dark:bg-slate-900 rounded-lg shadow dark:shadow-gray-800">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                            <h5 className="text-xl font-semibold">Checkout</h5>
                            <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-lg p-1.5 ms-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" >
                                <IoMdClose  onClick={() => setBuyNow(!buyNow)}/>
                            </button>
                        </div>
                        <div className="p-6">
                            <form className="text-start">
                                <div className="grid grid-cols-1">
                                    <div className="mb-4">
                                        <label className="font-semibold" >Your Price:</label>
                                        <input name="etherium" id="number3" type="number" className="form-input w-full text-[15px] py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-full outline-none border border-gray-200 focus:border-violet-600 dark:border-gray-800 dark:focus:border-violet-600 focus:ring-0 mt-3" placeholder="00.00 ETH" />
                                    </div>
                                </div>
                            </form>

                            <div className="pt-4 border-t dark:border-t-gray-800">
                                <div className="flex justify-between">
                                    <p className="font-semibold text-sm"> You must bid at least:</p>
                                    <p className="text-sm text-violet-600 font-semibold"> 1.22 ETH </p>
                                </div>
                                <div className="flex justify-between mt-1">
                                    <p className="font-semibold text-sm"> Service free:</p>
                                    <p className="text-sm text-violet-600 font-semibold"> 0.05 ETH </p>
                                </div>
                                <div className="flex justify-between mt-1">
                                    <p className="font-semibold text-sm"> Total bid amount:</p>
                                    <p className="text-sm text-violet-600 font-semibold"> 1.27 ETH </p>
                                </div>
                            </div>

                            <div className="flex items-center p-4 bg-red-600/10 text-red-600 mt-4 rounded-lg">
                                <BsExclamationOctagon className="text-3xl"/>

                                <div className="ms-2">
                                    <span className="block font-semibold">This creator is not verified</span>
                                    <span className="block">Purchase this item at your own risk</span>
                                </div>
                            </div>

                            <div className="mt-4">
                                <Link to="#" className="btn rounded-full bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white w-full"><i className="mdi mdi-lightning-bolt"></i> Buy Now</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </section>
            <Footer />
            <Switcher />
        </>
    )
}
