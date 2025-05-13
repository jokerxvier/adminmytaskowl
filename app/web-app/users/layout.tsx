import React from "react";

interface UsersLayoutProps {
  children: React.ReactNode;
}

const UsersLayout: React.FC<UsersLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col w-full h-full p-8">
      <main>{children}</main>
    </div>
  );
};

export default UsersLayout;
