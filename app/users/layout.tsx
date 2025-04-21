import React from 'react';

interface UsersLayoutProps {
  children: React.ReactNode;
}

const UsersLayout: React.FC<UsersLayoutProps> = ({ children }) => {
  return (
    <div className='flex flex-col w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 justify-center items-center'>
      <main>{children}</main>
    </div>
  );
};

export default UsersLayout;
