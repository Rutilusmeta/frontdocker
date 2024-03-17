import React, { useEffect, useState } from 'react'

import logo_icon_28 from '../assets/images/logo-icon-28.png';
import logo_dark from '../assets/images/logo-dark.png';
import logo_white from '../assets/images/logo-white.png';
import image from '../assets/images/client/05.jpg';
import { Link } from "react-router-dom";
import {LuSearch, PiWalletBold, AiOutlineCopy, AiOutlineUser, LuSettings, LiaSignOutAltSolid} from "../assets/icons/vander"

import { Web3 } from "web3";

import { useEthereum, useConnect, useAuthCore } from '@particle-network/auth-core-modal';
import { EthereumGoerli } from '@particle-network/chains';

export default function Navbar() {
    const [isDropdown, openDropdown] = useState(true);
    const [isOpen, setMenu] = useState(true);

    const { provider } = useEthereum(); // For provider retrieval
    window.web3 = new Web3(provider);
    const { connect, disconnect } = useConnect(); // For facilitating social logins
    const { userInfo } = useAuthCore(); // For retrieving user information


    useEffect(() => {
        activateMenu();
    });

    /*if (userInfo) {
        console.log(userInfo);
        console.log("AJA");
    }*/

    const handleLogin = async () => {
        try {
            if (!userInfo) {
                await connect({
                    //chain: EthereumGoerli,
                });
            }
        } catch (error) {
            if (error.code === 4011) {
                // Handle the case where the user cancels the operation
                console.log("User canceled the operation");
                // Add your handling logic here
            } else {
                // Handle other types of errors
                console.error("Error:", error);
                // Add your error handling logic here
            }
        }
    };

    const handleLogout = async () => {
        await disconnect();
        window.location.reload();
    };

    window.addEventListener("scroll", windowScroll);
    function windowScroll() {
        const navbar = document.getElementById("topnav");
        if (
            document.body.scrollTop >= 50 ||
            document.documentElement.scrollTop >= 50
        ) {
            if (navbar !== null) {
                navbar?.classList.add("nav-sticky");
            }
        } else {
            if (navbar !== null) {
                navbar?.classList.remove("nav-sticky");
            }
        }

        const mybutton = document.getElementById("back-to-top");
        if (mybutton != null) {
            if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
                mybutton.classList.add("flex");
                mybutton.classList.remove("hidden");
            } else {
                mybutton.classList.add("hidden");
                mybutton.classList.remove("flex");
            }
        }
    }

    const toggleMenu = () => {
        setMenu(!isOpen)
        if (document.getElementById("navigation")) {
            const anchorArray = Array.from(document.getElementById("navigation").getElementsByTagName("a"));
            anchorArray.forEach(element => {
                element.addEventListener('click', (elem) => {
                    const target = elem.target.getAttribute("href")
                    if (target !== "") {
                        if (elem.target.nextElementSibling) {
                            var submenu = elem.target.nextElementSibling.nextElementSibling;
                            submenu.classList.toggle('open');
                        }
                    }
                })
            });
        }
    }

    const getClosest = (elem, selector) => {

        // Element.matches() polyfill
        if (!Element.prototype.matches) {
            Element.prototype.matches =
                Element.prototype.matchesSelector ||
                Element.prototype.mozMatchesSelector ||
                Element.prototype.msMatchesSelector ||
                Element.prototype.oMatchesSelector ||
                Element.prototype.webkitMatchesSelector ||
                function (s) {
                    var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                        i = matches.length;
                    while (--i >= 0 && matches.item(i) !== this) { }
                    return i > -1;
                };
        }

        // Get the closest matching element
        for (; elem && elem !== document; elem = elem.parentNode) {
            if (elem.matches(selector)) return elem;
        }
        return null;

    };
    const activateMenu = () => {
        var menuItems = document.getElementsByClassName("sub-menu-item");
        if (menuItems) {

            var matchingMenuItem = null;
            for (var idx = 0; idx < menuItems.length; idx++) {
                if (menuItems[idx].href === window.location.href) {
                    matchingMenuItem = menuItems[idx];
                }
            }

            if (matchingMenuItem) {
                matchingMenuItem.classList.add('active');


                var immediateParent = getClosest(matchingMenuItem, 'li');

                if (immediateParent) {
                    immediateParent.classList.add('active');
                }

                var parent = getClosest(immediateParent, '.child-menu-item');
                if (parent) {
                    parent.classList.add('active');
                }

                var parent = getClosest(parent || immediateParent, '.parent-menu-item');

                if (parent) {
                    parent.classList.add('active');

                    var parentMenuitem = parent.querySelector('.menu-item');
                    if (parentMenuitem) {
                        parentMenuitem.classList.add('active');
                    }

                    var parentOfParent = getClosest(parent, '.parent-parent-menu-item');
                    if (parentOfParent) {
                        parentOfParent.classList.add('active');
                    }
                } else {
                    var parentOfParent = getClosest(matchingMenuItem, '.parent-parent-menu-item');
                    if (parentOfParent) {
                        parentOfParent.classList.add('active');
                    }
                }
            }
        }
    }

    const metamask = async () => {
        try {
            //Basic Actions Section
            const onboardButton = document.getElementById('connectWallet')

            //   metamask modal
            const modal = document.getElementById('modal-metamask')
            const closeModalBtn = document.getElementById('close-modal')

            //   wallet address
            const myPublicAddress = document.getElementById('myPublicAddress')

            //Created check function to see if the MetaMask extension is installed
            const isMetaMaskInstalled = () => {
                //Have to check the ethereum binding on the window object to see if it's installed
                const { ethereum } = window
                return Boolean(ethereum && ethereum.isMetaMask)
            }

            const onClickConnect = async () => {
                if (!isMetaMaskInstalled()) {
                    //meta mask not installed
                    modal.classList.add('show')
                    modal.style.display = 'block'
                    return
                }
                try {
                    // eslint-disable-next-line no-undef
                    await ethereum.request({ method: 'eth_requestAccounts' })
                    // eslint-disable-next-line no-undef
                    const accounts = await ethereum.request({ method: 'eth_accounts' })
                    myPublicAddress.innerHTML =
                        accounts[0].split('').slice(0, 6).join('') +
                        '...' +
                        accounts[0]
                            .split('')
                            .slice(accounts[0].length - 7, accounts[0].length)
                            .join('')
                } catch (error) {
                    console.error(error)
                }
            }

            const closeModal = () => {
                modal.classList.remove('show')
                modal.style.display = 'none'
            }

            if (isMetaMaskInstalled()) {
                // eslint-disable-next-line no-undef
                const accounts = await ethereum.request({ method: 'eth_accounts' })
                if (!!accounts[0]) {
                    myPublicAddress.innerHTML =
                        accounts[0].split('').slice(0, 6).join('') +
                        '...' +
                        accounts[0]
                            .split('')
                            .slice(accounts[0].length - 7, accounts[0].length)
                            .join('')
                }
            }

            onboardButton.addEventListener('click', onClickConnect)
            closeModalBtn.addEventListener('click', closeModal)
        } catch (error) { }
    }

    return (
        <>
            <nav id="topnav" className="defaultscroll is-sticky">
                <div className="container">
                    {/* <!-- Logo container--> */}
                    <Link className="logo ps-0" to="/">
                        <img src={logo_icon_28} className="inline-block sm:hidden" alt="" />
                        <div className="sm:block hidden">
                            <img src={logo_dark} className="inline-block dark:hidden h-7" alt="" />
                            <img src={logo_white} className="hidden dark:inline-block h-7" alt="" />
                        </div>
                    </Link>

                    <div className="menu-extras">
                        <div className="menu-item">
                            {/* <!-- Mobile menu toggle--> */}
                            <Link to="#" className="navbar-toggle" id="isToggle" onClick={toggleMenu}>
                                <div className="lines">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* <!--Login button Start--> */}
                    <ul className="buy-button list-none mb-0">

                        {/*<li className="inline-block mb-0">
                            <div className="form-icon relative">
                                <LuSearch className="text-lg absolute top-1/2 -translate-y-1/2 start-3"/>
                                <input type="text" className="form-input sm:w-44 w-28 ps-10 py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-3xl outline-none border border-gray-200 focus:border-violet-600 dark:border-gray-800 dark:focus:border-violet-600 focus:ring-0 bg-white" name="s" id="searchItem" placeholder="Search..." />
                            </div>
                        </li>

                        <li className="inline-block ps-1 mb-0">
                            <Link to="#" onClick={metamask} id="connectWallet" className="btn btn-icon rounded-full bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white"><PiWalletBold/></Link>
                        </li>*/}

                        <li className="dropdown inline-block relative ps-1">
                            {!userInfo ? (
                                <button onClick={() => handleLogin()} className="btn bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white rounded-full" type="button">
                                    Login
                                </button>
                             ) : (
                                <button onClick={() => openDropdown(!isDropdown)} data-dropdown-toggle="dropdown" className="dropdown-toggle btn btn-icon rounded-full bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white inline-flex" type="button">
                                    <img src={image} className="rounded-full" alt="" />
                                </button>
                            )}
                            <div className={`dropdown-menu absolute end-0 m-0 mt-4 z-10 w-48 rounded-md overflow-hidden bg-white dark:bg-slate-900 shadow dark:shadow-gray-800 ${isDropdown ? 'hidden' : 'block'}`} >
                                <div className="relative">
                                    <div className="py-8 bg-gradient-to-tr from-violet-600 to-red-600"></div>
                                    <div className="absolute px-4 -bottom-7 start-0">
                                        <div className="flex items-end">
                                            <img src={image} className="rounded-full w-10 h-w-10 shadow dark:shadow-gray-700" alt="" />

                                            <span className="font-semibold text-[15px] ms-1">Jenny Jimenez</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 px-4">
                                    <h5 className="font-semibold text-[15px]">Wallet:</h5>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[13px] text-slate-400">qhut0...hfteh45</span>
                                        <Link to="#" className="text-violet-600"><AiOutlineCopy/></Link>
                                    </div>
                                </div>

                                <div className="mt-4 px-4">
                                    <h5 className="text-[15px]">Balance: <span className="text-violet-600 font-semibold">0.00045ETH</span></h5>
                                </div>

                                <ul className="py-2 text-start">
                                    <li>
                                        <Link to="/creator-profile" className="inline-flex items-center text-[14px] font-semibold py-1.5 px-4 hover:text-violet-600"><AiOutlineUser className="text-[16px] align-middle me-1"/> Profile</Link>
                                    </li>
                                    <li>
                                        <Link to="/creator-profile-edit" className="inline-flex items-center text-[14px] font-semibold py-1.5 px-4 hover:text-violet-600"><LuSettings className="text-[16px] align-middle me-1"/> Settings</Link>
                                    </li>
                                    <li className="border-t border-gray-100 dark:border-gray-800 my-2"></li>
                                    <li>
                                        <Link onClick={() => handleLogout()} className="inline-flex items-center text-[14px] font-semibold py-1.5 px-4 hover:text-violet-600"><LiaSignOutAltSolid className="text-[16px] align-middle me-1"/> Logout</Link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>

                    <div id="navigation" className={`${isOpen === true ? 'hidden' : 'block'}`}>
                        <ul className="navigation-menu justify-end">
                            <li className="has-submenu parent-menu-item">
                                <Link to="#">Home</Link><span className="menu-arrow"></span>
                                <ul className="submenu">
                                    <li><Link to="/index" className="sub-menu-item">Home One</Link></li>
                                    <li><Link to="/index-two" className="sub-menu-item">Home Two</Link></li>
                                    <li><Link to="/index-three" className="sub-menu-item">Home Three</Link></li>
                                    <li><Link to="/index-four" className="sub-menu-item">Home Four <span className="bg-gray-50 dark:bg-slate-800 text-[10px] shadow shadow-gray-300 dark:shadow-gray-700 font-bold px-2.5 py-0.5 rounded h-5 ms-1">Light</span></Link></li>
                                    <li><Link to="/index-five" className="sub-menu-item">Home Five <span className="bg-gray-50 dark:bg-slate-800 text-[10px] shadow shadow-gray-300 dark:shadow-gray-700 font-bold px-2.5 py-0.5 rounded h-5 ms-1">Light</span></Link></li>
                                    <li><Link to="/index-six" className="sub-menu-item">Home Six <span className="bg-gray-50 dark:bg-slate-800 text-[10px] shadow shadow-gray-300 dark:shadow-gray-700 font-bold px-2.5 py-0.5 rounded h-5 ms-1">Light</span></Link></li>
                                    <li><Link to="/index-seven" className="sub-menu-item">Home Seven </Link></li>
                                    <li><Link to="/index-eight" className="sub-menu-item">Home Eight <span className="bg-gray-50 dark:bg-slate-800 text-[10px] shadow shadow-gray-300 dark:shadow-gray-700 font-bold px-2.5 py-0.5 rounded h-5 ms-1">Light</span></Link></li>
                                    <li><Link to="/index-nine" className="sub-menu-item">Home Nine </Link></li>
                                    <li><Link to="/index-ten" className="sub-menu-item">Home Ten <span className="bg-gray-50 dark:bg-slate-800 text-[10px] shadow shadow-gray-300 dark:shadow-gray-700 font-bold px-2.5 py-0.5 rounded h-5 ms-1">Light</span></Link></li>
                                </ul>
                            </li>

                            <li className="has-submenu parent-parent-menu-item">
                                <Link to="#">Explore</Link><span className="menu-arrow"></span>
                                <ul className="submenu">
                                    <li><Link to="/explore-one" className="sub-menu-item"> Explore One</Link></li>
                                    <li><Link to="/explore-two" className="sub-menu-item"> Explore Two</Link></li>
                                    <li><Link to="/explore-three" className="sub-menu-item"> Explore Three</Link></li>
                                    <li><Link to="/auction" className="sub-menu-item">Live Auction</Link></li>
                                    <li><Link to="/item-detail" className="sub-menu-item"> Item Detail</Link></li>
                                    <li><Link to="/activity" className="sub-menu-item"> Activities</Link></li>
                                    <li><Link to="/collections" className="sub-menu-item">Collections</Link></li>
                                    <li><Link to="/upload-work" className="sub-menu-item">Upload Works</Link></li>
                                </ul>
                            </li>

                            <li><Link to="/wallet" className="sub-menu-item">Wallet</Link></li>

                            <li className="has-submenu parent-parent-menu-item">
                                <Link to="#">Pages</Link><span className="menu-arrow"></span>
                                <ul className="submenu">
                                    <li><Link to="/aboutus" className="sub-menu-item">About Us</Link></li>
                                    <li className="has-submenu parent-menu-item"><Link to="#"> Creator </Link><span className="submenu-arrow"></span>
                                        <ul className="submenu">
                                            <li><Link to="/creators" className="sub-menu-item"> Creators</Link></li>
                                            <li><Link to="/creator-profile" className="sub-menu-item"> Creator Profile</Link></li>
                                            <li><Link to="/creator-profile-edit" className="sub-menu-item"> Profile Edit</Link></li>
                                            <li><Link to="/become-creator" className="sub-menu-item"> Become Creator</Link></li>
                                        </ul>
                                    </li>
                                    <li className="has-submenu parent-menu-item"><Link to="#"> Blog </Link><span className="submenu-arrow"></span>
                                        <ul className="submenu">
                                            <li><Link to="/blogs" className="sub-menu-item"> Blogs</Link></li>
                                            <li><Link to="/blog-detail" className="sub-menu-item"> Blog Detail</Link></li>
                                        </ul>
                                    </li>
                                    <li className="has-submenu parent-menu-item"><Link to="#"> Auth Pages </Link><span className="submenu-arrow"></span>
                                        <ul className="submenu">
                                            <li><Link to="/login" className="sub-menu-item"> Login</Link></li>
                                            <li><Link to="/signup" className="sub-menu-item"> Signup</Link></li>
                                            <li><Link to="/reset-password" className="sub-menu-item"> Forgot Password</Link></li>
                                            <li><Link to="/lock-screen" className="sub-menu-item"> Lock Screen</Link></li>
                                        </ul>
                                    </li>
                                    <li className="has-submenu parent-menu-item"><Link to="#"> Special </Link><span className="submenu-arrow"></span>
                                        <ul className="submenu">
                                            <li><Link to="/comingsoon" className="sub-menu-item"> Coming Soon</Link></li>
                                            <li><Link to="/maintenance" className="sub-menu-item"> Maintenance</Link></li>
                                            <li><Link to="/error" className="sub-menu-item"> 404!</Link></li>
                                            <li><Link to="/thankyou" className="sub-menu-item"> Thank you</Link></li>
                                        </ul>
                                    </li>
                                    <li className="has-submenu parent-menu-item"><Link to="#"> Help Center </Link><span className="submenu-arrow"></span>
                                        <ul className="submenu">
                                            <li><Link to="/helpcenter-overview" className="sub-menu-item"> Overview</Link></li>
                                            <li><Link to="/helpcenter-faqs" className="sub-menu-item"> FAQs</Link></li>
                                            <li><Link to="/helpcenter-guides" className="sub-menu-item"> Guides</Link></li>
                                            <li><Link to="/helpcenter-support" className="sub-menu-item"> Support</Link></li>
                                        </ul>
                                    </li>
                                    <li><Link to="/terms" className="sub-menu-item">Terms Policy</Link></li>
                                    <li><Link to="/privacy" className="sub-menu-item">Privacy Policy</Link></li>
                                </ul>
                            </li>

                            <li><Link to="/contact" className="sub-menu-item">Contact</Link></li>
                        </ul>
                    </div>
                </div>
            </nav>

        </>
    )
}
