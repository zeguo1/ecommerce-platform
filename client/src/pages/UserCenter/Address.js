import React from 'react';
import UserCenterNav from '../components/UserCenterNav';

const Address = () => {
  return (
    <div className="user-center-container">
      <UserCenterNav />
      <div className="user-address">
        <h2>Address Management</h2>
        {/* Address form will be added here */}
      </div>
    </div>
  );
};

export default Address;
