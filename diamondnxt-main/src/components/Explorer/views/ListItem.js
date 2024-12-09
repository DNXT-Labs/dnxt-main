import React from "react";
import Price from "../../Price/Price.json";

const ListItem = ({ data }) => {
  // Destructure the data to extract only the required fields
  const { image, name, attributes } = data;

  // Filter attributes to get only cut, color, clarity, and caratWeight
  const filteredAttributes = attributes.filter((attr) =>
    ["Cut", "Color", "Clarity", "Carat Weight", "Fluorescence", "Polish", "Symmetry", "Shape"].includes(attr.trait_type)
  );

  // Retrieve the price for the corresponding NFT ID
  const price = Price[data.id];

  return (
    <div className="list-item">
      <div className="list-cell">
        <img src={image} alt={name} className="diamond-image" />
      </div>
      <div className="list-cell">{name}</div>
      <div className="list-cell">${price}</div>
      {filteredAttributes.map((attr, idx) => (
        <div className="list-cell" key={idx}>
          {attr.value}
        </div>
      ))}
    </div>
  );
};

export default ListItem;
