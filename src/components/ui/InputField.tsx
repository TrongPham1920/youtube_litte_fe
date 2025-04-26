import React from 'react';

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ label, type, value, onChange, required = false }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1 dark:text-gray-300">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full p-2 border rounded dark:bg-zinc-700 dark:text-white dark:border-zinc-600"
        required={required}
      />
    </div>
  );
};

export default InputField;