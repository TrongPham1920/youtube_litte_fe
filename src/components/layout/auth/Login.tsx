import React, { useState, useContext } from 'react';
import Modal from '../../ui/Modal';
import InputField from '../../ui/InputField';
import PasswordInputField from '../../ui/PasswordInputField';
import Notification from '../../ui/Notification';

import { login } from '../../../data/api/app/api';
import { AuthContext } from '../../../context/AuthContext';
import { validateInputs } from '../../../types/validate';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login: loginContext } = useContext(AuthContext);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setServerError(null);

    const validationErrors = validateInputs({ email, password });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    const response = await login({ email, password });
    setIsLoading(false);

    if (!response.success) {
      setServerError(response.message || 'Login failed');
      return;
    }

    if (response.token && response.user) {
      loginContext(response.token, response.user);
      onClose();
    } else {
      setServerError('Invalid login response: Missing token or user');
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setErrors({});
    setServerError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Log In">
      <div>
        {serverError && <Notification message={serverError} type="error" />}
        {errors.email && <Notification message={errors.email} type="error" />}
        {errors.password && <Notification message={errors.password} type="error" />}
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