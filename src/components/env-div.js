import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const EnvDiv = () => 
{
  const [apiEnv, setApiEnv] = useState(null);
  const [nodeEnv, setNodeEnv] = useState(null);
  const initialized = useRef(false);
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
          setApiEnv(res.data.result.data.env.toUpperCase());
          if (process.env.REACT_APP_CHAIN_ADDRESS_DEV.includes('testnode.metaqueer.store'))
          {
            const node_url = process.env.REACT_APP_CHAIN_ADDRESS_DEV
                              .replace('ws://', 'http://')
                              .replace('wss://', 'https://');
            let res = await axios.get(node_url + '/env.html');
            setNodeEnv("(" + res.data.toUpperCase() + ")");
          }

      } 
      catch (error) 
      {
        console.error('Error fetching data:', error);
      }
    };
    if (!initialized.current) 
    {
      initialized.current = true;
      fetchData();
    }
  }, []); // Empty dependency array to run the effect only once when the component mounts

  return (
    <>
      <div className="fixed rounded-md z-10 bottom-5 flex" style={{ padding: '5px', backgroundColor: bgColor }}>
        <p>
          SITE: <span style={{color: 'yellow', fontWeight: 'bold'}}>{whichEnv.toUpperCase()} ENV ({process.env.REACT_APP_ENV.toUpperCase()})</span><br />        
          API: <span style={{color: 'yellow', fontWeight: 'bold'}}>{process.env.REACT_APP_API_ADDRESS} ({apiEnv})</span><br />
          {/*Chain ID: {process.env.REACT_APP_CHAIN_ID_DEV}<br />*/}
          NODE: <span style={{color: 'yellow', fontWeight: 'bold'}}>{process.env.REACT_APP_CHAIN_ADDRESS_DEV.replace(/:\w+@/, ':XXXX@')} {nodeEnv}</span><br />
        </p>
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
