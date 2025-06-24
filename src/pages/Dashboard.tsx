
import React, { useState } from 'react';
import BuyerDashboard from './BuyerDashboard';
import CreatorDashboard from './CreatorDashboard';

const Dashboard = () => {
  // Mock user role - in a real app this would come from authentication context
  const [userRole, setUserRole] = useState<'buyer' | 'creator'>('buyer');
  
  // Toggle between dashboard types
  const toggleDashboard = () => {
    setUserRole(userRole === 'buyer' ? 'creator' : 'buyer');
  };

  if (userRole === 'creator') {
    return <CreatorDashboard />;
  }

  return <BuyerDashboard />;
};

export default Dashboard;
