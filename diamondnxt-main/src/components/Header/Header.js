// Header.js
import React from 'react';
import './../../style/header.css';
import UserInfo from '../UserInfo/UserInfo';

const Header = (props) => {
  return (
    <header>
      <UserInfo {...props} />
    </header>
  );
};

export default Header;
