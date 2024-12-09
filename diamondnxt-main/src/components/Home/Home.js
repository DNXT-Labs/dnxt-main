import React from "react";
import Logo from "./../../images/logo.svg";
import { Link } from 'react-router-dom';
import Facebook from '../../images/facebook.png'
import Instagram from '../../images/instagram.png'
import Twitter from '../../images/twitter.png'
import Youtube from '../../images/youtube.png'
import Linkedin from '../../images/linkedin.png'
import Github from '../../images/github.png'
import Opensea from './../../images/opensea.png'
import Rarible from './../../images/rarible.png'

// Constants for clarity and maintainability

const Home = () => {
  return (
    <div className="home-container">

      {/* Resources and Links Section */}
      <section className="resources-section">
        <h2>Quick Links & Resources</h2>

        {/* GitBook Resources */}
        <div className="resource-group">

          <h3>GitBook Guides</h3>
          <div className="resources-grid">
            <div className="resource button">
              <a href="https://arch.dnxt.app" target="_blank" rel="noopener noreferrer">architecture</a>
            </div>
            <div className="resource button">
              <a href="https://docs.dnxt.app" target="_blank" rel="noopener noreferrer">docs</a>
            </div>
            <div className="resource button">
              <a href="https://guides.dnxt.app" target="_blank" rel="noopener noreferrer">guides</a>
            </div>
          </div>
          <div className="resource button">
            <a href="https://diamondnxt.com/" target="_blank" rel="noopener noreferrer">Official Website</a>
          </div>
          <div className="resource button">
            <a href="https://dnxt.app/whitepaper.pdf" target="_blank" rel="noopener noreferrer">Whitepaper</a>
          </div>
        </div>


        {/* Marketplaces */}
        <div className="resource-group">
          <h3>Marketplaces</h3>
          <div className="resources-grid">
            <div className="market-logos">

              <Link className="button" to="/explorer">
              <img src={Logo} alt="DNXT Logo" className="market-logo" />
              </Link>
              <a href="https://opensea.io" target="_blank" rel="noopener noreferrer"> {/* Replace with the actual Opensea URL */}
                <img src={Opensea} alt="Opensea Logo" className="market-logo" />
              </a>
              <a href="https://rarible.com" target="_blank" rel="noopener noreferrer"> {/* Replace with the actual Rarible URL */}
                <img src={Rarible} alt="Rarible Logo" className="market-logo" />
              </a>
            </div>
          </div>
        </div>

        {/* Social Media and External Links */}
        <div className="resource-group">
          <h3>Social Media & External Links</h3>
          <div className="resources-grid">
            <div className="resource">
              <a href="https://instagram.com/diamondnxt" target="_blank" rel="noopener noreferrer">
                <img src={Instagram} alt="Instagram" width="32px" />
              </a>
            </div>
            <div className="resource">
              <a href="https://www.linkedin.com/company/diamondnxt/" target="_blank" rel="noopener noreferrer">
                <img src={Linkedin} alt="Linkedin" width="32px" />

              </a>
            </div>
            <div className="resource">
              <a href="https://x.com/DiamondNXT" target="_blank" rel="noopener noreferrer">
                <img src={Twitter} alt="Twitter" width="32px" />
              </a>
            </div>
            <div className="resource">
              <a href="https://www.facebook.com/profile.php?id=100086404933657" target="_blank" rel="noopener noreferrer">
                <img src={Facebook} alt="Facebook" width="32px" />
              </a>
            </div>
            <div className="resource">
              <a href="https://github.com/diamondnxt/" target="_blank" rel="noopener noreferrer">
                <img src={Github} alt="Github" width="32px" />
              </a>
            </div>
            <div className="resource">
              <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer">
                <img src={Youtube} alt="Youtube" width="32px" />
              </a>
            </div>
          </div>
        </div>


      </section>
    </div>
  );
};

export default Home;
