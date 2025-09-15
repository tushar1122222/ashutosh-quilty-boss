import React from 'react';
import Icon from './Icon';

const Header: React.FC = () => {
  return (
    <header className="flex items-center p-4 border-b border-gray-700 bg-gray-800 text-white shadow-md">
       <Icon name="logo" className="w-8 h-8 mr-3 text-cyan-400" />
      <h1 className="text-xl font-bold tracking-wider">Ashutosh Quilty Boss</h1>
    </header>
  );
};

export default Header;