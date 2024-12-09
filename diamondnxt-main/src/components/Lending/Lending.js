import React from 'react';

const LendingComponent = ({ 
    principal, 
    repayment, 
    duration, 
    APR, 
    contractAddress, 
    id, 
    picture, 
    name, 
    polygonScanLink, 
    openSeaLink, 
    raribleLink, 
    explorerLink, 
    circleProgress, 
    remainingAmount, 
    callActions 
}) => {
    return (
        <div className="lending-component">
            <div className="lending-card">
                <div className="lending-info">
                    <h2>{name}</h2>
                    <img src={picture} alt={name} />
                    <p>Principal: {principal}</p>
                    <p>Repayment: {repayment}</p>
                    <p>Duration: {duration}</p>
                    <p>APR: {APR}</p>
                    <p>Contract Address: {contractAddress}</p>
                    <p>ID: {id}</p>
                    <div>
                        <a href={polygonScanLink}>Polygon Scan</a>
                        <a href={openSeaLink}>OpenSea</a>
                        <a href={raribleLink}>Rarible</a>
                        <a href={explorerLink}>Explorer</a>
                    </div>
                    <div className="progress-bar">
                        <div className="progress" style={{ width: `${circleProgress}%` }}></div>
                    </div>
                    <p>Remaining Amount: {remainingAmount}</p>
                </div>
                <div className="call-actions">
                    {callActions.map((action, index) => (
                        <button key={index} onClick={action.handler}>
                            {action.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LendingComponent;
