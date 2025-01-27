import React from 'react';
import UserCenterNav from '../components/UserCenterNav';

const Orders = () => {
  return (
    <div className="user-center-container">
      <UserCenterNav />
      <div className="user-orders">
        <h2>Order History</h2>
        {/* Order list will be added here */}
      </div>
    </div>
  );
};

export default Orders;
