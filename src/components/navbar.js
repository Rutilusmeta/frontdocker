import React, { useEffect, useState, useRef, useContext, useCallback } from 'react'
import logo_icon_28 from '../assets/images/logo-icon-28.png';
import logo_dark from '../assets/images/logo-dark.png';
import logo_white from '../assets/images/logo-white.png';
import urls from '../constants/urls'
//import image from '../assets/images/client/05.jpg';
import { Link } from "react-router-dom";
import EnvDiv from './env-div';
import { PiWalletBold/*, AiOutlineCopy*/, AiOutlineUser, LuSettings, LiaSignOutAltSolid } from "../assets/icons/vander"
import { useConnect, useAuthCore } from '@particle-network/auth-core-modal';
import UserContext from '../contexts/UserContext';
import { useNFTMarketplace } from '../contexts/NFTMarketplaceContext';

export default function Navbar() 
{
    const { userData, checkUserData } = useContext(UserContext);
    const { getAccounts, getBalance } = useNFTMarketplace();
    const [isDropdown, openDropdown] = useState(true);
    const [isOpen, setMenu] = useState(true);
    const { connect, disconnect } = useConnect();
    const { userInfo } = useAuthCore();
    const [imageSrc, setImageSrc] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');
    const [addressBalance, setAddressBalance] = useState(0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const initialized = useRef(false);

    const isMetaMaskInstalled = () => 
    {
        return Boolean(window.ethereum && window.ethereum.isMetaMask);
    };

    const onClickConnect = async () => 
    {
        if (!isMetaMaskInstalled()) 
        {
            setIsModalOpen(true);
            return;
        }
        try 
        {
            const accounts = await getAccounts();
            setWalletAddress(accounts[0]);
            const balance = await getBalance(accounts[0]);
            setAddressBalance(balance);
            setIsDialogOpen(true);
        } 
        catch (error) 
        {
            console.error('Error fetching address balance from MetaMask:', error);
        }
    };

    const closeModal = () => 
    {
        setIsModalOpen(false);
    };

    const activateMenu = useCallback(() => {
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
    
                var childParent = getClosest(immediateParent, '.child-menu-item'); // Rename 'parent' to 'childParent'
                if (childParent) {
                    childParent.classList.add('active');
                }
    
                var parentItem = getClosest(childParent || immediateParent, '.parent-menu-item'); // Rename 'parent' to 'parentItem'
                if (parentItem) {
                    parentItem.classList.add('active');
    
                    var parentMenuItem = parentItem.querySelector('.menu-item');
                    if (parentMenuItem) {
                        parentMenuItem.classList.add('active');
                    }
    
                    var parentOfParent = getClosest(parentItem, '.parent-parent-menu-item');
                    if (parentOfParent) {
                        parentOfParent.classList.add('active');
                    }
                } else {
                    var parentOfParentItem = getClosest(matchingMenuItem, '.parent-parent-menu-item'); // Rename 'parentOfParent' to 'parentOfParentItem'
                    if (parentOfParentItem) {
                        parentOfParentItem.classList.add('active');
                    }
                }
            }
        }
    }, []);   
    
    useEffect(() => 
    {
        activateMenu();
        //console.log("NAVABR", userData, userInfo);
        if (userInfo && !initialized.current) 
        {
            //console.log("CHEKING NAVBAR", userData, userInfo);
            initialized.current = true;
            const result = checkUserData(userInfo);
            if (userData && userData.avatar && (userData.avatar.includes('http://') || userData.avatar.includes('https://'))) 
            {
                setImageSrc(userData.avatar); 
            }
            else if (userData && userData.avatar)
            {
                setImageSrc(`/avatar/${userData.avatar}`); 
            }
            else
            {
                setImageSrc(`/avatar/1.jpg`); 
            }
            if (!result)
            {
                alert("Some error occured trying to login, please contact support!");
                disconnect();
            }
        }
    }, [activateMenu, userInfo, checkUserData, userData, disconnect]);

    const handleLogin = async () => 
    {
        try 
        {
            if (!userInfo) 
            {
                await connect({});
            }
        } 
        catch (error) 
        {
            if (error.code === 4011) 
            {
                console.log("User canceled the operation");
            } 
            else 
            {
                console.error("Error:", error);
            }
        }
    };

    const handleLogout = async () => 
    {
        await disconnect();
        window.location.reload();
    };

    /*if (userInfo) {
        console.log(userInfo);
        console.log("AJA");
    }*/

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

    /*const metamask = async () => {
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
    }*/

    return (
        <>
            <nav id="topnav" className="defaultscroll is-sticky">

                <EnvDiv />
                
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
                        </li>*/}

                        <li className="inline-block ps-1 mb-0">
                            <button
                                onClick={onClickConnect}
                                className="btn btn-icon rounded-full bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white"
                            >
                                <PiWalletBold />
                            </button>
                        </li>

                        <div className={`fixed inset-0 z-10 overflow-y-auto ${isModalOpen ? 'block' : 'hidden'}`}>
                            <div className="flex items-center justify-center min-h-screen">
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                                <div className="relative bg-white rounded-lg max-w-lg w-full p-4">
                                    <h2 className="text-xl text-black font-semibold mb-4">Install MetaMask</h2>
                                    <p className="text-black">
                                        MetaMask is a digital wallet that allows you to interact with Ethereum decentralized applications (DApps) in your browser.
                                        <br />
                                        To use this application, you need to have MetaMask installed in your browser.
                                        <br />
                                        You can download MetaMask from <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">metamask.io</a>.
                                    </p>
                                    <button className="btn bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white rounded-full" onClick={() => setIsModalOpen(false)}>Close</button>
                                </div>
                            </div>
                        </div>

                        {/*<div id="myPublicAddress">{walletAddress}</div>*/}

                        <li className="dropdown inline-block relative ps-1">
                            {!userInfo ? (
                                <button onClick={() => handleLogin()} className="btn bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white rounded-full" type="button">
                                    Login
                                </button>
                            ) : (
                                <button onClick={() => openDropdown(!isDropdown)} data-dropdown-toggle="dropdown" className="dropdown-toggle btn btn-icon rounded-full bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white inline-flex" type="button">
                                    <img src={imageSrc} className="rounded-full" alt="" />
                                </button>
                            )}
                            <div className={`dropdown-menu absolute end-0 m-0 mt-4 z-10 w-48 rounded-md overflow-hidden bg-white dark:bg-slate-900 shadow dark:shadow-gray-800 ${isDropdown ? 'hidden' : 'block'}`} >
                                <div className="relative">
                                    <div className="py-8 bg-gradient-to-tr from-violet-600 to-red-600"></div>
                                    <div className="absolute px-4 -bottom-7 start-0">
                                        <div className="flex items-end">
                                            <img src={imageSrc} className="rounded-full w-10 h-w-10 shadow dark:shadow-gray-700" alt="" />
                                            {userData && (
                                             <span className="font-semibold text-[15px] ms-1">{userData.firstname}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                               {/*<div className="mt-10 px-4">
                                    <h5 className="font-semibold text-[15px]">Wallet:</h5>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[13px] text-slate-400">{walletAddress.slice(0, 6) + '...' + walletAddress.slice(-7)}</span>
                                        */}{/*<Link to="#" className="text-violet-600"><AiOutlineCopy/></Link>*/}
                                    {/* </div>
                                </div>

                                <div className="mt-4 px-4">
                                    <h5 className="text-[15px]">Balance: <span className="text-violet-600 font-semibold">{addressBalance}</span></h5>
                                </div>*/}

                                {/*<ul className="py-2 text-start">*/}
                                <ul className="mt-10 px-4">
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
                            <li><Link to="/index-seven" className="sub-menu-item">Home</Link></li>
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
                                    {/*<li><Link to="/upload-work" className="sub-menu-item">Upload Works</Link></li>*/}
                                </ul>
                            </li>
                            <li className="has-submenu parent-parent-menu-item">
                                <Link to="#">Pages</Link><span className="menu-arrow"></span>
                                <ul className="submenu">
                                    <li><Link to="/aboutus" className="sub-menu-item">About Us</Link></li>
                                    <li className="has-submenu parent-menu-item"><Link to="#"> Creator </Link><span className="submenu-arrow"></span>
                                        <ul className="submenu">
                                            <li><Link to="/creators" className="sub-menu-item"> Creators</Link></li>
                                            <li><Link to="/creator-profile" className="sub-menu-item"> Creator Profile</Link></li>
                                            <li><Link to="/creator-profile-edit" className="sub-menu-item"> Profile Edit</Link></li>
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
                                    <li><Link to={urls.terms} className="sub-menu-item">Terms Policy</Link></li>
                                    <li><Link to={urls.upload_work} className="sub-menu-item">Privacy Policy</Link></li>
                                </ul>
                            </li>
                            {userInfo ? (
                                <li><Link to={urls.upload_work} className="sub-menu-item">Upload Works</Link></li>
                            ) : (
                                <li><Link to={urls.become_creator} className="sub-menu-item">Become Creator</Link></li>
                            )}
                            <li><Link to={urls.user_nfts} className="sub-menu-item">My NFT</Link></li>
                            <li><Link to={urls.contact} className="sub-menu-item">Contact</Link></li>
                    </ul>
                </div>
            </div>
            <div className={`fixed inset-0 z-10 overflow-y-auto ${isDialogOpen ? 'block' : 'hidden'}`}>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                    <div className="relative bg-white rounded-lg max-w-lg w-full p-4">
                        <div className="text-center">
                            <p className="text-lg font-medium text-black">Address:</p>
                            <p className="text-lg font-medium text-black">{walletAddress}</p>
                            <p className="text-lg font-medium text-black">Balance:</p>
                            <p className="text-lg font-medium text-black">{addressBalance} ETH</p>
                            <button className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg shadow-lg hover:bg-violet-600 hover:text-white" onClick={() => setIsDialogOpen(false)}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </>
    )
}