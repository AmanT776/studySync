import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  onClick,
  type = 'button'
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';

  const variantClasses = {
    primary: 'border border-transparent text-white bg-blue-500 hover:bg-blue-600',
    secondary: 'border border-transparent text-white bg-green-500 hover:bg-green-600',
    outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
