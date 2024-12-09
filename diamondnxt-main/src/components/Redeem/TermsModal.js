import React from 'react';

const TermsModal = ({ showModal, showTermsModal, setShowTermsModal, nextStep }) => {

  const handleAccept = () => {
    // Logic to proceed to the next step and display the delivery options modal
    setShowTermsModal(false); // Close the terms modal
    nextStep(); // Call the nextStep function to proceed to the next step
  };

  return (
    showTermsModal && (
      <div className="terms-modal">
        <div className="terms-content">
          <h2>Terms and Conditions</h2>
          <p>
            I have read the guide and understand the terms and conditions. Click{' '}
            <a href="/guide-link" target="_blank" rel="noopener noreferrer">
              here
            </a>{' '}
            to read the guide.
          </p>
          <button className="button" onClick={handleAccept}>
            Accept
          </button>
        </div>
      </div>
    )
  );
};

export default TermsModal;
