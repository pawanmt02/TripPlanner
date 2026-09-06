import React, { forwardRef } from 'react';

const VARIANTS = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  secondary: 'border border-primary text-primary hover:bg-primary/10',
  outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
  ghost: 'text-gray-600 hover:bg-gray-100',
  danger: 'bg-danger text-white hover:bg-red-600',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg',
};

export const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    onClick,
    disabled = false,
    ariaLabel,
    className = '',
    type = 'button',
    icon,
    ...props
  },
  ref
) {
  const variantClass = VARIANTS[variant] || VARIANTS.primary;
  const sizeClass = SIZES[size] || SIZES.md;
  const effectiveAriaLabel = ariaLabel || props['aria-label'];

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={effectiveAriaLabel}
      className={`inline-flex items-center justify-center font-medium rounded-lg transition focus-visible:ring-2 focus-visible:ring-primary/50 outline-none disabled:opacity-50 disabled:cursor-not-allowed ${variantClass} ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {icon && (
        <span
          className={`inline-flex items-center shrink-0 ${
            children ? 'mr-2' : ''
          }`}
          aria-hidden={effectiveAriaLabel ? 'true' : undefined}
        >
          {icon}
        </span>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
