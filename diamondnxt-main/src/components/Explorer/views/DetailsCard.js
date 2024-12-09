import React, { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';

const DetailsCard = ({ web3, connected, connectWallet, selectedAddress }) => {
    let { id } = useParams();
    const buyLink = `https://vitale.dnxt.app/token/POLYGON:0x97b984b5751009def5f50fdc51477e3821b53050:${id}`;

    const AttributeItem = ({ name, value }) => (
        <div className="attribute-item">
          <span className="attribute-name">{name}</span>
          <span className="attribute-value">{value}</span>
        </div>
      );
      

      const [nftdata, setNftData] = useState(null);

      useEffect(() => {
          // Fetch the JSON data when the component mounts
          fetch(`https://dnxt.app/json/${id}.json`)
              .then(response => response.json())
              .then(data => setNftData(data))
              .catch(error => console.error("Error fetching NFT data:", error));
      }, [id]); // The dependency array ensures the fetch is re-run if the 'id' changes
      
      const attributesbox = () => {
          if (!nftdata) return null; // Return null or a loading spinner if the data hasn't been fetched yet
      
          // ... (rest of your function remains unchanged)
      
      
        return (
            <div className="attributes-container">                
                <div className="primary-attributes">
                    {nftdata.attributes.map((value, index) => {
                        if (["Cut", "Clarity", "Color", "Carat Weight"].includes(value.trait_type)) {
                            return <AttributeItem name={value.trait_type} value={value.value} key={index} />;
                        }
                        return null;
                    })}
                </div>
                
                <div className="secondary-attributes">
                    {nftdata.attributes.map((value, index) => {
                        if (["Symmetry", "Fluorescence", "Polish", "Shape"].includes(value.trait_type)) {
                            return <AttributeItem name={value.trait_type} value={value.value} key={index} />;
                        }
                        return null;
                    })}
                </div>
                
                <div className="certification">
                    {nftdata.attributes.map((value, index) => {
                        if (["Certificate Issuer", "Certificate Number"].includes(value.trait_type)) {
                            return <AttributeItem name={value.trait_type} value={value.value} key={index} />;
                        }
                        return null;
                    })}
                </div>
            </div>
        );
    }
    

    return (
        <>
            <div className="card-big">
                <div className="card-big--image-container">
                    <img className="card-big--image" src={"https://dnxt.app/images/" + id + ".jpg"} alt="Diamond" />
                    <div>
                    <Link className="attribute" to={"/explorer/" + (id - 1)}>
                            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd">
                                <path fill="#ffffff" d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm3 5.753l-6.44 5.247 6.44 5.263-.678.737-7.322-6 7.335-6 .665.753z" />
                            </svg>
                        </Link>
    
                        <Link className="attribute" to={"/explorer/" + (parseInt(id) + 1)}>
                            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd">
                                <path fill="#ffffff" d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm-3 5.753l6.44 5.247-6.44 5.263.678.737 7.322-6-7.335-6-.665.753z" />
                            </svg>
                        </Link>
                    </div>
                    <div className="card-big--links">
                    <a href={buyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button"
                    >
                        BUY
                    </a>
                    <Link className="button" to="/explorer">EXPLORE</Link>
                </div>
                </div>
                <div className="card-big--attributes">
                    <h1 className="title"><span>Diamond #{id}</span></h1>
                    {attributesbox()}
                </div>

            </div>
        </>
    );
    
    
}

export default DetailsCard;
