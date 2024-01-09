import React from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const DeleteUserDialog = ({ onDeleteConfirmed, onCancel }) => {
  const handleDelete = () => {
    onDeleteConfirmed();
    confirmAlert.close(); // Đóng dialog sau khi xác nhận xóa
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Confirm Deletion</h1>
        <p className="mb-4">Are you sure you want to delete this user?</p>
        <div className="flex justify-center space-x-4">
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            onClick={handleDelete}
          >
            Yes
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            onClick={onCancel}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserDialog;
