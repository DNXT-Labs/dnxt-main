import React from 'react';
import Card from "./views/Card";
import ListItem from "./views/ListItem";
import { SwitchToPolygon } from '../Network/SwitchNetwork';

const ExplorerDisplay = ({ isLoading, connected, filteredData, displayMode, connectWallet }) => {
    return (
        <div className="explorer-container">
            {connected ? (
                window.ethereum.chainId === "0x89" ? (
                    isLoading ? (
                        <p className="subtitle">Loading...</p>
                    ) : (
                        filteredData.map((nft, index) => {
                            switch (displayMode) {
                                case 'list':
                                    return <ListItem data={nft} key={index} />;
                                case 'card':
                                    return <Card data={nft} key={index} />;
                                default:
                                    return null;
                            }
                        })
                    )
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
}

export default ExplorerDisplay;
