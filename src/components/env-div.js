import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EnvDiv = () => 
{
  const [apiEnv, setApiEnv] = useState(null);
  let whichEnv = process.env.NODE_ENV;
  if (whichEnv === 'development')
  {
    whichEnv = 'NPM';
  }
  else if (whichEnv === 'production')
  {
    whichEnv = 'WEBSERVER';
  }
  let bgColor;
  switch (whichEnv)
  {
    case 'NPM':
      bgColor = 'green';
      break;
    case 'WEBSERVER':
      bgColor = 'blue';
      break;
    default:
      bgColor = 'orange'; // Default color if no match
  }

  useEffect(() => 
  {

    const fetchData = async () => 
    {
      try 
      {
          //console.log(process.env.NODE_ENV);
          let res = await axios.get(process.env.REACT_APP_API_ADDRESS + '/env/');
          setApiEnv(res.data.result.data.env); // Assuming your API returns data

      } 
      catch (error) 
      {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run the effect only once when the component mounts

  return (
    <>
      <div className="absolute inset-y-0 right-0 m-4 p-4 text-white rounded-lg shadow-lg" style={{backgroundColor: bgColor}}>
        {whichEnv.toUpperCase()} ENV ({process.env.REACT_APP_ENV.toUpperCase()})<br />
        Chain address: {process.env.REACT_APP_CHAIN_ADDRESS_DEV.replace(/:\w+@/, ':XXXX@')}<br />
        Chain ID: {process.env.REACT_APP_CHAIN_ID_DEV}<br />
        API address: {process.env.REACT_APP_API_ADDRESS} ({apiEnv})<br />
      </div>
    </>
  )
  
  /*return (
  <>
      {process.env.REACT_APP_CURRENT_ENV === 'dev' && (
        <>
          <div className="absolute inset-y-0 right-0 m-4 p-4 text-white rounded-lg shadow-lg" style={{backgroundColor: 'green'}}>
            DEV ENV<br />
            Chain address: {process.env.REACT_APP_CHAIN_ADDRESS_DEV.replace(/:\w+@/, ':XXXX@')}<br />
            Chain ID: {process.env.REACT_APP_CHAIN_ID_DEV}<br />
            API address: {process.env.REACT_APP_API_ADDRESS} ({apiEnv})<br />
          </div>
        </>
      )}
      {process.env.REACT_APP_CURRENT_ENV === 'testing' && (
        <>
          <div className="absolute inset-y-0 right-0 m-4 p-4 text-white rounded-lg shadow-lg" style={{backgroundColor: 'blue'}}>
            TESTING ENV<br />
            Chain address: {process.env.REACT_APP_CHAIN_ADDRESS_TESTING}<br />
            Chain ID: {process.env.REACT_APP_CHAIN_ID_TESTING}<br />
            API address: {process.env.REACT_APP_API_ADDRESS} ({apiEnv})<br />
          </div>
      </>
      )}
  </>
      )*/
    
};

export default EnvDiv;
