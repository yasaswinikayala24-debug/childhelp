import React from 'react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  style = {},
  className = '',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return { backgroundColor: '#4a5568', color: '#ffffff', border: 'none' };
      case 'outline':
        return { backgroundColor: 'transparent', color: '#3182ce', border: '1px solid #3182ce' };
      case 'danger':
        return { backgroundColor: '#e53e3e', color: '#ffffff', border: 'none' };
      case 'success':
        return { backgroundColor: '#38a169', color: '#ffffff', border: 'none' };
      case 'primary':
      default:
        return { backgroundColor: '#3182ce', color: '#ffffff', border: 'none' };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { padding: '0.4rem 0.8rem', fontSize: '0.85rem' };
      case 'large':
        return { padding: '0.8rem 1.75rem', fontSize: '1.1rem' };
      case 'medium':
      default:
        return { padding: '0.6rem 1.25rem', fontSize: '0.95rem' };
    }
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`btn ${className}`}
      style={{
        borderRadius: '6px',
        fontWeight: '600',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.2s ease',
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style,
      }}
    >
      {children}
    </button>
  );
};

export default Button;
