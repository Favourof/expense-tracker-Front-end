import React from 'react';
import Navigation from './Component/Navigation';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Navigation />
      <div className="flex-grow overflow-auto bg-white-200 pt-20">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
