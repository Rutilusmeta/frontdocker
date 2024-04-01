import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios for HTTP requests
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "../assets/icons/vander";
import { useNFTMarketplace } from '../contexts/NFTMarketplaceContext';


export default function ItemsGrid(props) {

    const { title, description, pagination } = props;
    const [marketItems, setMarketItems] = useState([]); // State to hold fetched market items
    const { getMarketItems } = useNFTMarketplace();
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            getMarketItems()
                .then(items => {
                    return Promise.all(items.map(item => {
                        return axios.get(item.tokenURI)
                            .then(response => {
                                const { name, description, image } = response.data;
                                return {
                                    ...item,
                                    name,
                                    description,
                                    image
                                };
                            });
                    }));
                })
                .then(updatedItems => {
                    setMarketItems(updatedItems);
                })
                .catch(error => {
                    console.error('Error fetching market items:', error);
                });
        }
        document.documentElement.classList.add('dark');
    }, [getMarketItems]);

    return (
        <>
            <div className={`container ${title !== undefined ? 'md:mt-24 mt-16' : ''}`}>
                <div className="grid grid-cols-1 text-center">
                    <h3 className="mb-4 md:text-3xl text-2xl md:leading-snug leading-snug font-semibold">{title}</h3>
                    <p className="text-slate-400 max-w-xl mx-auto">{description}</p>
                </div>

                {marketItems.length === 0 ? (
                    <p style={{ textAlign: 'center' }}>No data found</p>
                ) : (
                    <div className={`grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[30px] ${title !== undefined ? 'mt-12' : ''}`}>
                        {marketItems.map((item, index) => (
                            <div key={index} className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-lg p-3 shadow hover:shadow-md dark:shadow-gray-800 dark:hover:shadow-gray-800 hover:scale-105 ease-in-out duration-500">
                                <img src={item.image} className="rounded-lg" alt="" />
                                <div className="relative p-4 -mt-14">
                                    <div className="relative inline-block">
                                        <img src={item.avatar} className="h-16 rounded-md shadow-md dark:shadow-gray-800" alt="" />
                                        <i className="mdi mdi-check-decagram text-emerald-600 text-2xl absolute -bottom-3 -end-2"></i>
                                    </div>
                                    <div className="mt-3">
                                        <Link to="/explore-one" className="font-semibold block text-[18px] hover:text-violet-600">{item.title}</Link>
                                        <span className="text-slate-400 mt-1 text-sm"><span className="italic">by</span> <Link to={`/creator-profile/${item.id}`} className="text-violet-600 font-medium">{item.subtext}</Link></span>
                                        <span className="text-slate-400 block text-[16px] mt-1">25 Items</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {pagination ?
                    <div className="grid md:grid-cols-12 grid-cols-1 mt-8">
                        <div className="md:col-span-12 text-center">
                            <nav>
                                <ul className="inline-flex items-center -space-x-px">
                                    <li>
                                        <Link to="#" className="w-10 h-10 inline-flex justify-center items-center mx-1 rounded-full text-slate-400 bg-white dark:bg-slate-900 hover:text-white shadow-sm dark:shadow-gray-700 hover:border-violet-600 dark:hover:border-violet-600 hover:bg-violet-600 dark:hover:bg-violet-600">
                                            <MdKeyboardArrowLeft className="text-[20px]" />
                                        </Link>
                                    </li>
                                    {/* Pagination links */}
                                </ul>
                            </nav>
                        </div>
                    </div> : ""}
            </div>
        </>
    );
}
