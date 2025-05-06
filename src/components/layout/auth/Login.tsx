import React, { useState, useContext } from 'react';
import Modal from '../../ui/Modal';
import InputField from '../../ui/InputField';
import PasswordInputField from '../../ui/PasswordInputField';
import { login } from '../../../data/api/app/api';
import { AuthContext } from '../../../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login: loginContext } = useContext(AuthContext); // Sử dụng login từ context

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
  
    const response = await login({ email, password });
  
    setIsLoading(false);
    if (!response.success) {
      setError(response.message || 'Login failed');
      return;
    }
  if (response.token && response.user) {
      loginContext(response.token, response.user); 
      onClose();
    } else {
      setError('Invalid login response: Missing token or user');
    }
  };
  
  

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Log In">
      <div>
        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
        <InputField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <PasswordInputField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
        <div className="mt-4 text-center">
          <p className="text-sm dark:text-gray-300">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToSignup}
              className="text-blue-600 hover:underline"
              disabled={isLoading}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
