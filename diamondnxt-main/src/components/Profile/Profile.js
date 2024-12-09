import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { SwitchToPolygon } from "../Network/SwitchNetwork.js";
import * as ABIS from "../../constants/ABIS";
import * as addresses from "../../constants/addresses";
import UserStatus from "./UserStatus.js";
import Portfolio from "./Portfolio.js";
import Price from "../Price/Price.json"

const commonBoxStyles = {
  bg: "var(--color-8)",
  borderRadius: "16px",
  p: "16px",
};


const Profile = ({
  web3,
  connected,
  connectWallet,
  selectedAddress,
  etherBalance,
  dnxtBalance,
}) => {
  const [nftBalances, setNftBalances] = useState([]);
  const [nftNumberBalance, setNftNumberBalance] = useState(0);

  // Fetch NFT balances
  useEffect(() => {
    if (connected) {
      const getNftBalances = async () => {
        const dnftContract = new web3.eth.Contract(ABIS.ABIDNFT, addresses.dnft);
        const totalNftBalance = await dnftContract.methods.balanceOf(selectedAddress).call();
        setNftNumberBalance(totalNftBalance);
        const nftBalances = [];

        for (let i = 0; i < totalNftBalance; i++) {
          const tokenId = await dnftContract.methods.tokenOfOwnerByIndex(selectedAddress, i).call();
          // Generate the image URL based on the tokenId
          const imageUrl = `https://dnxt.app/images/${tokenId}.jpg`;
          const price = Price[tokenId];
          // Add this information to nftDetails object.
          const nftDetails = {
            tokenId,
            imageUrl,
            price,
          };
          nftBalances.push(nftDetails);
        }

        setNftBalances(nftBalances);
      };
      getNftBalances();
    }
  }, [connected, selectedAddress, web3]);

  const totalDiamondValue = nftBalances.reduce((total, nft) => {
    return total + (nft.price || 0);
  }, 0);

  return (
      connected ? (
        window.ethereum.chainId === "0x89" ? (
          <Box maxW="1200px" bg="var(--color-8)" borderRadius="16px" m="0 auto" p="20px" mt="128px" display="flex" flexWrap="wrap" justifyContent="center" alignItems="center">
          <Box {...commonBoxStyles} margin="16px" marginTop="0px" textAlign="center">
              <UserStatus
                selectedAddress={selectedAddress}
                web3={web3}
                connected={connected}
              />
            </Box>
            <Box {...commonBoxStyles} margin="16px">
              <Portfolio dnxtBalance={dnxtBalance} etherBalance={etherBalance} nftNumberBalance={nftNumberBalance} totalDiamondValue={totalDiamondValue} />
            </Box>
            <Box
              display="grid"
              gridTemplateColumns="repeat(4, 1fr)"
              gap="16px"
              mt="16px"
              {...commonBoxStyles}
            >
              {nftBalances.length > 0 ? (
                nftBalances.map((nft, index) => (
                  <Box
                    key={index}
                    {...commonBoxStyles}
                    textAlign="center"
                    mb="16px"
                  >
                    <Box color="var(--white)" fontWeight="300" fontSize="16px">
                      {nft.tokenId}
                    </Box>
                    <a
                      href={`https://dnxt.app/#/explorer/${nft.tokenId}`} // Replace with the actual explorer URL
                      target="_blank" // Open the link in a new tab/window
                      rel="noopener noreferrer" // Recommended for security reasons
                    >
                      <Box as="img" src={nft.imageUrl} alt={`Diamond #${nft.tokenId}`} maxW="100%" maxH="150px" objectFit="cover" borderRadius="16px" />
                    </a>
                  </Box>
                ))
              ) : (
                <Box
                  as="h2"
                  textAlign="center"
                  {...commonBoxStyles}
                  color="var(--white)"
                  fontWeight="300"
                  fontSize="16px"
                  mt="16px"
                  mb="16px"
                >
                  You currently have no diamonds.
                </Box>
              )}
            </Box>
            </Box>
        ) : (
          <SwitchToPolygon connectWallet={connectWallet} connected={connected} />
        )
        ) : (<><br></br><br></br><br></br><br></br><br></br><br></br><button className="button" onClick={() => connectWallet()}>Connect</button></>)

      
  );
};

export default Profile;
