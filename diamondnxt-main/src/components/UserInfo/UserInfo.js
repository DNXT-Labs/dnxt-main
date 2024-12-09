import React, { useState, useEffect, useRef } from "react";
import matic from './../../images/matic.png';
import eth from './../../images/eth.png';
import logo from './../../images/logo.svg';
import NetworkSelect from "../Network/NetworkSelect";
import Menu from "../Menu/Menu";
import "./../../style/header.css";


const UserInfo = (props) => {

  const [isModalOpen, setModalOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [activeTab, setActiveTab] = useState(null);
  const modalRef = useRef(null);


  const logoeth = () => {
    switch (window.ethereum.chainId) {
      case "0x1": // ETH
        return (<img src={eth} alt="ETH logo" />);
      case "0x89": // MATIC
        return (<img src={matic} alt="MATIC logo" />);
      default:
        return null; // Add a default case
    }
  }

  const explorer = () => {
    switch (window.ethereum.chainId) {
      case "0x1": // ETH
        return ("https://etherscan.io/address/");
      case "0x89": // MATIC
        return ("https://polygonscan.com/address/");
      default:
        return "#"; // Return a default value so it won't break the link
    }
  }


  const selectedNetwork = () => {
    switch (window.ethereum.chainId) {
      case "0x1": // ETH
        return ("Ethereum");
      case "0x89": // MATIC
        return ("Polygon");
      default:
        return null; // Add a default case
    }
  }

  // Captures 0x followed by 4 characters, then any number of characters, and ends with the last 4 characters.
  const truncateRegex = /^(0x[a-zA-Z0-9]{4}).*(.{4})$/;

  const truncateEthAddress = (address) => {
    if (typeof address !== 'string' || !address.match(truncateRegex)) {
      return address; // Return the original address if it's not a valid string or doesn't match the regex.
    }

    const match = address.match(truncateRegex);
    return `${match[1]}…${match[2]}`;
  };

  const renderModalContent = () => {
    switch (activeTab) {
      case 'menu':
        return <Menu />;
      case 'wallet':
        return <WalletInfo />;
      case 'search':
        return <div><input className="input" type="text" placeholder="Search..." /></div>;
      case 'profile':
        return <div>{<div className="user-address-value">
          <b>
            <a target="_blank" rel="noopener noreferrer" id="toExplorer" href={explorer() + props.selectedAddress}>
              {truncateEthAddress(props.selectedAddress)}
            </a>
          </b>
        </div>}</div>;
      default:
        return null;
    }
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    setModalOpen(true);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileView]);

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isModalOpen]);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setModalOpen(false);
    }
  };


  const MenuBar = () => (
    <div className="menuBar">
      <div className="menuItem" onClick={() => handleTabClick('menu')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
        </svg>
      </div>
      <div className="menuItem" onClick={() => handleTabClick('wallet')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-wallet2" viewBox="0 0 16 16">
          <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z" />
        </svg>
      </div>
      <div className="menuItem" onClick={() => handleTabClick('search')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
        </svg>
      </div>
      <div className="menuItem" onClick={() => handleTabClick('profile')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
          <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        </svg>
      </div>
    </div>
  );

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(function () {
      console.log('Copied to clipboard successfully!');
    }, function (err) {
      console.error('Unable to copy', err);
    });
  }

  const WalletInfo = () => (
    !props.connected ? (
      <NetworkSelect {...props} selectedNetwork={selectedNetwork} />
    ) : (
      <>
        <div className="network">
          <div className="user-address-label">Address:</div>
          <div className="user-address-value">
            <b>
              <a target="_blank" rel="noopener noreferrer" id="toExplorer" href={explorer() + props.selectedAddress}>
                {truncateEthAddress(props.selectedAddress)}
              </a>
            </b>
            <svg onClick={() => copyToClipboard(props.selectedAddress)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6ZM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z" />
            </svg>
          </div>
          <div className="balances-value">
            <div>
              <b>
                {props.dnxtBalance > 0 ? parseFloat(props.dnxtBalance).toFixed(3) : 0}
                <span>
                  <img src={logo} alt="DNXT logo" style={{ verticalAlign: 'middle', display: 'inline-block' }} />
                  DNXT
                </span>
              </b>
            </div>
          </div>

        </div>
        <div className="network">
          <NetworkSelect {...props} selectedNetwork={selectedNetwork} />
          <div className="logoeth">{logoeth()}</div>
        </div>
      </>
    )
  );


  return (
    <div id="userInfo">
      <MenuBar />
      {isModalOpen && (
        <div className="modalOverlay" ref={modalRef}>
          <div className="modalContent">
            {renderModalContent()}

          </div>
        </div>
      )}
    </div>
  );



}

export default UserInfo;
