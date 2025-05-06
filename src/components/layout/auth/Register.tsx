import React, { useState } from 'react';

import Modal from '../../ui/Modal';
import InputField from '../../ui/InputField';
import PasswordInputField from '../../ui/PasswordInputField';
import { register } from '../../../data/api/app/api';


interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const response = await register({ username, email, password });
    setIsLoading(false);
    if (!response.success) {
      setError(response.message || 'Registration failed');
      return;
    }
    onSwitchToLogin(); 
  };
  const handleClose = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Sign Up">
      <div>
        {error && (
          <div className="mb-4 text-red-600 text-sm">{error}</div>
        )}
        <InputField
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
          className={`w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
        <div className="mt-4 text-center">
          <p className="text-sm dark:text-gray-300">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:underline"
              disabled={isLoading}
            >
              Log In
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default SignupModal;