import React from 'react';

interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoFocus?: boolean;
  isOptional?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  value,
  onBlur,
  onChange,
  type = 'text',
  placeholder = '',
  required = false,
  autoFocus = false,
  isOptional = false
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-lg font-medium text-gray-700 mb-2 text-left">
        {label}
        {required && <span className="text-orange-500">*</span>}
        {isOptional && <span className="text-gray-500 text-sm ml-1">(opcional)</span>}
      </label>
      <input
        type={type}
        name={id}
        id={id}
        value={value}
        autoFocus={autoFocus}
        onBlur={onBlur}
        onChange={onChange}
        required={required}
        className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm text-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputField;
