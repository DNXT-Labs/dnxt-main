import React, { useEffect, useState } from "react";
import { SwitchToPolygon } from "../Network/SwitchNetwork.js";
import * as ABIS from "../../constants/ABIS";
import * as addresses from "../../constants/addresses";
import "./../../style/admin.css"


const Whitelist = ({ web3, connected, connectWallet, selectedAddress, etherBalance, dnxtBalance }) => {
    const [isWhitelisted, setIsWhitelisted] = useState(false);
    const [isBlacklisted, setIsBlacklisted] = useState(false);
    const [addressToWhitelist, setAddressToWhitelist] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [actionType, setActionType] = useState("");  // either "whitelist" or "blacklist"


    useEffect(() => {
        if (connected) {
            const whitelistContract = new web3.eth.Contract(ABIS.ABIWHITELIST, addresses.whitelist);

            const checkWhitelistedStatus = async () => {
                const isWhitelisted = await whitelistContract.methods.whitelisted(addressToWhitelist).call();
                setIsWhitelisted(isWhitelisted);
            };

            const checkBlacklistedStatus = async () => {
                const isBlacklisted = await whitelistContract.methods.blacklisted(addressToWhitelist).call();
                setIsBlacklisted(isBlacklisted);
            };

            // Check whitelist and blacklist status
            checkWhitelistedStatus();
            checkBlacklistedStatus();
        }
    }, [connected, selectedAddress, web3, addressToWhitelist]);

    const confirmWhitelist = async () => {
        if (!addressToWhitelist) {
            setErrorMessage("Address missing");
            return;
        }

        await whitelistAddress();
        setErrorMessage(null); // clear any previous error message
    };

    const confirmBlacklist = async () => {
        if (!addressToWhitelist) {
            setErrorMessage("Address missing");
            return;
        }

        await blacklistAddress();
        setErrorMessage(null); // clear any previous error message
    };

    const whitelistAddress = async () => {
        if (!connected) {
            console.log("Not connected");
            return;
        }

        const whitelistContract = new web3.eth.Contract(ABIS.ABIWHITELIST, addresses.whitelist);
        try {
            await whitelistContract.methods.whitelistAccount(addressToWhitelist).send({
                from: selectedAddress,
            }).on('receipt', function (receipt) {
                console.log(receipt);
            });

            setShowModal(false);
        } catch (error) {
            console.error(error);
        }
    };

    const blacklistAddress = async () => {
        if (!connected) {
            console.log("Not connected");
            return;
        }

        const whitelistContract = new web3.eth.Contract(ABIS.ABIWHITELIST, addresses.whitelist);
        try {
            await whitelistContract.methods.blacklistAccount(addressToWhitelist).send({
                from: selectedAddress,
            }).on('receipt', function (receipt) {
                console.log(receipt);
            });

            setShowModal(false);
        } catch (error) {
            console.error(error);
        }
    };

    const checkAddressStatus = async () => {
        if (!addressToWhitelist) {
            setErrorMessage("Address missing");
            return;
        }

        const whitelistContract = new web3.eth.Contract(ABIS.ABIWHITELIST, addresses.whitelist);

        const isWhitelisted = await whitelistContract.methods.whitelisted(addressToWhitelist).call();
        setIsWhitelisted(isWhitelisted);

        const isBlacklisted = await whitelistContract.methods.blacklisted(addressToWhitelist).call();
        setIsBlacklisted(isBlacklisted);

        setErrorMessage(null); // clear any previous error message
    };



    return (
        connected ? (
            window.ethereum.chainId === "0x89" ? (
                <div className="mint-container">
                    <h1 className="label">
                        Whitelist Dashboard
                    </h1>

                    <label className="label">Address to check:</label>
                    <input
                        type="text"
                        value={addressToWhitelist}
                        onChange={(e) => setAddressToWhitelist(e.target.value)}
                    />
                    <button className="button" onClick={checkAddressStatus}>
                        Check Status
                    </button>


                    {/* Display the results */}
                    {isWhitelisted !== null && (
                        <div>
                            <p>Whitelisted: {isWhitelisted ? "True" : "False"}</p>
                            <p>Blacklisted: {isBlacklisted ? "True" : "False"}</p>
                        </div>
                    )}


                    <button className="button" onClick={() => { setShowModal(true); setActionType("whitelist"); }}>
                        Whitelist
                    </button>
                    <button className="button" onClick={() => { setShowModal(true); setActionType("blacklist"); }}>
                        Blacklist
                    </button>

                    {showModal && (
                        <div className="modal">
                            <div className="modal-overlay"></div>
                            <div className="modal-content">
                                <h2>Confirm {actionType.charAt(0).toUpperCase() + actionType.slice(1)}</h2>
                                <p>Address: <span className="value">{addressToWhitelist}</span></p>
                                {errorMessage && <label className="missingParameters">{errorMessage}</label>}
                                <button className="button" onClick={actionType === "whitelist" ? confirmWhitelist : confirmBlacklist}>
                                    Confirm
                                </button>
                                <button className="button" onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </div>
                    )}

                </div>
            ) : (<SwitchToPolygon connectWallet={connectWallet} connected={connected} />)
        ) : (<button className="button" onClick={() => connectWallet()}>Connect</button>)
    );

};

export default Whitelist;
