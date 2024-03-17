import React from 'react'
import image from '../../assets/images/avatar/1.jpg';
import Navbar from '../../components/navbar'
import Footer from '../../components/footer'
import Switcher from '../../components/switcher';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Youtube, Twitter } from 'react-feather';

export default function CreatorProfileEdit() {
    const loadFile = (event) => {
        const image = document.getElementById(event.target.name);
        image.src = URL.createObjectURL(event.target.files[0]);
    };

    return (
        <>
            <Navbar />
            <section className="relative table w-full py-36 bg-[url('../../assets/images/bg/bg1.jpg')] bg-bottom bg-no-repeat">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900"></div>
                <div className="container">
                    <div className="grid grid-cols-1 pb-8 text-center mt-10">
                        <h3 className="md:text-3xl text-2xl md:leading-snug tracking-wide leading-snug font-medium text-white">Edit Profile / Settings</h3>

                    </div>
                </div>

                <div className="absolute text-center z-10 bottom-5 start-0 end-0 mx-3">
                    <ul className="breadcrumb tracking-[0.5px] breadcrumb-light mb-0 inline-block">
                        <li className="inline breadcrumb-item text-[15px] font-semibold duration-500 ease-in-out text-white/50 hover:text-white"><Link to="/index">Giglink</Link></li>
                        <li className="inline breadcrumb-item text-[15px] font-semibold duration-500 ease-in-out text-white" aria-current="page">Settings</li>
                    </ul>
                </div>
            </section>
            <div className="relative">
                <div className="shape absolute start-0 end-0 sm:-bottom-px -bottom-[2px] overflow-hidden z-1 text-white dark:text-slate-900">
                    <svg className="w-full h-auto" viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
                    </svg>
                </div>
            </div>

            <section className="relative md:py-24 py-16">
                <div className="container">
                    <div className="grid md:grid-cols-12 gap-[30px]">
                        <div className="lg:col-span-3 md:col-span-4">
                            <div className="group profile-pic w-[112px]">
                                <input id="pro-img" name="profile-image" type="file" className="hidden" onChange={loadFile} />
                                <div>
                                    <div className="relative h-28 w-28 rounded-full shadow-md dark:shadow-gray-800 ring-4 ring-slate-50 dark:ring-slate-800 overflow-hidden">
                                        <img src={image} className="rounded-full" id="profile-image" alt="" />
                                        <div className="absolute inset-0 group-hover:bg-slate-900/40 transition duration-500"></div>
                                        <label className="absolute inset-0 cursor-pointer" htmlFor="pro-img"></label>
                                    </div>
                                </div>
                            </div>

                            <p className="text-slate-400 mt-3">We recommend an image of at least 400X400. GIFs work too.</p>
                        </div>

                        <div className="lg:col-span-9 md:col-span-8">
                            <div className="p-6 rounded-md shadow dark:shadow-gray-800 bg-white dark:bg-slate-900">
                                <h5 className="text-lg font-semibold mb-4">Personal Detail :</h5>
                                <form>
                                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
                                        <div>
                                            <label className="form-label font-medium">First Name : <span className="text-red-600">*</span></label>
                                            <input type="text" className="form-input w-full text-[15px] py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-full outline-none border border-gray-200 focus:border-violet-600 dark:border-gray-800 dark:focus:border-violet-600 focus:ring-0 mt-2" placeholder="First Name:" id="firstname" name="name" />
                                        </div>
                                        <div>
                                            <label className="form-label font-medium">Last Name : <span className="text-red-600">*</span></label>
                                            <input type="text" className="form-input w-full text-[15px] py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-full outline-none border border-gray-200 focus:border-violet-600 dark:border-gray-800 dark:focus:border-violet-600 focus:ring-0 mt-2" placeholder="Last Name:" id="lastname" name="name" />
                                        </div>
                                        <div>
                                            <label className="form-label font-medium">Your Email : <span className="text-red-600">*</span></label>
                                            <input type="email" className="form-input w-full text-[15px] py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-full outline-none border border-gray-200 focus:border-violet-600 dark:border-gray-800 dark:focus:border-violet-600 focus:ring-0 mt-2" placeholder="Email" name="email" />
                                        </div>
                                        <div>
                                            <label className="form-label font-medium">Occupation : </label>
                                            <input name="name" id="occupation" type="text" className="form-input w-full text-[15px] py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-full outline-none border border-gray-200 focus:border-violet-600 dark:border-gray-800 dark:focus:border-violet-600 focus:ring-0 mt-2" placeholder="Occupation :" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1">
                                        <div className="mt-5">
                                            <label className="form-label font-medium">Description : </label>
                                            <textarea name="comments" id="comments" className="form-input w-full text-[15px] py-2 px-3 h-28 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-2xl outline-none border border-gray-200 focus:border-violet-600 dark:border-gray-800 dark:focus:border-violet-600 focus:ring-0 mt-2" placeholder="Message :"></textarea>
                                        </div>
                                    </div>

                                    <input type="submit" id="submit" name="send" className="btn bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white rounded-full mt-5" value="Save Changes" />
                                </form>
                            </div>

                            <div className="p-6 rounded-md shadow dark:shadow-gray-800 bg-white dark:bg-slate-900 mt-[30px]">
                                <h5 className="text-lg font-semibold mb-6">Social Profiles :</h5>

                                <div className="md:flex">
                                    <div className="md:w-1/3">
                                        <span className="font-medium">Twitter</span>
                                    </div>

                                    <div className="md:w-2/3 mt-4 md:mt-0">
                                        <form>
                                            <div className="form-icon relative">
                                                <Twitter className="w-4 h-4 absolute top-3 start-4"></Twitter>
                                                <input type="text" className="form-input w-full text-[15px] ps-12 py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-full outline-none border border-gray-200 focus:border-violet-600 dark:border-gray-800 dark:focus:border-violet-600 focus:ring-0" placeholder="Twitter Profile Name" id="twitter_name" name="name" />
                                            </div>
                                        </form>

                                        <p className="text-slate-400 mt-1">Add your Twitter username (e.g. jennyhot).</p>
                                    </div>
                                </div>

                                <div className="md:flex mt-8">
                                    <div className="md:w-1/3">
                                        <span className="font-medium">Facebook</span>
                                    </div>

                                    <div className="md:w-2/3 mt-4 md:mt-0">
                                        <form>
                                            <div className="form-icon relative">
                                                <Facebook className="w-4 h-4 absolute top-3 start-4"></Facebook>
                                                <input type="text" className="form-input w-full text-[15px] ps-12 py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-full outline-none border border-gray-200 focus:border-violet-600 dark:border-gray-800 dark:focus:border-violet-600 focus:ring-0" placeholder="Facebook Profile Name" id="facebook_name" name="name" />
                                            </div>
                                        </form>

                                        <p className="text-slate-400 mt-1">Add your Facebook username (e.g. jennyhot).</p>
                                    </div>
                                </div>

                                <div className="md:flex mt-8">
                                    <div className="md:w-1/3">
                                        <span className="font-medium">Instagram</span>
                                    </div>

                                    <div className="md:w-2/3 mt-4 md:mt-0">
                                        <form>
                                            <div className="form-icon relative">
                                                <Instagram className="w-4 h-4 absolute top-3 start-4"></Instagram>
                                                <input type="text" className="form-input w-full text-[15px] ps-12 py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-full outline-none border border-gray-200 focus:border-violet-600 dark:border-gray-800 dark:focus:border-violet-600 focus:ring-0" placeholder="Instagram Profile Name" id="insta_name" name="name" />
                                            </div>
                                        </form>

                                        <p className="text-slate-400 mt-1">Add your Instagram username (e.g. jennyhot).</p>
                                    </div>
                                </div>

                                <div className="md:flex mt-8">
                                    <div className="md:w-1/3">
                                        <span className="font-medium">Linkedin</span>
                                    </div>

                                    <div className="md:w-2/3 mt-4 md:mt-0">
                                        <form>
                                            <div className="form-icon relative">
                                                <Linkedin className="w-4 h-4 absolute top-3 start-4"></Linkedin>
                                                <input type="text" className="form-input w-full text-[15px] ps-12 py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-full outline-none border border-gray-200 focus:border-violet-600 dark:border-gray-800 dark:focus:border-violet-600 focus:ring-0" placeholder="Linkedin Profile Name" id="linkedin_name" name="name" />
                                            </div>
                                        </form>

                                        <p className="text-slate-400 mt-1">Add your Linkedin username.</p>
                                    </div>
                                </div>

                                <div className="md:flex mt-8">
                                    <div className="md:w-1/3">
                                        <span className="font-medium">Youtube</span>
                                    </div>

                                    <div className="md:w-2/3 mt-4 md:mt-0">
                                        <form>
                                            <div className="form-icon relative">
                                                <Youtube className="w-4 h-4 absolute top-3 start-4"></Youtube>
                                                <input type="url" className="form-input w-full text-[15px] ps-12 py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-full outline-none border border-gray-200 focus:border-violet-600 dark:border-gray-800 dark:focus:border-violet-600 focus:ring-0" placeholder="Youtube url" id="you_url" name="url" />
                                            </div>
                                        </form>

                                        <p className="text-slate-400 mt-1">Add your Youtube url.</p>
                                    </div>
                                </div>

                                <div className="md:flex">
                                    <div className="md:w-full">
                                        <span className="font-medium"></span>
                                        <button className="btn bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white rounded-full mt-5">Save Social Profile</button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-md shadow dark:shadow-gray-800 bg-white dark:bg-slate-900 mt-[30px]">
                                <h5 className="text-lg font-semibold mb-6">Account Notifications :</h5>

                                <div className="flex justify-between pb-4">
                                    <h6 className="mb-0 font-medium">When someone mentions me</h6>
                                    <div className="">
                                        <input className="form-checkbox rounded border-gray-200 dark:border-gray-800 text-violet-600 focus:border-violet-600/30 focus:ring focus:ring-offset-0 focus:ring-violet-600/20 focus:ring-opacity-50" type="checkbox" value="" id="noti1" />
                                        <label className="form-check-label" htmlFor="noti1"></label>
                                    </div>
                                </div>
                                <div className="flex justify-between py-4 border-t border-gray-100 dark:border-gray-700">
                                    <h6 className="mb-0 font-medium">When someone follows me</h6>
                                    <div className="">
                                        <input className="form-checkbox rounded border-gray-200 dark:border-gray-800 text-violet-600 focus:border-violet-600/30 focus:ring focus:ring-offset-0 focus:ring-violet-600/20 focus:ring-opacity-50" type="checkbox" value="" defaultChecked id="noti2" />
                                        <label className="form-check-label" htmlFor="noti2"></label>
                                    </div>
                                </div>
                                <div className="flex justify-between py-4 border-t border-gray-100 dark:border-gray-700">
                                    <h6 className="mb-0 font-medium">When shares my activity</h6>
                                    <div className="">
                                        <input className="form-checkbox rounded border-gray-200 dark:border-gray-800 text-violet-600 focus:border-violet-600/30 focus:ring focus:ring-offset-0 focus:ring-violet-600/20 focus:ring-opacity-50" type="checkbox" value="" id="noti3" />
                                        <label className="form-check-label" htmlFor="noti3"></label>
                                    </div>
                                </div>
                                <div className="flex justify-between py-4 border-t border-gray-100 dark:border-gray-700">
                                    <h6 className="mb-0 font-medium">When someone messages me</h6>
                                    <div className="">
                                        <input className="form-checkbox rounded border-gray-200 dark:border-gray-800 text-violet-600 focus:border-violet-600/30 focus:ring focus:ring-offset-0 focus:ring-violet-600/20 focus:ring-opacity-50" type="checkbox" value="" id="noti4" />
                                        <label className="form-check-label" htmlFor="noti4"></label>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-md shadow dark:shadow-gray-800 bg-white dark:bg-slate-900 mt-[30px]">
                                <h5 className="text-lg font-semibold mb-6">Marketing Notifications :</h5>

                                <div className="flex justify-between pb-4">
                                    <h6 className="mb-0 font-medium">There is a sale or promotion</h6>
                                    <div className="">
                                        <input className="form-checkbox rounded border-gray-200 dark:border-gray-800 text-violet-600 focus:border-violet-600/30 focus:ring focus:ring-offset-0 focus:ring-violet-600/20 focus:ring-opacity-50" type="checkbox" value="" id="noti5" />
                                        <label className="form-check-label" htmlFor="noti5"></label>
                                    </div>
                                </div>
                                <div className="flex justify-between py-4 border-t border-gray-100 dark:border-gray-700">
                                    <h6 className="mb-0 font-medium">Company news</h6>
                                    <div className="">
                                        <input className="form-checkbox rounded border-gray-200 dark:border-gray-800 text-violet-600 focus:border-violet-600/30 focus:ring focus:ring-offset-0 focus:ring-violet-600/20 focus:ring-opacity-50" type="checkbox" value="" id="noti6" />
                                        <label className="form-check-label" htmlFor="noti6"></label>
                                    </div>
                                </div>
                                <div className="flex justify-between py-4 border-t border-gray-100 dark:border-gray-700">
                                    <h6 className="mb-0 font-medium">Weekly jobs</h6>
                                    <div className="">
                                        <input className="form-checkbox rounded border-gray-200 dark:border-gray-800 text-violet-600 focus:border-violet-600/30 focus:ring focus:ring-offset-0 focus:ring-violet-600/20 focus:ring-opacity-50" type="checkbox" value="" defaultChecked id="noti7" />
                                        <label className="form-check-label" htmlFor="noti7"></label>
                                    </div>
                                </div>
                                <div className="flex justify-between py-4 border-t border-gray-100 dark:border-gray-700">
                                    <h6 className="mb-0 font-medium">Unsubscribe News</h6>
                                    <div className="">
                                        <input className="form-checkbox rounded border-gray-200 dark:border-gray-800 text-violet-600 focus:border-violet-600/30 focus:ring focus:ring-offset-0 focus:ring-violet-600/20 focus:ring-opacity-50" type="checkbox" value="" defaultChecked id="noti8" />
                                        <label className="form-check-label" htmlFor="noti8"></label>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-md shadow dark:shadow-gray-800 bg-white dark:bg-slate-900 mt-[30px]">
                                <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
                                    <div>
                                        <h5 className="text-lg font-semibold mb-5">Contact Info :</h5>

                                        <form>
                                            <div className="grid grid-cols-1 gap-5">
                                                <div>
                                                    <label className="form-label font-medium">Phone No. :</label>
                                                    <input name="number" id="number" type="number" className="form-input w-full text-[15px] py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-full outline-none border border-gray-200 focus:border-violet-600 dark:border-gray-800 dark:focus:border-violet-600 focus:ring-0 mt-2" placeholder="Phone :" />
                                                </div>

                                                <div>
                                                    <label className="form-label font-medium">Website :</label>
                                                    <input name="url" id="url" type="url" className="form-input w-full text-[15px] py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-full outline-none border border-gray-200 focus:border-violet-600 dark:border-gray-800 dark:focus:border-violet-600 focus:ring-0 mt-2" placeholder="Url :" />
                                                </div>
                                            </div>

                                            <button className="btn bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white rounded-full mt-5">Add</button>
                                        </form>
                                    </div>

                                    <div>
                                        <h5 className="text-lg font-semibold mb-5">Change password :</h5>
                                        <form>
                                            <div className="grid grid-cols-1 gap-5">
                                                <div>
                                                    <label className="form-label font-medium">Old password :</label>
                                                    <input type="password" className="form-input w-full text-[15px] py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-full outline-none border border-gray-200 focus:border-violet-600 dark:border-gray-800 dark:focus:border-violet-600 focus:ring-0 mt-2" placeholder="Old password" />
                                                </div>

                                                <div>
                                                    <label className="form-label font-medium">New password :</label>
                                                    <input type="password" className="form-input w-full text-[15px] py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-full outline-none border border-gray-200 focus:border-violet-600 dark:border-gray-800 dark:focus:border-violet-600 focus:ring-0 mt-2" placeholder="New password" />
                                                </div>

                                                <div>
                                                    <label className="form-label font-medium">Re-type New password :</label>
                                                    <input type="password" className="form-input w-full text-[15px] py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-full outline-none border border-gray-200 focus:border-violet-600 dark:border-gray-800 dark:focus:border-violet-600 focus:ring-0 mt-2" placeholder="Re-type New password" />
                                                </div>
                                            </div>

                                            <button className="btn bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white rounded-full mt-5">Save password</button>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-md shadow dark:shadow-gray-800 bg-white dark:bg-slate-900 mt-[30px]">
                                <h5 className="text-lg font-semibold mb-5 text-red-600">Delete Account :</h5>

                                <p className="text-slate-400 mb-4">Do you want to delete the account? Please press below "Delete" button</p>

                                <Link to="/explore-two" className="btn bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700 text-white rounded-full">Delete</Link>
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
