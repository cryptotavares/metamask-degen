import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import getFetchWithTimeout from '../../../../shared/modules/fetch-with-timeout';
import InfoTooltip from '../../ui/info-tooltip';

const fetchMetaDegenStatus = async (address, chainid) =>
  await getFetchWithTimeout(10000)(
    'http://ec2-52-77-216-46.ap-southeast-1.compute.amazonaws.com/scan',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'LOTKHPyorU7scjjoJfthg41A1JJ7Y0VI7T5R4IZC',
        chainid,
      },
      body: JSON.stringify({
        address,
      }),
    },
  );

const MetaDegen = ({ children }) => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState();
  const [startedDegen, setStartedDegen] = useState(false);
  const [address, chainid] = useSelector((state) => {
    return [
      state.metamask.unapprovedTxs[id].txParams.to,
      state.metamask.unapprovedTxs[id].metamaskNetworkId,
    ];
  });
  const callMetaDegen = async () => {
    setStartedDegen(true);
    setIsLoading(true);
    const res = await (await fetchMetaDegenStatus(address, chainid)).json();
    setStatus(!res.data.hasRisk);

    setIsLoading(false);
  };
  return (
    <>
      <div className="metadegen">
        <InfoTooltip
          position="top"
          contentText="Click to check the contract before interacting with it."
        >
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
        <InfoTooltip
          position="top"
          contentText="Contract being checked… Complex algorithm running…"
        >
          <img
            style={{
              opacity: startedDegen && isLoading ? 1 : 0,
              display: startedDegen && isLoading ? 'block' : 'none',
              transition: 'opacity .5s ease-in-out',
            }}
            src="./images/Metadegen_blue.gif"
            alt="MetaDegen Logo"
          />
        </InfoTooltip>
        <InfoTooltip
          position="top"
          contentText="Contract is clean - You can go ahead Degen!"
        >
          <img
            style={{
              opacity: startedDegen && !isLoading && status ? 1 : 0,
              display: !isLoading && status ? 'block' : 'none',
              transition: 'opacity .5s ease-in-out',
            }}
            src="./images/Metadegen_green.gif"
            alt="MetaDegen Logo"
          />
        </InfoTooltip>
        <InfoTooltip
          position="top"
          contentText="Contract funded via Tornado Cash - Proceed at your own risk Degen!"
        >
          <img
            style={{
              opacity: startedDegen && !isLoading && !status ? 1 : 0,
              display: !isLoading && !status ? 'block' : 'none',
              transition: 'opacity .5s ease-in-out',
            }}
            src="./images/Metadegen_red.gif"
            alt="MetaDegen Logo"
          />
        </InfoTooltip>
      </div>
      {children(startedDegen && !isLoading && !status)}
    </>
  );
};

export default MetaDegen;
