/*const INFURA_KEY = process.env.REACT_APP_INFURA_KEY
if (typeof INFURA_KEY === 'undefined') {
  throw new Error(`REACT_APP_INFURA_KEY must be a defined environment variable`)
}*/

export const networks = [
  {
    id: 1,
    name: "ethereum",
    label: "Ethereum",
    image: "eth.png",

    wrappedNativeToken: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",

    params: {
      chainId: "0x1",
      chainName: "Ethereum",
      nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: ["https://mainnet.infura.io/v3/21539129b02d4585ab8f50afb96ac2b5"],
      blockExplorerUrls: ["https://etherscan.io/"],
    },
  },
  {
    id: 137,
    name: "matic",
    label: "Polygon",
    image: "bnb.png",

    wrappedNativeToken: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",

    params: {
      chainId: "0x89",
      chainName: "MATIC MAINNET",
      nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18,
      },
      rpcUrls: ["https://rpc-mainnet.maticvigil.com/"],
      blockExplorerUrls: ["https://polygonscan.com"],
    },
  },
];
export default networks;
