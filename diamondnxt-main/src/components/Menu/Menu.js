import React from 'react';
import { Link } from 'react-router-dom';
import { ImHome } from "@react-icons/all-files/im/ImHome";
import { AiFillPieChart } from "@react-icons/all-files/ai/AiFillPieChart";
import { DiGoogleAnalytics } from "@react-icons/all-files/di/DiGoogleAnalytics";
import { FaUserFriends } from "@react-icons/all-files/fa/FaUserFriends";
import { GiInjustice } from "@react-icons/all-files/gi/GiInjustice";

const Menu = () => {

    const menuItems = [
      { name: 'Home', path: '/', icon: <ImHome /> },
      { name: 'Explorer', path: '/explorer', icon: <ImHome /> },
      { name: 'Profile', path: '/profile', icon: <FaUserFriends /> },
      { name: 'DAO', path: 'https://www.tally.xyz/gov/dnxt', isExternal: true, icon: <GiInjustice /> },
        { name: 'Redeem', path: '/redeem', icon: <AiFillPieChart /> },
        { name: 'Staking', path: '/staking', icon: <DiGoogleAnalytics /> },
    ];

    return (
    <>
      {menuItems.map(item => 
        item.isExternal ? (
          <a key={item.name} className="menuItem" href={item.path} target="_blank" rel="noopener noreferrer">
            {item.name}
          </a>
        ) : (
          <Link key={item.name} className="menuItem" to={item.path}>
            {/*item.icon*/}
            {item.name}
          </Link>
        )
      )}
    </>
  );
};

export default Menu;
