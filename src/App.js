import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/index/index';
import { useEffect } from 'react';
import React from 'react';
import IndexSeven from './pages/index/index-seven';
import Contact from './pages/contact';
import About from './pages/about';
import Creators from './pages/creator/creators';
import CreatorProfile from './pages/creator/creator-profile';
import CreatorProfileEdit from './pages/creator/creator-profile-edit';
import BecomeCreator from './pages/creator/become-creator';
import Blogs from './pages/blog/blogs';
import BlogDetail from './pages/blog/blog-detail';
import Login from './pages/auth/login';
import Signup from './pages/auth/signup';
import ResetPassword from './pages/auth/reset-password';
import Comingsoon from './pages/special/comingsoon';
import Maintenance from './pages/special/maintenance';
import Error from './pages/special/error';
import Thankyou from './pages/special/thankyou';
import Terms from './pages/terms';
import Support from './pages/helpcenter/support';
import Guides from './pages/helpcenter/guides';
import ItemDetail from './pages/explore/item-detail';
import IndexTwo from './pages/index/index-two';
import IndexTen from './pages/index/index-ten';
import ExploreOne from './pages/explore/explore-one';
import IndexThree from './pages/index/index-three';
import IndexFour from './pages/index/index-four';
import IndexFive from './pages/index/index-five';
import IndexSix from './pages/index/index-six';
import IndexEight from './pages/index/index-eight';
import IndexNine from './pages/index/index-nine';
import Auction from './pages/explore/auction';
import Activity from './pages/explore/activity';
import Collections from './pages/explore/collections';
import Wallet from './pages/wallet';
import UploadWork from './pages/explore/upload-work';
import HelpcenterFaqs from './pages/helpcenter/helpcenter-faqs';
import PrivacyPolicy from './pages/privacy-policy';
import LockScreen from './pages/auth/lock-screen';
import HelpcenterOverview from './pages/helpcenter/helpcenter-overview';
import ScrollToTop from './components/scroll-top';
import ExploreTwo from './pages/explore/explore-two';
import ExploreThree from './pages/explore/explore-three';
import NotFound from './pages/special/error';
import { UserProvider } from './contexts/UserContext';
import { NFTMarketplaceContextProvider } from './contexts/NFTMarketplaceContext';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() 
{
  
  useEffect(() => 
  {
    document.documentElement.setAttribute("dir", "ltr");
    document.documentElement.classList.add('dark');
    document.body.classList.add('font-urbanist', 'text-base', 'text-black', 'dark:text-white', 'dark:bg-slate-900');
  });

  return (
    <BrowserRouter>
      <ScrollToTop />
      <UserProvider>
        <NFTMarketplaceContextProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/index-seven" replace />} />

            <Route path="/index" element={<Index />} />
            <Route path="/index-seven" element={<IndexSeven />} />
            <Route path="/index-two" element={<IndexTwo />} />
            <Route path="/index-three" element={<IndexThree />} />
            <Route path="/index-ten" element={<IndexTen />} />
            <Route path="/index-nine" element={<IndexNine />} />
            <Route path="/index-eight" element={<IndexEight />} />
            <Route path='/explore-one' element={<ExploreOne />} />
            <Route path='/auction' element={<Auction />} />
            <Route path='/activity' element={<Activity />} />
            <Route path='/collections' element={<Collections />} />
            <Route path='/wallet' element={<Wallet />} />
            <Route path="/explore-two" element={<ExploreTwo />} />
            <Route path="/explore-three" element={<ExploreThree />} />
            <Route path="/index-four" element={<IndexFour />} />
            <Route path='/upload-work' element={<UploadWork />} />
            <Route path="/index-six" element={<IndexSix />} />
            <Route path="/index-five" element={<IndexFive />} />

            <Route path='/item-detail' element={<ItemDetail />} />
            <Route path='/item-detail/:id' element={<ItemDetail />} />
            <Route path='/helpcenter-guides' element={<Guides />} />
            <Route path='/helpcenter-support' element={<Support />} />
            <Route path='/helpcenter-support' element={<Support />} />
            <Route path='/helpcenter-faqs' element={<HelpcenterFaqs />} />
            <Route path='/privacy' element={<PrivacyPolicy />} />
            <Route path='/terms' element={<Terms />} />
            <Route path='/comingsoon' element={<Comingsoon />} />
            <Route path='/maintenance' element={<Maintenance />} />
            <Route path='/error' element={<Error />} />
            <Route path='/thankyou' element={<Thankyou />} />

            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/reset-password' element={<ResetPassword />} />
            <Route path='/lock-screen' element={<LockScreen />} />
            <Route path='/helpcenter-overview' element={<HelpcenterOverview />} />

            <Route path='/blogs' element={<Blogs />} />
            <Route path='/blog-detail' element={<BlogDetail />} />
            <Route path='/blog-detail/:id' element={<BlogDetail />} />

            <Route path='/become-creator' element={<BecomeCreator />} />
            <Route path='/creator-profile' element={<CreatorProfile />} />
            <Route path='/creator-profile/:id' element={<CreatorProfile />} />
            <Route exact path='/creator-profile-edit' element={<ProtectedRoute/>}>
              <Route exact path='/creator-profile-edit' element={<CreatorProfileEdit/>}/>
            </Route>
            <Route path='/creators' element={<Creators />} />
            <Route path="/aboutus" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </NFTMarketplaceContextProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
