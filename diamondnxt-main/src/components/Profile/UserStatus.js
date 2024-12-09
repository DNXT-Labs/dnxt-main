import React, { useState, useEffect } from 'react';
//import axios from 'axios';
import KYC from "../KYC/KYC.js";
import * as ABIS from "../../constants/ABIS";
import * as addresses from "../../constants/addresses";
import { Box } from '@chakra-ui/react';



const UserStatus = ({ selectedAddress, web3, connected }) => {
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [isBlacklisted, setIsBlacklisted] = useState(false);
  const [isKycStarted, setIsKycStarted] = useState(false); // Track if KYC process has started

  const closeKYCModal = () => {
    setIsKycStarted(false);
  };

  const startKYC = async () => {
    console.log("Starting KYC: ")
  };

  useEffect(() => {
    if (connected) {
      const checkWhitelistedStatus = async () => {
        const whitelistContract = new web3.eth.Contract(ABIS.ABIWHITELIST, addresses.whitelist);
        const isWhitelisted = await whitelistContract.methods.whitelisted(selectedAddress).call();
        setIsWhitelisted(isWhitelisted);
      };
  
      const checkBlacklistedStatus = async () => {
        const whitelistContract = new web3.eth.Contract(ABIS.ABIWHITELIST, addresses.whitelist);
        const isBlacklisted = await whitelistContract.methods.blacklisted(selectedAddress).call();
        setIsBlacklisted(isBlacklisted);
      };
  
      // Call the functions to check whitelist and blacklist status
      checkWhitelistedStatus();
      checkBlacklistedStatus();
    }
  }, [connected, selectedAddress, web3]);

  return (
    <Box pt={{ base: "0px", md: "0px", xl: "0px" }}>
    <h2 className="section-title">Your Profile</h2>
      <p className="section-title">Address: {selectedAddress}</p>

      {/* Whitelist and Blacklist Status */}
      {isWhitelisted ? (
        <p>Status: Whitelisted</p>
      ) : isBlacklisted ? (
        <p>Status: Blacklisted</p>
      ) : (
        <button className="button" onClick={() => setIsKycStarted(true)}>Start KYC Process</button>
      )}

      {isKycStarted ? (
        // Render KYC form or other KYC-related content here
        // Example: <KYCForm />
        <KYC isKycStarted={isKycStarted} startKYC={startKYC} closeKYCModal={closeKYCModal} selectedAddress={selectedAddress} web3={web3} connected={connected} />
      ) : null}
    </Box>
  );
};

export default UserStatus;
