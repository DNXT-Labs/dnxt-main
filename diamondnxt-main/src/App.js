import React from "react";
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Wallet from "./components/Wallet/Wallet";
import Dapp from "./components/Dapp/Dapp.js";
import Explorer from "./components/Explorer/Explorer.js";
import "./style/app.css";
import Home from "./components/Home/Home.js";
import Profile from "./components/Profile/Profile.js";
import Redeem from "./components/Redeem/Redeem.js";
import Staking from "./components/Staking/Staking.js";
import DetailsCard from "./components/Explorer/views/DetailsCard.js";
import UserInfo from "./components/UserInfo/UserInfo.js";

const App = () => {
    const walletProps = Wallet();
    return (
        <Router>
            <Routes>
                <Route path="/explorer/:id" element={<DetailsCard {...walletProps} />} />
                <Route path="/explorer" element={<Explorer {...walletProps}/>} />
                <Route path="/dapp" element={<Dapp {...walletProps} />} />
                <Route path="/profile" element={<Profile {...walletProps} />} />
                <Route path="/redeem" element={<Redeem {...walletProps} />} />
                <Route path="/staking" element={<Staking {...walletProps} />} />
                <Route path="/" element={<Home />} />
            </Routes>
            <UserInfo {...walletProps} />
        </Router>
    )
}

export default App;
