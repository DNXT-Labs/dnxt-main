import React, { Fragment, useState } from "react";
import { Transition } from "@headlessui/react";
import { SwitchNetwork } from "./SwitchNetwork.js";
//import * as logos from './../../images/logos.js';
import "./../../style/header.css";


const NetworkSelect = ({ web3, networks, networkId, selectedNetwork, setSelectedNetwork, connected, connectWallet }) => {

  const [isSelectOpen, setIsSelectOpen] = useState(false);


  const handleNetworkClick = () => {
    if (!connected) {
      connectWallet();
    } else {
      setIsSelectOpen(prev => !prev);
    }
  };

  async function networkData() {
    console.log("net: ");
    if (window.ethereum.chainId === 1) {
      return <div>1</div>;
    } else if (window.ethereum.chainId === 137) {
      return <div>137</div>;
    }
  }

  const onNetworkSelect = (network) => {
    console.log(network.id)
    console.log("idddddd"+networkId)
    console.log(network.name)
    console.log(network.label)
    

    if (network.id !== networkId) {
      SwitchNetwork({
        connected,
        params: network.params,
        connectWallet: connectWallet,
      });
    }
    setIsSelectOpen(false);
    connectWallet();
    console.log("selected"+selectedNetwork)
  };

  return (

      <><div className="network" onClick={() => handleNetworkClick()}>
      {connected ? (
        <>
          <div className="status-connected"></div>
          <div>Network: {selectedNetwork()}</div>
        </>
      ) : (
        <>
          <div className="status"></div>
          <div>Connect {networkData}</div>
        </>
      )}
    </div><Transition
      as={Fragment}
      show={isSelectOpen}
      enter="transitionFade"
      enterFrom="transitionFadeClosed"
      enterTo="transitionFadeOpen"
      leave="transitionFade"
      leaveFrom="transitionFadeOpen"
      leaveTo="transitionFadeClosed"
    >
        <div className="networkSelect">
          {networks.map((network) => {
            return (
              <div key={network.name} className="item" onClick={() => onNetworkSelect(network)}>
                <span>{network.label}</span>
              </div>
            );
          })}
        </div>
      </Transition></>
  );
};

export default NetworkSelect;
