import React, { forwardRef, useId } from 'react';

export const Input = forwardRef(function Input(
  {
    label,
    id: customId,
    value,
    onChange,
    placeholder,
    type = 'text',
    error,
    required = false,
    className = '',
    ...props
  },
  ref
) {
  const generatedId = useId();
  const id = customId || generatedId;
  const errorId = `${id}-error`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && (
            <span className="text-danger ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        aria-label={label || undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-primary/50 outline-none transition disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed ${
          error
            ? 'border-danger focus:border-danger focus:ring-danger/50'
            : 'border-gray-300 focus:border-primary'
        } ${className}`.trim()}
        {...props}
      />
      {error && (
        <p id={errorId} role="alert" className="text-danger text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
