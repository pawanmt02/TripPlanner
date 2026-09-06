import React, { memo } from 'react';

const VARIANT_MAP = {
  nature: 'bg-green-100 text-green-800',
  city: 'bg-blue-100 text-blue-800',
  adventure: 'bg-orange-100 text-orange-800',
  beach: 'bg-cyan-100 text-cyan-800',
  heritage: 'bg-amber-100 text-amber-800',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-green-100 text-green-700',
  danger: 'bg-red-100 text-red-700',
  default: 'bg-gray-100 text-gray-800',
};

export const Badge = memo(function Badge({
  children,
  variant = 'default',
  className = '',
  ...props
}) {
  const variantClass = VARIANT_MAP[variant] || VARIANT_MAP.default;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;
