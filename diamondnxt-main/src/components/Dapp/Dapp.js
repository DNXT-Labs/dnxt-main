import React from "react";
import { SwitchToPolygon } from "../Network/SwitchNetwork.js";
import "./../../style/app.css";

const Dapp = (props) => {
  const { connected, connectWallet, selectedAddress } = props;

  return (
    <div className="dapp-container">
      {connected ? (
        window.ethereum.chainId === "0x89" ? (
          <div>
          <div className="top-components">
            </div>
            {selectedAddress}
            </div>
        ) : (
            <SwitchToPolygon connectWallet={connectWallet} connected={connected} />
        )
      ) : (
        <button className="button" onClick={() => connectWallet()}>
          Connect
        </button>
      )}
    </div>
  );
};

export default Dapp;
