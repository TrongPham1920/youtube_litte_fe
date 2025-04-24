import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  onHomeClick: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onHomeClick }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-200">
      <Navbar onMenuClick={toggleSidebar} onHomeClick={onHomeClick} />
      <Sidebar isOpen={sidebarOpen} onHomeClick={onHomeClick} />
      <main 
        className={`pt-14 transition-all duration-300 min-h-screen
          ${sidebarOpen ? 'md:ml-56' : 'md:ml-16'}`}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;