import React, { memo } from 'react';
import { sanitizeText } from '../../utils/sanitize';

export const NotesInput = memo(({ value, onChange, placeholder = 'Add notes...', maxLength = 500 }) => {
  const handleBlur = (e) => {
    const sanitizedValue = sanitizeText(e.target.value);
    onChange(sanitizedValue);
  };

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="w-full flex flex-col gap-1">
      <label className="sr-only">Notes</label>
      <textarea
        value={value || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={2}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
      />
      <div className="flex justify-end">
        <span className="text-xs text-gray-400">
          {(value || '').length}/{maxLength}
        </span>
      </div>
    </div>
  );
});

export default NotesInput;
