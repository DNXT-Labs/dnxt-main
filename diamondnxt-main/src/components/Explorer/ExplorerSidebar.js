import { useState } from 'react';
import './Search.css';
import ReactSlider from 'react-slider'; import {
    SidebarHeader,
    SidebarFooter,
    SidebarContent
} from "react-pro-sidebar";
import { Sidebar } from "react-responsive-sidebar";
import { Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { ImHome } from "@react-icons/all-files/im/ImHome";
import { GiCutDiamond } from "@react-icons/all-files/gi/GiCutDiamond";
import { BsFillPersonFill } from "@react-icons/all-files/bs/BsFillPersonFill";
import { CgOptions } from "react-icons/cg";
import { ProSidebar } from "react-pro-sidebar";
import './Explorer.css';
import Logo from "./../../images/logo.svg";
import Opensea from "./../../images/opensea.png";
import Rarible from "./../../images/rarible.png";




const ExplorerSidebar = ({ data, onFilter, onFilterPrice }) => {

    const [openTrait, setOpenTrait] = useState(null);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000000);  // Adjust this default value

    // You would replace this with real data or a function to get the highest price
    const highestPrice = 1000000;


    // Categorize attributes
    const attributeCounts = data.reduce((acc, item) => {
        item.attributes.forEach(attr => {
            if (!acc[attr.trait_type]) {
                acc[attr.trait_type] = {};
            }
            if (!acc[attr.trait_type][attr.value]) {
                acc[attr.trait_type][attr.value] = 0;
            }
            acc[attr.trait_type][attr.value]++;
        });
        return acc;
    }, {});

    const handleCheckboxChange = (traitType, value) => {
        // Invoke the parent's filter function here...
        onFilter(traitType, value);
    }

    const handleApplyPriceFilter = () => {
        // This function would handle the price filtering logic based on minPrice and maxPrice
        onFilterPrice({ min: minPrice, max: maxPrice }); // <-- Use the dedicated price filter handler
    };

    const handleSliderChange = ([min, max]) => {
        setMinPrice(min);
        setMaxPrice(max);
    }


    const headerStyle = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '10px',
        color: 'white',
        height: '80px', // or whatever fits your design
    };

    const logoStyle = {
        marginRight: '10px',
        width: '48px', // or use the LOGO_WIDTH constant you defined
    };

    const textStyle = {
        fontSize: '1.5em',
    };

    const items = [
        <ProSidebar>
            <SidebarHeader>
                <div style={headerStyle}>
                    <img src={Logo} alt="DNXT.app Logo" style={logoStyle} />
                    <span style={textStyle}>DNXT.app</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <Menu iconShape="circle">
                    {/* Other primary options as MenuItems */}
                    {/* Status as a SubMenu */}
                    <SubMenu title="Status" icon={<ImHome />} className="home">
                        <MenuItem>
                            <input type="radio" id="all" name="status" value="all" defaultChecked />
                            <label htmlFor="all">All</label></MenuItem>
                        <MenuItem>
                            <input type="radio" id="forSale" name="status" value="forSale" />
                            <label htmlFor="forSale">For Sale</label>
                        </MenuItem>
                    </SubMenu>

                    {/* Price as a SubMenu */}
                    <SubMenu title="Price" icon={<CgOptions />} className="home">
                        <div>
                            <ReactSlider
                                className="horizontal-slider"
                                thumbClassName="thumb"
                                trackClassName="track"
                                min={0}
                                max={highestPrice}
                                value={[minPrice, maxPrice]}
                                onChange={handleSliderChange}
                            />
                            <input className="input" type="text" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                            <input className="input" type="text" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                            <button className='button' onClick={handleApplyPriceFilter}>Apply</button>
                        </div>
                    </SubMenu>
                    <SubMenu title="Owner" icon={<BsFillPersonFill />} className="home">
                        <MenuItem>
                            <input type="radio" id="allOwners" name="owner" value="allOwners" defaultChecked />
                            <label htmlFor="allOwners">All Owners</label>
                        </MenuItem>
                        <MenuItem>
                            <input type="radio" id="me" name="owner" value="me" />
                            <label htmlFor="me">My NFTs</label>
                        </MenuItem>
                    </SubMenu>
                    <SubMenu title="Traits" icon={<GiCutDiamond />} className="home">
                        {/* Traits as a SubMenu */}
                        {Object.keys(attributeCounts).map(traitType => (
                            <MenuItem key={traitType} onClick={() => setOpenTrait(traitType)}>
                                {traitType}
                                {openTrait === traitType && (
                                    <div>
                                        {/* Trait details */}
                                        {Object.keys(attributeCounts[traitType]).map(value => (
                                            <div key={value} className="home">
                                                <input
                                                    type="checkbox"
                                                    onChange={() => handleCheckboxChange(traitType, value)}
                                                />
                                                {value} ({attributeCounts[traitType][value]})
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </MenuItem>
                        ))}
                    </SubMenu>
                </Menu>
            </SidebarContent>
            <SidebarFooter style={{ textAlign: 'center' }}>
                <div className="footer-content">
                    <div className="market-logos">
                        <a href="https://dnxt.pro/#/dashboard" target="_blank" rel="noopener noreferrer">
                            <img src={Logo} alt="DNXT Logo" className="market-logo" />
                        </a>
                        <a href="https://opensea.io" target="_blank" rel="noopener noreferrer"> {/* Replace with the actual Opensea URL */}
                            <img src={Opensea} alt="Opensea Logo" className="market-logo" />
                        </a>
                        <a href="https://rarible.com" target="_blank" rel="noopener noreferrer"> {/* Replace with the actual Rarible URL */}
                            <img src={Rarible} alt="Rarible Logo" className="market-logo" />
                        </a>
                    </div>
                </div>
            </SidebarFooter>

        </ProSidebar>
    ];

    return <Sidebar background="var(--color9)" className="sidebar" content={items}></Sidebar>;
}



export default ExplorerSidebar;
