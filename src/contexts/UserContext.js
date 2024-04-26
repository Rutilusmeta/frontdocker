// UserContext.js
import { createContext, useState, useEffect, useRef } from 'react';
import { useAuthCore } from '@particle-network/auth-core-modal';
import axios from 'axios';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => 
{
    const { userInfo } = useAuthCore();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state
    const isMounted = useRef(false);

    let providerAddress;

    switch (process.env.REACT_APP_CURRENT_ENV) {
        case 'dev':
            providerAddress = process.env.REACT_APP_API_ADDRESS_DEV;
            break;
        case 'testing':
            providerAddress = process.env.REACT_APP_API_ADDRESS_TESTING;
            break;
        case 'prod':
            providerAddress = process.env.REACT_APP_API_ADDRESS_PROD;
            break;
        default:
            // Default to dev environment if REACT_APP_NETWORK is not set or unrecognized
            providerAddress = process.env.REACT_APP_CHAIN_ADDRESS_DEV;
            break;
    }

    const updateUser = (newUserData) => 
    {
        console.log("Updating userData", newUserData);
        setUserData(newUserData);
        localStorage.setItem('userData', JSON.stringify(newUserData));
    };

    const clearUser = () => 
    {
        console.log("Clearing userData");
        setUserData(null);
        localStorage.removeItem('userData');
    };

    const getUserAvatar = (userData) =>
    {
        if (userData && userData.avatar && (userData.avatar.includes('http://') || userData.avatar.includes('https://'))) 
        {
            return userData.avatar;
        }
        else if (userData && userData.avatar)
        {
            return `/avatar/${userData.avatar}`;
        }
        else
        {
            return `/avatar/1.jpg`;
        }
    }

    const checkUserData = (userInfo) =>
    {
        //console.log("User info from particle userInfo:", userInfo);
        //console.log("User info from particle userData:", userData);
        let have_data = false;
        if (userData)
        {
            have_data = true;
            if (userData.token !== userInfo.token)
            {
                //console.log('userData.token has changed:', { old: userData.token, new: userInfo.token });
                have_data = false;
            }
        }
        if (have_data === false) 
        {
            //console.log('userData does not exist in localStorage or token has changed');
            const url = providerAddress + '/user/';
            const headers = 
            {
                'Authorization': userInfo.token,
                'UUID': userInfo.uuid
            };
            axios.get(url, { params: {}, headers })
            .then(response => 
            {
                //console.log('Get userData Response:', response.data);
                let newUserData = response.data.result.data[0]; 
                newUserData.token = userInfo.token;
                newUserData.uuid = userInfo.uuid;
                updateUser(newUserData);
            })
            .catch(error => 
            {
                console.error('Error:', error);
                return false;
            });
        }
        return true;
    }
    const saveUserData = async (userInfo, formData) => 
    {
        try 
        {
            const url = providerAddress + '/user/';
            const headers = 
            {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': userInfo.token,
                'UUID': userInfo.uuid
            };
            const response = await axios.put(url, new URLSearchParams(formData).toString(), { headers });
            //console.log('User data saved successfully:', response.data);
            let newUserData = response.data.result.data[0]; 
            newUserData.token = userInfo.token;
            newUserData.uuid = userInfo.uuid;
            console.log("newUserData", newUserData);
            updateUser(newUserData);
            return true;
        } 
        catch (error) 
        {
            console.error('Error saving user data:', error);
            return false;
        }
    };

    useEffect(() => 
    {
        if (!isMounted.current && userData === null)
        {
            isMounted.current = true;
            //console.log("NOTUSERDATA", userInfo);
            const userDataString = localStorage.getItem('userData');
            if (userDataString !== null) 
            {
                const userDataFromStorage = JSON.parse(userDataString);
                setUserData(userDataFromStorage);
                //console.log("NOT NULL", userDataFromStorage);
            }
            //console.log("FIORED", localStorage.getItem('userData'));
            setLoading(false); ;
        }

    }, [userData, userInfo]);

    return (
        <UserContext.Provider value={{ userData, updateUser, clearUser, checkUserData, saveUserData, getUserAvatar }}>
            {!loading && children}
        </UserContext.Provider>
    );
};

export default UserContext;
