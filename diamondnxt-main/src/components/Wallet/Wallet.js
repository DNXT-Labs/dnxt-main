import Web3 from "web3";
import Web3Modal from "web3modal";
import { useState, useEffect } from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import networks from "../Network/Networks";
import { dnxt } from "../../constants/addresses";
import { ABIDNXT } from "../../constants/ABIS";

export default function Wallet() {
  const [loading, setLoading] = useState(false);
  const [dnxtBalance, setTokens] = useState([])
  const [web3, setMyWeb3] = useState()
  const [etherBalance, setEtherBalance] = useState()
  const [connected, setConnected] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState()
  const [networkId, setNetworkId] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      setNetworkId(window.ethereum.chainId);
    }
  }, []);

  //
  const connectWallet = async () => {
    await getWeb3().then((web3) => {
      setMyWeb3(web3)
      setConnected(true)
      //
      web3.eth.getAccounts().then((result) => {
        setSelectedAddress(result[0])
        getBalances(web3, result[0])
        if (web3.currentProvider.chainId === "0x89") {
          getTokenBalance(web3, result[0])
        }

      })
      setNetworkId(window.ethereum.chainId);
    })
  }


  const getTokenBalance = async (web3, selectedAddress) => {
    const tokenContract = new web3.eth.Contract(ABIDNXT, dnxt);
    const balance = await tokenContract.methods.balanceOf(selectedAddress).call();
    setTokens(web3.utils.fromWei(balance, 'ether'));
  }

  const getBalances = async (web3, selectedAddress) => {
    web3.eth.getBalance(selectedAddress).then((value) => {
      var ether = value;
      setEtherBalance(web3.utils.fromWei(ether, "ether"));
    }); 
  }


  const getWeb3 = async () => {
    setLoading(true);
    let web3Modal;
    let provider;
    let web3;
    let providerOptions;
    providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: "27e484dcd9e3efcfd25a83a78777cdf1 ", // required
        },
      },
      metamask: {
        id: "injected",
        name: "MetaMask",
        type: "injected",
        check: "isMetaMask",
      },
    };

    web3Modal = new Web3Modal({
      cacheProvider: true,
      disableInjectedProvider: false,
      providerOptions,
    });
    provider = await web3Modal.connect();
    provider.on("error", (e) => console.error("WS Error", e));
    provider.on("end", (e) => console.error("WS End", e));
    provider.on("disconnect", (e) => console.error("WS Disconnect", e));
    provider.on("connect", (info) => {
      console.log("connected");
    });

    window.ethereum.on('chainChanged', function () {
      connectWallet();
    })

    window.ethereum.on("accountsChanged", () => {
      console.log("account changed");
      connectWallet();
    });


    web3 = new Web3(provider);
    setLoading(false);

    return web3;
  }

  return {
    loading,
    getWeb3,
    dnxtBalance, web3, networks, connected, networkId, selectedAddress, getBalances, connectWallet, etherBalance
  }
}