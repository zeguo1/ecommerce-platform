import React from 'react';
import UserCenterNav from '../components/UserCenterNav';

const UserInfo = () => {
  return (
    <div className="user-center-container">
      <UserCenterNav />
      <div className="user-info">
        <h2>User Information</h2>
        {/* User info form will be added here */}
      </div>
    </div>
  );
};

export default UserInfo;
