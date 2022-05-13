import React, { Children, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import InfoTooltip from '../../ui/info-tooltip';
import Tooltip from '../../ui/tooltip';

const fetchMetaDegenStatus = (address) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(address);
      resolve('test');
    }, 5000);
  });
};

const MetaDegen = ({ children }) => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState();
  const [startedDegen, setStartedDegen] = useState(false);
  const address = useSelector((state) => {
    return state.metamask.unapprovedTxs[id].txParams.to;
  });
  const callMetaDegen = async ({ children }) => {
    setStartedDegen(true);
    setIsLoading(true);
    const res = await fetchMetaDegenStatus(address);
    setStatus(false);
    setIsLoading(false);
  };
  /*  useEffect(() => {
    if (address) callMetaDegen();
  }, [address]); */
  return (
    <>
      <div className="metadegen">
        <InfoTooltip position="top" contentText="Rick check">
          <img
            onClick={callMetaDegen}
            style={{
              opacity: !startedDegen && isLoading ? 1 : 0,
              display: !startedDegen && isLoading ? 'block' : 'none',
              transition: 'opacity .5s ease-in-out',
            }}
            src="./images/Metadegen_button.png"
            alt="MetaDegen Logo"
          />
        </InfoTooltip>
        <img
          style={{
            opacity: startedDegen && isLoading ? 1 : 0,
            display: startedDegen && isLoading ? 'block' : 'none',
            transition: 'opacity .5s ease-in-out',
          }}
          src="./images/Metadegen_blue.gif"
          alt="MetaDegen Logo"
        />
        <img
          style={{
            opacity: startedDegen && !isLoading && status ? 1 : 0,
            display: !isLoading && status ? 'block' : 'none',
            transition: 'opacity .5s ease-in-out',
          }}
          src="./images/Metadegen_green.gif"
          alt="MetaDegen Logo"
        />
        <img
          style={{
            opacity: startedDegen && !isLoading && !status ? 1 : 0,
            display: !isLoading && !status ? 'block' : 'none',
            transition: 'opacity .5s ease-in-out',
          }}
          src="./images/Metadegen_red.gif"
          alt="MetaDegen Logo"
        />
      </div>
      {children(startedDegen && !isLoading && !status)}
    </>
  );
};

export default MetaDegen;
