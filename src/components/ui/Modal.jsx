import React, { useEffect, useRef } from 'react';

export const Modal = ({ isOpen, onClose, title, children }) => {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // (a) add 'overflow-hidden' to document.body when open
    document.body.classList.add('overflow-hidden');

    // (b) handle Escape key to close
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Focus the close button on open using useRef
    closeButtonRef.current?.focus();

    // (c) cleanup on unmount and when modal closes
    return () => {
      document.body.classList.remove('overflow-hidden');
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // When isOpen is false, return null
  if (!isOpen) {
    return null;
  }

  const titleId = 'modal-title';

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className="max-w-lg w-full mx-4 bg-white rounded-2xl shadow-xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          {title ? (
            <h2 id={titleId} className="text-xl font-semibold text-gray-900">
              {title}
            </h2>
          ) : (
            <span />
          )}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg focus-visible:ring-2 focus-visible:ring-primary/50 outline-none transition ml-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
