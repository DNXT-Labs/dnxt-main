import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { extendTheme, ChakraProvider } from '@chakra-ui/react';

const customColors = {
  white: "hsl(0, 0%, 100%)",
  color0: "#E3E8ED",
  color1: "#CFD5DC",
  color2: "#BAC2CA",
  color3: "#A5AEC0",
  color4: "#8996A8",
  color5: "#6C7B94",
  color6: "#5A6378",
  color7: "#404953",
  color8: "#343A40",
  color9: "#212529",
};

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: customColors.color9, // Set the desired background color here
      },
      ".nft-list": {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "16px",
      },
      ".nft-item": {
        padding: "16px",
        backgroundColor: "var(--color-8)",
        borderRadius: "16px",
        boxShadow:
          "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        textAlign: "center",
        marginBottom: "16px",
      },
      ".nft-item img": {
        maxWidth: "100%",
        maxHeight: "150px",
        objectFit: "cover",
        borderRadius: "16px",
      },
    },
  },
    components: {
    Button: {
      baseStyle: {
        bg: customColors.color7,
        borderRadius: "16px",
        color: customColors.color1,
        cursor: "pointer",
        fontSize: "16px",
        padding: "12px 24px",
        transition: "transform 0.3s, background-color 0.3s",
        fontWeight: 600,
        textShadow: "1px 1px 1px " + customColors.color8,
      },
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals(console.log);
