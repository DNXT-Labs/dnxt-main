import React, { useEffect, useState } from "react";
import { SwitchToPolygon } from "../Network/SwitchNetwork.js";
import "./../../style/Redeem.css";
import * as ABIS from "./../../constants/ABIS";
import * as addresses from "./../../constants/addresses";
import DeliveryOptions from "./DeliveryOptions.js";
import TermsModal from "./TermsModal.js";

const Redeem = ({
  web3,
  connected,
  connectWallet,
  selectedAddress,
}) => {
  const [nftBalances, setNftBalances] = useState([]);
  const [selectedDiamonds, setSelectedDiamonds] = useState([]);
  const [showModal, setShowModal] = useState(false); // State for displaying the modal
  const [isLoading, setIsLoading] = useState(true);

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const previousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return <TermsModal
          showModal={showModal}
          showTermsModal={showTermsModal}
          setShowTermsModal={setShowTermsModal}
          nextStep={nextStep} />;
      case 2:
        return (
          <>
            {showModal && renderDiamondsToRedeem()}
            {showModal && <DeliveryOptions nextStep={nextStep} />}
          </>
        );
      case 3:
        return (
          <>
            {showModal && (
              <div>
                <p>You are about to initiate the redemption process, which will lock your NFT. Please be aware that once the redemption is initiated, you will no longer have access to your NFT.</p>
                <button className="button" onClick={redeemSelectedDiamonds}>
                  Confirm
                </button>
                <button className="button" onClick={previousStep}>
                  Back
                </button>
                <button className="button" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };




  const isApprovedForAll = async () => {
    const dnftContract = new web3.eth.Contract(ABIS.ABIDNFT, addresses.dnft);
    return await dnftContract.methods.isApprovedForAll(selectedAddress, addresses.redeem).call();
  };

  const requestApproval = async () => {
    try {
      const dnftContract = new web3.eth.Contract(ABIS.ABIDNFT, addresses.dnft);
      await dnftContract.methods.setApprovalForAll(addresses.redeem, true).send({ from: selectedAddress });
      return true;
    } catch (error) {
      console.error("Error during approval request:", error);
      alert("Failed to grant approval. Check the console for details.");
      return false;
    }
  };


  const closeModal = () => {
    setShowModal(false);
  };

  const renderDiamondsToRedeem = () => {
    // Render the list of diamonds to be redeemed within the modal
    return (
      <div>
        {/* Iterate over selectedDiamonds and display information */}
        {selectedDiamonds.map((diamond) => (
          <div key={diamond}>
            <p>Diamond ID: {diamond} Details:</p>
            {/* Display diamond details here */}
          </div>
        ))}
      </div>
    );
  };

  const redeemSelectedDiamonds = async () => {
    try {
      // Check if already approved
      const approved = await isApprovedForAll();

      if (!approved) {
        const hasApproved = await requestApproval();
        if (!hasApproved) return; // Exit if approval was not granted
      }

      const redeemContract = new web3.eth.Contract(ABIS.ABIREDEEM, addresses.redeem);
      const txPromises = [];

      for (const tokenId of selectedDiamonds) {
        const tx = redeemContract.methods.redeem(addresses.dnft, tokenId).send({ from: selectedAddress });
        txPromises.push(tx);
      }

      await Promise.all(txPromises);
      alert("Redemption process started for selected diamonds!");

      // Update the UI by removing redeemed diamonds from the list
      setNftBalances(nftBalances.filter(nft => !selectedDiamonds.includes(nft.tokenId)));
      setSelectedDiamonds([]);
      closeModal();
    } catch (error) {
      console.error("Error during redemption:", error);
      alert("Redemption failed. Check the console for details.");
    }
  };



  const handleCheckboxChange = (tokenId) => {
    if (selectedDiamonds.includes(tokenId)) {
      // If the diamond is already selected, remove it from the list
      setSelectedDiamonds(selectedDiamonds.filter((id) => id !== tokenId));
    } else {
      // If the diamond is not selected, add it to the list
      setSelectedDiamonds([...selectedDiamonds, tokenId]);
    }
  };


  // Fetch NFT balances
  useEffect(() => {
    if (connected) {

      const getNftBalances = async () => {
        setIsLoading(true);
        const dnftContract = new web3.eth.Contract(ABIS.ABIDNFT, addresses.dnft);
        const totalNftBalance = await dnftContract.methods.balanceOf(selectedAddress).call();
        const nftBalances = [];

        for (let i = 0; i < totalNftBalance; i++) {
          const tokenId = await dnftContract.methods.tokenOfOwnerByIndex(selectedAddress, i).call();
          // Generate the image URL based on the tokenId
          const imageUrl = `https://dnxt.app/images/${tokenId}.jpg`;
          // Add this information to nftDetails object.
          const nftDetails = {
            tokenId,
            imageUrl,
          };
          nftBalances.push(nftDetails);
        }

        setNftBalances(nftBalances);
        setIsLoading(false);
      };

      getNftBalances();
    }
  }, [connected, selectedAddress, web3]);


  return (
    connected ? (
      window.ethereum.chainId === "0x89" ? (
        <div className="redeem-container">
          <h2 className="title">Redeem Your NFTs</h2>
          {isLoading ? (
            <p className="subtitle">Loading...</p>
          ) : (
            nftBalances.length > 0 ? (
              <div className="nft-list">
                {nftBalances.map((nft, index) => (
                  <div key={index} className="nft-item">
                    <input
                      type="checkbox"
                      onChange={() => handleCheckboxChange(nft.tokenId)}
                      checked={selectedDiamonds.includes(nft.tokenId)}
                    />
                    <a
                      href={`https://dnxt.app/#/explorer/${nft.tokenId}`} // Replace with the actual explorer URL
                      target="_blank" // Open the link in a new tab/window
                      rel="noopener noreferrer" // Recommended for security reasons
                    >
                      <label className="subtitle">Diamond ID: {nft.tokenId}</label>
                      <img src={nft.imageUrl} alt={`Diamond #${nft.tokenId}`} />
                    </a>
                    {/* Add more NFT details */}
                  </div>
                ))}
              </div>
            ) : (
              <p className="subtitle">No NFTs to redeem.</p>
            )
          )}


          <button className="button" onClick={() => { setShowModal(true); setShowTermsModal(true); }}>
            Redeem Selected
          </button>
          {showModal && (
            <div className="modal">
              <div className="modal-overlay" onClick={closeModal}></div>
              <div className="modal-content">
                {renderContent()}
              </div>
            </div>
          )}


        </div>
      ) : (
        <><br></br><br></br><br></br><br></br><br></br><SwitchToPolygon connectWallet={connectWallet} connected={connected} /></>
      )
    ) : (
      <><br></br><br></br><br></br><br></br><br></br><br></br><button className="button" onClick={() => connectWallet()}>Connect</button></>
    )
  );
};

export default Redeem;
