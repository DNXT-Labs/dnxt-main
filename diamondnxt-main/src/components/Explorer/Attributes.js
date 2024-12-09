import React from "react";

const Attributes = (data) => {
    return (
        <>
            <div className="attribute">
                <div className="title">{data.data.trait_type}</div>
                <div className="subtitle">{data.data.value}</div>
            </div>
        </>
    );
}

export default Attributes;
