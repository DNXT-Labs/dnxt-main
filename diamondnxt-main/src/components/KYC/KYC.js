import React, { useState } from 'react';
import SumsubWebSdk from "@sumsub/websdk-react";
import axios from 'axios';

const SUMSUB_BASE_URL = 'https://api.sumsub.com';
const EXPRESS_SERVER_URL = 'https://serverdnxt.vercel.app'; // Update with your server's URL
const levelName = 'dnxt';
const messageToSign = 'I accept the terms and conditions to join the DNXT platform';

const KYC = ({
  connected,
  startKYC,
  closeKYCModal,
  selectedAddress,
  web3
}) => {
  const [isKycConfirmed, setIsKycConfirmed] = useState(false);
  const [accessToken, setAccessToken] = useState(null); // Store the access token here
  const [applicantId, setApplicantId] = useState(null); // Store the applicant ID here
  const [signedTerms, setSignedTerms] = useState(); // Store the applicant ID here

  const config = {
    lang: 'en', // Set the language
    // Other Sumsub configuration options here
  };

  const options = {
    // Sumsub options here
  };

  const accessTokenExpirationHandler = async () => {
    console.log("Expiration!")
  };

  const messageHandler = (type, payload) => {
    // Handle Sumsub SDK messages
    console.log('Sumsub SDK Message:', type, payload);
  };

  const errorHandler = (error) => {
    // Handle Sumsub SDK errors
    console.error('Sumsub SDK Error:', error);
  };

  // Function to request the user's signature
  const requestSignature = async () => {
    if (!connected) {
      console.error('MetaMask not found');
      return null;
    }
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const signedMessage = await web3.eth.personal.sign(messageToSign, selectedAddress);
      setSignedTerms(signedMessage);
      return signedMessage;
    } catch (error) {
      console.error('Error requesting signature from MetaMask:', error);
      return null;
    }
  };

  const createApplicant = async (signature) => {
    try {
      const response = await axios.post(EXPRESS_SERVER_URL + '/create-applicant', {
        externalUserId: selectedAddress,
        levelName: levelName,
        signature: signature
      });
      setApplicantId(response.data.id);
      console.log('Applicant created:', response.data);
    } catch (error) {
      console.error('Error creating applicant:', error);
    }
  };

  const createAccessToken = async (signature) => {
    try {
      const response = await axios.post(EXPRESS_SERVER_URL + '/create-access-token', {
        externalUserId: selectedAddress,
        levelName: levelName,
        signature: signature
      });
      setAccessToken(response.data.data.token);
      console.log('Access Token data:', response.data);
    } catch (error) {
      console.error('Error creating access token:', error);
    }
  };


  // Example code for signature verification
  async function verifySignature(signature) {
    try {
      console.log('Received Signature:', signature);
      console.log('Message to Verify:', messageToSign);
      console.log('Selected Address:', selectedAddress);

      // Recover the Ethereum address from the signature
      const recoveredAddress = await web3.eth.personal.ecRecover(messageToSign, signature);
      console.log('Recovered Address:', recoveredAddress);

      // Compare the recovered address with the user's Ethereum address
      if (recoveredAddress.toLowerCase() === selectedAddress.toLowerCase()) {
        // Signature is valid, proceed with contacting SumSub
        return true;
      } else {
        console.error('Recovered address does not match selected address.');
      }
    } catch (error) {
      // Handle verification error
      console.error('Signature verification failed:', error);
    }

    return false;
  }



  const verifyAndCreate = async () => {
    try {
      // Request a signature from MetaMask
      const signature = await requestSignature();

      if (signature !== null) {
        console.log("Message to Verify:", messageToSign);
        console.log("Received Signature:", signature);

        // Verify the signature against the selectedAddress using .then()
        verifySignature(signature)
          .then((isSignatureValid) => {
            console.log("Signature Valid:", isSignatureValid);
            if (isSignatureValid) {
              // Signature is valid, proceed with creating the applicant and access token
              console.log("Signed Terms:", signedTerms);
              return Promise.all([
                createApplicant(signature),
                createAccessToken(signature),
              ]);
            } else {
              console.error('Signature verification failed.');
              // Handle the case where the signature is not valid
            }
          })
          .catch((error) => {
            console.error('Error during verification:', error);
            // Handle errors from verifySignature as needed
          });
      } else {
        console.error('Error requesting signature from MetaMask.');
        // Handle the case where signature is null
      }
    } catch (error) {
      console.error('Error during verification and creation:', error);
      // Handle errors as needed
    }
  };




  const handleConfirmClick = async () => {
    startKYC();
    setIsKycConfirmed(true);

    // Call the verifyAndCreate function
    verifyAndCreate();
  };




  return (
    <div className="modal">
      <div className="modal-overlay"></div>
      <div className="modal-content">
        <h2>You are about to start the KYC process</h2>
        {/* Additional information can be displayed here */}
        {isKycConfirmed && accessToken ? (
          <SumsubWebSdk
            accessToken={accessToken}
            expirationHandler={accessTokenExpirationHandler}
            config={config}
            options={options}
            onMessage={messageHandler}
            onError={errorHandler}
            baseUrl={SUMSUB_BASE_URL}
          />
        ) : null}
        <button className="button" onClick={handleConfirmClick}>
          Confirm
        </button>
        <div>{applicantId}</div>
        <button className="button" onClick={closeKYCModal}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default KYC;
