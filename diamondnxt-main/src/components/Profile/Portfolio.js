import React, { useEffect, useState } from 'react';
import { SimpleGrid, Box } from '@chakra-ui/react';
import MiniStatistics from './Ministatistics';

const Portfolio = ({ dnxtBalance, etherBalance, nftNumberBalance, totalDiamondValue }) => {
    const [maticPrice, setMaticPrice] = useState(0);
    const dnxtPrice = 0.3;

    const fetchPrices = async () => {
        try {
            // const maticPriceResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=matic&vs_currencies=usd');
            // console.log('Matic price:', maticPriceResponse.data.matic.usd);
            // Set the prices from the API response
            // setMaticPrice(maticPriceResponse.data.matic.usd);
            setMaticPrice(0.54);
        } catch (error) {
            console.error('Error fetching prices:', error);
        }
    };

    useEffect(() => {
        fetchPrices();
    }, []);

    const maticValue = etherBalance * maticPrice;
    const dnxtValue = dnxtBalance * dnxtPrice;

    const portfolioValue = maticValue + dnxtValue + totalDiamondValue;

    return (
        <>
        <h2 className="section-title">Portfolio</h2>
        <SimpleGrid columns={2} spacing={10}>
        <Box bg="var(--color-9)" p={4} borderRadius="md">
            <MiniStatistics name="Matic Value" value={`$${maticValue.toFixed(2)}`} />
          </Box>
          <Box bg="var(--color-7)" p={4} borderRadius="md">
            <MiniStatistics name="Matic" value={`${etherBalance > 0 ? parseFloat(etherBalance).toFixed(2) : 0}`} />
          </Box>
          <Box bg="var(--color-9)" p={4} borderRadius="md">
            <MiniStatistics name="DNXT Value" value={`$${dnxtValue.toFixed(2)}`} />
          </Box>
          <Box bg="var(--color-7)" p={4} borderRadius="md">
            <MiniStatistics name="DNXT" value={`${dnxtBalance > 0 ? parseFloat(dnxtBalance).toFixed(2) : 0}`} />
          </Box>
          <Box bg="var(--color-9)" p={4} borderRadius="md">
            <MiniStatistics name="Diamond Value" value={`$${totalDiamondValue.toFixed(2)}`} />
          </Box>
          <Box bg="var(--color-7)" p={4} borderRadius="md">
          <MiniStatistics name="Diamonds" value={`${nftNumberBalance}`} />
          </Box>
          <Box bg="var(--color-6)" p={4} borderRadius="md">
            <MiniStatistics name="Portfolio Value" value={`$${portfolioValue.toFixed(2)}`} />
          </Box>
        </SimpleGrid>
      </>
    
    );
};

export default Portfolio;