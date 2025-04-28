import React, { useState } from 'react';
import LoginModal from '../layout/auth/Login';
import SignupModal from '../layout/auth/Register';


interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
   onLogoutClick: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ isOpen, onClose }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleLoginClick = () => {
    setShowLoginModal(true);
    onClose();  // Close the dropdown when login is clicked
  };

  const handleSignupClick = () => {
    setShowSignupModal(true);
    onClose();  // Close the dropdown when signup is clicked
  };

  const handleLogoutClick = () => {
    // Call your logout function here
    console.log('User logged out');
    onClose();  // Close the dropdown after logout
  };

  return (
    <div className={`absolute right-0 mt-2 bg-white dark:bg-zinc-800 shadow-lg rounded-md p-2 ${isOpen ? 'block' : 'hidden'}`}>
      <button 
        className="block w-full text-left px-4 py-2 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-700"
        onClick={handleLoginClick}
      >
        Login
      </button>
      <button 
        className="block w-full text-left px-4 py-2 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-700"
        onClick={handleSignupClick}
      >
        Signup
      </button>
      <button 
        className="block w-full text-left px-4 py-2 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-700"
        onClick={handleLogoutClick}
      >
        Logout
      </button>

      {/* Modals for Login and Signup */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
      />
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
        }}
      />
    </div>
  );
};

export default UserMenu;
