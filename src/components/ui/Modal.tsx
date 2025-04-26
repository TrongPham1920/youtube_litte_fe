import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 dark:text-white text-center">{title}</h2>
        {children}
        <button
          onClick={onClose}
          className="mt-4 w-full text-sm text-gray-600 dark:text-gray-400 hover:underline"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;