'use client';

import React from 'react';

interface AddIndicatorButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const AddIndicatorButton: React.FC<AddIndicatorButtonProps> = ({ onClick, disabled = false }) => {
  return (
    <div className="relative">
      <button
        onClick={onClick}
        disabled={disabled}
        aria-label={disabled ? 'Indicator already added' : 'Add Bollinger Bands indicator'}
        className={`
          relative px-4 py-2 rounded-md font-medium text-sm transition-all duration-200
          ${disabled 
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
            : 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800'
          }
          flex items-center space-x-2
        `}
      >
        {disabled ? (
          <>
            <span className="text-green-400">✓</span>
            <span>Added</span>
          </>
        ) : (
          <>
            <span className="text-lg">+</span>
            <span>Add Indicator</span>
          </>
        )}
      </button>
    </div>
  );
};

export default AddIndicatorButton;
