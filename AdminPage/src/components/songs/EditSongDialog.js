import React, { useState } from 'react';
import { makeAuthenticatedPUTRequest } from '../../utils/serverHelpers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditSongDialog = ({ song, onEditConfirmed, onCancel }) => {
  const [editedSong, setEditedSong] = useState({
    name: song.name,
    thumbnail: song.thumbnail,
    singer: song.singer,
    // Thêm các trường khác tương tự
  });

  const handleInputChange = (field, value) => {
    setEditedSong({ ...editedSong, [field]: value });
  };

  const handleEdit = async () => {
    try {
      const response = await makeAuthenticatedPUTRequest(`/song/update/${song._id}`, editedSong);
      onEditConfirmed(response.data);
      toast.success('Song edited successfully');
    } catch (error) {
      console.error('Error editing song:', error);
      toast.error('Error editing song');
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-md shadow-md w-96 mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Song</h1>
      <form>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-600">Name:</label>
          <input
            type="text"
            id="name"
            value={editedSong.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-600">Thumbnail:</label>
          <input
            type="text"
            id="thumbnail"
            value={editedSong.thumbnail}
            onChange={(e) => handleInputChange('thumbnail', e.target.value)}
            className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="singer" className="block text-sm font-medium text-gray-600">Singer:</label>
          <input
            type="text"
            id="singer"
            value={editedSong.singer}
            onChange={(e) => handleInputChange('singer', e.target.value)}
            className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        {/* Thêm các trường chỉnh sửa khác tương tự */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring focus:border-gray-300"
          >
            Cancel
          </button>
          <ToastContainer />
        </div>
      </form>
    </div>
  );
};

export default EditSongDialog;


