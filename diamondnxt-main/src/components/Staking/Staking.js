import React, { useState, useEffect, useCallback, useMemo } from "react";
import * as ABIS from "./../../constants/ABIS";
import * as addresses from "./../../constants/addresses";
import "./../../style/Staking.css"; // Import your CSS file

const Staking = ({ web3, connected, connectWallet, selectedAddress, dnxtBalance }) => {

  const [inputAmount, setInputAmount] = useState();
  const [stakeAmount, setStakeAmount] = useState();
  const [allowanceAmount, setAllowanceAmount] = useState();
  const [activeLevel, setActiveLevel] = useState(0);
  const [selectedTab, setSelectedTab] = useState("STAKE");


  // Define your discount levels here
  const discountLevels = useMemo(() => [
    { level: 0, amount: 0, discount: "0%" },
    { level: 1, amount: 100, discount: "0.3%" },
    { level: 2, amount: 1000, discount: "1%" },
    { level: 3, amount: 10000, discount: "2%" },
    { level: 4, amount: 100000, discount: "4%" },
    { level: 5, amount: 1000000, discount: "6%" },
  ], []);


  const updateActiveLevel = useCallback(() => {
    // Iterate through discountLevels array from highest level to lowest
    for (let i = discountLevels.length - 1; i >= 0; i--) {
      const levelData = discountLevels[i];

      // Check if the user's DNXT balance exceeds the current level's amount
      if (stakeAmount >= levelData.amount) {
        setActiveLevel(levelData.level);
        break; // Exit the loop once the highest level is found
      }
    }
  }, [discountLevels, stakeAmount]);


  useEffect(() => {
    if (connected) {
      const checkStake = async () => {
        const stakingContract = new web3.eth.Contract(ABIS.ABISTAKING, addresses.staking);
        const stakeAmount = await stakingContract.methods.staked(selectedAddress).call();
        setStakeAmount(web3.utils.fromWei(stakeAmount, "ether"));
        updateActiveLevel();
      };

      const checkAllowance = async () => {
        const dnxt = new web3.eth.Contract(ABIS.ABIDNXT, addresses.dnxt);
        const allowance = await dnxt.methods.allowance(selectedAddress, addresses.staking).call();
        setAllowanceAmount(allowance);
        console.log("allowance: " + allowance);
      };

      checkStake();
      updateActiveLevel();
      checkAllowance();
    }
  }, [connected, selectedAddress, web3, updateActiveLevel]);

  const approve = () => {
    if (!connected) {
      console.log("Not connected");
      return;
    }

    approveToken();

    async function approveToken() {
      let staking = new web3.eth.Contract(ABIS.ABIDNXT, addresses.dnxttest);
      try {
        await staking.methods.approve(
          addresses.staking,
          web3.utils.toWei(inputAmount, 'ether')
        ).send({
          from: selectedAddress,
        }).on('receipt', function (receipt) {
          console.log(receipt);
        });

      } catch (error) {
        console.error(error);
      }
    }
  };

  const stake = () => {
    if (!connected) {
      console.log("Not connected");
      return;
    }

    stakeToken();

    async function stakeToken() {
      let staking = new web3.eth.Contract(ABIS.ABISTAKING, addresses.staking);
      try {
        await staking.methods.stake(
          web3.utils.toWei(inputAmount, 'ether')
        ).send({
          from: selectedAddress,
        }).on('receipt', function (receipt) {
          console.log(receipt);
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const stakeOrApprove = async () => {
    if (!connected) {
      console.log("Not connected");
      return;
    }

    if (!inputAmount || parseFloat(inputAmount) <= 0) {
      console.log("Invalid stake amount");
      return;
    }
    if (parseFloat(allowanceAmount) >= parseFloat(inputAmount)) {
      // If allowance is sufficient, directly stake
      stake();
    } else {
      // If allowance is not enough, approve the contract
      approve();
    }
  };

  const unstake = () => {
    if (!connected) {
      console.log("Not connected");
      return;
    }

    unstakeToken();

    async function unstakeToken() {
      let staking = new web3.eth.Contract(ABIS.ABISTAKING, addresses.staking);
      try {
        await staking.methods.unstake(
          web3.utils.toWei(inputAmount, 'ether')
        ).send({
          from: selectedAddress,
        }).on('receipt', function (receipt) {
          console.log(receipt);
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Function to handle the "Max" button click event
  const handleMaxButtonClick = () => {
    if (selectedTab === "STAKE") {
      setInputAmount(dnxtBalance.toString());
    } else if (selectedTab === "UNSTAKE") {
      setInputAmount(stakeAmount.toString());
    }
  };



  // Calculate the total fee (fee - discount = 10% - discount)
  const calculateTotalFee = (discount) => {
    const fee = 10; // 10% fee
    return fee - parseFloat(discount);
  };

  const handleInputAmountChange = (event) => {
    setInputAmount(event.target.value);
  };

  // Function to handle tab selection
  const handleTabSelect = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <div className="staking-container">
      <div className="staking-balance">
        <div className="staking-tabs">
          <button
            className={`tab-button ${selectedTab === "STAKE" ? "active" : ""}`}
            onClick={() => handleTabSelect("STAKE")}
          >
            STAKE
          </button>
          <button
            className={`tab-button ${selectedTab === "UNSTAKE" ? "active" : ""}`}
            onClick={() => handleTabSelect("UNSTAKE")}
          >
            UNSTAKE
          </button>
        </div><div className="level-name">
          <p>DNXT Balance: {connected ? parseFloat(dnxtBalance).toFixed(2) : '0.00'} DNXT</p>
          <p>DNXT Staked: {connected ? parseFloat(stakeAmount).toFixed(2) : '0.00'} DNXT</p>
        </div>
        <div className="input-container">
          <input
            className="stake-input"
            type="number"
            value={inputAmount}
            onChange={handleInputAmountChange}
          />
          <button className="max-button" onClick={handleMaxButtonClick}>
            Max
          </button>
        </div>
        {connected ? (
          selectedTab === "STAKE" ? (
            <button className="button" onClick={() => stakeOrApprove()}>Stake</button>
          ) : (
            <button className="button" onClick={() => unstake()}>Unstake</button>
          )
        ) : (
          <button className="button" onClick={() => connectWallet()}>Connect Wallet</button>
        )}
      </div>
      <div className="staking-levels">
        {/* Render discount levels */}
        {discountLevels.map((levelData) => (
          <div
            className={`staking-level ${levelData.level === activeLevel ? "selected" : ""
              }`}
            key={levelData.level}
          >
            <div className="level-info">
              <div className="level-name">Level {levelData.level}: {levelData.amount} DNXT</div>
              <div className="level-fee">
                Fee: {calculateTotalFee(levelData.discount)}% {"(-"}{parseFloat(discountLevels[levelData.level].discount) * 10}{"%)"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Staking;
