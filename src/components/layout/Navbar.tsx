import React, { useState, useContext } from 'react';
import { Menu, Search, Bell, User, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import SearchBar from '../ui/SearchBar';  // Đảm bảo SearchBar được sử dụng
import { AuthContext } from '../../context/AuthContext';
import UserMenu from '../ui/UserMenu';  // Import UserMenu

interface NavbarProps {
  onMenuClick: () => void;
  onHomeClick: () => void;
  onGoToYourChannel: () => void; 
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, onHomeClick, onGoToYourChannel }) => {
  const { theme, toggleTheme } = useTheme();
  const {  logout } = useContext(AuthContext);  
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);  
//  const [currentPage, setCurrentPage] = useState<'home' | 'video' | 'your-channel'>('home'); 
  const handleUserClick = () => {
    setDropdownOpen(!dropdownOpen);  // Toggle dropdown when User button is clicked
  };
  const handleGoToYourChannel = () => {
    console.log('Đi tới trang Your Channel!');
    onGoToYourChannel();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-zinc-900 z-10 shadow-sm flex items-center px-4 transition-colors duration-200">
      <div className="flex items-center flex-1">
        <button 
          onClick={onMenuClick}
          className="p-2 mr-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700"
          aria-label="Menu"
        >
          <Menu className="w-6 h-6 text-black dark:text-white" />
        </button>

        <div onClick={onHomeClick} className="flex items-center cursor-pointer">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
            <span className="ml-1 font-bold text-lg hidden sm:block dark:text-white">
              YouTube<span className="text-xs ml-1 font-normal text-gray-700 dark:text-gray-300">Little</span>
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Search */}
      <div className="hidden md:block flex-1 max-w-xl">
        <SearchBar />
      </div>

      {/* Mobile Search Toggle */}
      {!showMobileSearch ? (
        <button 
          className="md:hidden p-2 mx-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700"
          onClick={() => setShowMobileSearch(true)}
          aria-label="Search"
        >
          <Search className="w-6 h-6 text-black dark:text-white" />
        </button>
      ) : (
        <div className="md:hidden absolute inset-0 bg-white dark:bg-zinc-900 px-4 flex items-center">
          <button 
            className="p-2 mr-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700"
            onClick={() => setShowMobileSearch(false)}
            aria-label="Back"
          >
            <Menu className="w-6 h-6 text-black dark:text-white" />
          </button>
          <div className="flex-1">
            <SearchBar />
          </div>
        </div>
      )}

      <div className="flex items-center">
        <button 
          onClick={toggleTheme}
          className="p-2 mx-1 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-6 h-6 text-white" />
          ) : (
            <Moon className="w-6 h-6 text-black" />
          )}
        </button>
        <button 
          className="p-2 mx-1 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 hidden sm:block"
          aria-label="Notifications"
        >
          <Bell className="w-6 h-6 text-black dark:text-white" />
        </button>

        {/* User Menu with Dropdown Toggle */}
        <button 
          className="p-2 mx-1 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700"
          onClick={handleUserClick}
          aria-label="User"
        >
          <User className="w-6 h-6 text-black dark:text-white" />
        </button>

        {/* User Menu Dropdown */}
        <UserMenu 
          isOpen={dropdownOpen} 
          onClose={() => setDropdownOpen(false)} 
          onLogoutClick={logout}  // Call logout when user clicks "Logout"
          onGoToYourChannel={handleGoToYourChannel}
        />
      </div>
    </nav>
  );
};

export default Navbar;
