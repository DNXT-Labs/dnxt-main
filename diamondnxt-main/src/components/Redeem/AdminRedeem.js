import React, { useState, useEffect } from "react";
import * as ABIS from "./../../constants/ABIS";
import * as addresses from "./../../constants/addresses";
import "./../../style/admin.css"


const AdminRedeem = ({ web3, connected, selectedAddress }) => {
  const [redeemRequests, setRedeemRequests] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNftId, setSelectedNftId] = useState(null);

  
  useEffect(() => {
    if (!connected) return;
  
    const contract = new web3.eth.Contract(ABIS.ABIREDEEM, addresses.redeem);
  
    const fetchAndListenForRedeemRequests = async () => {
      const currentBlockNumber = await web3.eth.getBlockNumber();
      const fromBlock = currentBlockNumber - 999;

      contract.getPastEvents('RedeemStarted', {
        fromBlock: fromBlock,
        toBlock: 'latest'
      }).then(events => {
        const pastRequests = events.map(event => {
          const { user, nftId } = event.returnValues;
          return { user, nftId };
        });
        setRedeemRequests(pastRequests);
      }).catch(error => {
        console.error("Error fetching past events:", error);
      });

      contract.events.RedeemStarted({}, (error, event) => {
        if (error) {
          console.error("Error in RedeemRequested event:", error);
          return;
        }
  
        const { user, nftId } = event.returnValues;
        setRedeemRequests(prevRequests => [...prevRequests, { user, nftId }]);
      });
    };
  
    fetchAndListenForRedeemRequests();
  }, [connected, web3]);

  const openModal = (nftId) => {
    setSelectedNftId(nftId);
    setIsModalVisible(true);
  }

  const handleCompleteRedeem = () => {
    if (!selectedNftId) {
      console.error("Token ID missing");
      return;
    }
  
    confirmCompleteRedeem();
  };
  
  const confirmCompleteRedeem = () => {
    if (!connected) {
      console.log("Not connected");
      return;
    }
  
    completeRedeem();
  };
  
  const completeRedeem = async () => {
    const contract = new web3.eth.Contract(ABIS.ABIREDEEM, addresses.redeem);
    
    try {
      await contract.methods.completeRedeem(addresses.dnft, 
        selectedNftId).send({
        from: selectedAddress,
      }).on('receipt', function (receipt) {
        console.log(receipt);
      });
  
      // Close the modal after burning
      setIsModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTokensForRedeemContract = async () => {
    const contract = new web3.eth.Contract(ABIS.ABIDNFT, addresses.dnft);
    const balance = await contract.methods.balanceOf(addresses.redeem).call();
  
    let tokens = [];
    for(let i = 0; i < balance; i++) {
      const tokenId = await contract.methods.tokenOfOwnerByIndex(addresses.redeem, i).call();
      tokens.push(tokenId);
    }
  
    // merge tokens with redeemRequests or do whatever you'd like
    setRedeemRequests(prevRequests => [...prevRequests, ...tokens.map(tokenId => ({ user: 'Redeem Contract', tokenId }))]);
  };
  
  
  

  const ConfirmationModal = ({ isVisible, onConfirm, onCancel, nftId }) => {
    return isVisible ? (
      <div className="modal">
        <div className="modal-content">
          <h4>Confirmation</h4>
          <p>Are you sure you want to complete the redeem for NFT ID: {nftId}?</p>
          <button className="button" onClick={() => onConfirm(nftId)}>Confirm</button>
          <button className="button" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    ) : null;
  };

  return (
    <div className="request-container">
      <h3>Redeem Requests Manager</h3>
      <button className="button" onClick={fetchTokensForRedeemContract}>Load all</button>
      {redeemRequests.length ? (
        <ul>
          {redeemRequests.map((req, index) => (
            <li key={index}>
              User: {req.user}
              <br></br>
              ID: {req.nftId}
              <br></br>
              <button className="button" onClick={() => openModal(req.nftId)}>Complete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No redeem requests found.</p>
      )}

      <ConfirmationModal
        isVisible={isModalVisible}
        onConfirm={handleCompleteRedeem}
        onCancel={() => setIsModalVisible(false)}
        nftId={selectedNftId}
      />
    </div>
  );
};

export default AdminRedeem;
