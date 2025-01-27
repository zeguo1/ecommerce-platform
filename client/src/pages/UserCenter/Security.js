import React from 'react';
import UserCenterNav from '../components/UserCenterNav';

const Security = () => {
  return (
    <div className="user-center-container">
      <UserCenterNav />
      <div className="user-security">
        <h2>Account Security</h2>
        {/* Security settings will be added here */}
      </div>
    </div>
  );
};

export default Security;
