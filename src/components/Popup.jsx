import React from 'react';

const Popup = ({ title, content, onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p>{content}</p>
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Popup;
