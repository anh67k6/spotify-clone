// User.js
import React from 'react';

const User = () => {
  const users = [
    { id: 1, username: 'user1', email: 'user1@example.com', role: 'admin' },
    { id: 2, username: 'user2', email: 'user2@example.com', role: 'member' },
    { id: 3, username: 'user3', email: 'user3@example.com', role: 'member' },
    // Thêm các người dùng khác nếu cần
  ];

  const handleDelete = (userId) => {
    // Xử lý logic xóa người dùng
    console.log(`Deleting user with ID: ${userId}`);
  };

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
              <tr key={user.id}>
                <td className='border p-3 text-center'>{user.username}</td>
                <td className='border p-3 text-center'>{user.email}</td>
                <td className={`border p-3 text-center ${user.role === 'admin' ? 'text-red-500' : 'text-green-500'}`}>
                  {user.role}
                </td>
                <td className='border p-2 flex justify-center'>
                  <button
                    className='bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded'
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default User;






