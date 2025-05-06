import React, { useContext, useState } from 'react';
import LoginModal from '../layout/auth/Login';
import SignupModal from '../layout/auth/Register';
// import { LogIn, UserPlus, LogOut } from 'lucide-react'; // Import icons from lucide-react
import { AuthContext } from '../../context/AuthContext';
import { LogOut, Video } from 'lucide-react';
interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogoutClick: () => void;
  onGoToYourChannel: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ isOpen, onClose, onLogoutClick, onGoToYourChannel }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const { user } = useContext(AuthContext);
  const handleLoginClick = () => {
    setShowLoginModal(true);
    onClose();
  };

  const handleSignupClick = () => {
    setShowSignupModal(true);
    onClose();
  };

  const handleLogoutClick = () => {
    onLogoutClick(); // Gọi đúng logout được truyền từ Navbar xuống
    onClose();
  };
  // const handleCreateChannel = () => {
  //   // TODO: Điều hướng hoặc mở modal tạo kênh ở đây
  //   console.log('Create Channel Clicked!');
  //   onClose();
  // };
  return (
    <div className="relative mt-5">
      {/* Animated Dropdown */}
      <div
        className={`
          absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 shadow-lg rounded-md p-2
          transform transition-all duration-300 origin-top-right
          ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20 pointer-events-none'}
        `}
      >
         {user ? (
          <>
            <div className="px-4 py-2 text-black dark:text-white font-semibold">
              {user.username}
            </div>
            <button
         className="flex items-center w-full text-left px-4 py-2 text-black dark:text-white hover:bg-red-400 dark:hover:bg-zinc-700"
        onClick={() => {
        console.log('UserMenu: Navigating to Your Channel');
         onGoToYourChannel(); // Gọi prop được truyền từ Navbar
       }}
>
  <Video className="w-5 h-5 mr-2" /> {/* Icon Tạo kênh */}
  <span>Tạo kênh</span>
</button>
            <button
              className="flex items-center w-full text-left px-4 py-2 text-black dark:text-white hover:bg-red-400 dark:hover:bg-zinc-700"
              onClick={handleLogoutClick}
            >
             <LogOut className="w-5 h-5 mr-2" /> {/* Logout Icon */}
             <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <button
              className="flex items-center w-full text-left px-4 py-2 text-black dark:text-white hover:bg-red-400 dark:hover:bg-zinc-700"
              onClick={handleLoginClick}
            >
             <span>Login</span>
            </button>
            <button
              className="flex items-center w-full text-left px-4 py-2 text-black dark:text-white hover:bg-red-400 dark:hover:bg-zinc-700"
              onClick={handleSignupClick}
            >
              <span>Signup</span>
            </button>
          </>
        )}
      </div>

      {/* Modals */}
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
