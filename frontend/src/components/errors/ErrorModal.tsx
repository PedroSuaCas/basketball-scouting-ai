import React from 'react';

interface ErrorModalProps {
  message: string;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
        <h2 className="text-lg font-bold text-red-600">Error</h2>
        <p className="text-gray-700 mt-2">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
