import React from 'react';

const EnvDiv = () => {return (
  <>
      {process.env.REACT_APP_CURRENT_ENV === 'dev' && (
        <>
          <div className="absolute inset-y-0 right-0 m-4 p-4 text-white rounded-lg shadow-lg" style={{backgroundColor: 'green'}}>
            DEV ENV<br />
            Chain address: {process.env.REACT_APP_CHAIN_ADDRESS_DEV.replace(/:\w+@/, ':XXXX@')}<br />
            Chain ID: {process.env.REACT_APP_CHAIN_ID_DEV}<br />
            API address: {process.env.REACT_APP_API_ADDRESS_DEV}<br />
          </div>
        </>
      )}
      {process.env.REACT_APP_CURRENT_ENV === 'testing' && (
        <>
          <div className="absolute inset-y-0 right-0 m-4 p-4 text-white rounded-lg shadow-lg" style={{backgroundColor: 'blue'}}>
            TESTING ENV<br />
            Chain address: {process.env.REACT_APP_CHAIN_ADDRESS_TESTING}<br />
            Chain ID: {process.env.REACT_APP_CHAIN_ID_TESTING}<br />
            API address: {process.env.REACT_APP_API_ADDRESS_TESTING}<br />
          </div>
      </>
      )}
  </>
)};

export default EnvDiv;
