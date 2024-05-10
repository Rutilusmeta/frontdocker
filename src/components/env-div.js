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
  switch (process.env.REACT_APP_ENV)
  {
    case 'dev':
      bgColor = 'green';
      break;
    case 'testing':
      bgColor = 'orange';
      break;
    default:
      bgColor = 'blue'; // Default color if no match
  }

  useEffect(() => 
  {
    if (process.env.REACT_APP_ENV === 'prod')
    {
      return;
    }
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

  return process.env.REACT_APP_ENV !== 'prod' && (
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
};

export default EnvDiv;
