import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import getFetchWithTimeout from '../../../../shared/modules/fetch-with-timeout';
import InfoTooltip from '../../ui/info-tooltip';

const fetchMetaDegenStatus = async (address) =>
  await getFetchWithTimeout(10000)(
    'http://ec2-52-77-216-46.ap-southeast-1.compute.amazonaws.com/scan',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
  const address = useSelector((state) => {
    return state.metamask.unapprovedTxs[id].txParams.to;
  });
  const callMetaDegen = async () => {
    setStartedDegen(true);
    setIsLoading(true);
    const res = await (await fetchMetaDegenStatus(address)).json();
    setStatus(!res.data.hasRisk);

    setIsLoading(false);
  };
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
