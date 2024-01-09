import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-toastify/dist/ReactToastify.css';
import DeleteUserDialog from './DeleteUserDialog';
import { makeAuthenticatedDELETERequest, makeAuthenticatedGETRequest } from '../../utils/serverHelpers';

const User = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const fetchData = async () => {
    try {
      const response = await makeAuthenticatedGETRequest("/auth/get/all-users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  const handleDelete = async (userID) => {
    setSelectedUserId(userID);
  };

  const handleDeleteConfirmed = async () => {
    try {
      const response = await makeAuthenticatedDELETERequest(`/auth/delete/${selectedUserId}`);
      setUsers(users.filter(user => user._id !== selectedUserId));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user');
    }
    setSelectedUserId(null);
  };

  const handleCancelDelete = () => {
    setSelectedUserId(null);
  };

  useEffect(() => {
    if (selectedUserId !== null) {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <DeleteUserDialog
              onDeleteConfirmed={() => {
                handleDeleteConfirmed();
                onClose();
              }}
              onCancel={() => {
                handleCancelDelete();
                onClose();
              }}
            />
          );
        },
        closeOnClickOutside: false,
      });
    }
  }, [selectedUserId]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className='px-6 py-4 bg-gray-200'>
      <div className='bg-white p-6 rounded-lg shadow-lg'>
        <h1 className='text-2xl font-semibold mb-6 text-center'>User List</h1>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className='border p-3'>Username</th>
              <th className='border p-3'>Email</th>
              <th className='border p-3'>Role</th>
              <th className='border p-3'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className='border p-3 text-center'>{user.username}</td>
                <td className='border p-3 text-center'>{user.email}</td>
                <td className={`border p-3 text-center ${user.role === 'admin' ? 'text-red-500' : 'text-green-500'}`}>
                  {user.role}
                </td>
                <td className='border p-2 flex justify-center'>
                  <button
                    className='bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded'
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default User;
