import React from 'react';
import { NavLink } from 'react-router-dom';

const UserCenterNav = () => {
  return (
    <nav className="user-center-nav">
      <ul>
        <li>
          <NavLink to="/user/info" activeClassName="active">
            User Info
          </NavLink>
        </li>
        <li>
          <NavLink to="/user/orders" activeClassName="active">
            Orders
          </NavLink>
        </li>
        <li>
          <NavLink to="/user/address" activeClassName="active">
            Address
          </NavLink>
        </li>
        <li>
          <NavLink to="/user/security" activeClassName="active">
            Security
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default UserCenterNav;
