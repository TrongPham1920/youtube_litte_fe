import React, { useState } from 'react';
import Modal from '../../ui/Modal';
import InputField from '../../ui/InputField';
import PasswordInputField from '../../ui/PasswordInputField';
import Notification from '../../ui/Notification';

import { register } from '../../../data/api/app/api';
import { validateInputs } from '../../../types/validate';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; username?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setServerError(null);

    // Validate inputs
    const validationErrors = validateInputs({ email, password, username });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    const response = await register({ username, email, password });
    setIsLoading(false);

    if (!response.success) {
      setServerError(response.message || 'Registration failed');
      return;
    }

    onSwitchToLogin();
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setErrors({});
    setServerError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Sign Up">
      <div>
        {serverError && <Notification message={serverError} type="error" />}
        {errors.username && <Notification message={errors.username} type="error" />}
        {errors.email && <Notification message={errors.email} type="error" />}
        {errors.password && <Notification message={errors.password} type="error" />}
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