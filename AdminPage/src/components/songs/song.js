// Song.js
import React from 'react';

const Song = () => {
  const songs = [
    { id: 1, name: 'Song 1', thumbnail: 'thumbnail1.jpg', track: 'track1.mp3', duration: '3:45' },
    { id: 2, name: 'Song 2', thumbnail: 'thumbnail2.jpg', track: 'track2.mp3', duration: '4:20' },
    { id: 3, name: 'Song 3', thumbnail: 'thumbnail3.jpg', track: 'track3.mp3', duration: '2:55' },
    // Thêm các bài hát khác nếu cần
  ];

  const handleEdit = (songId) => {
    // Xử lý logic chỉnh sửa bài hát
    console.log(`Editing song with ID: ${songId}`);
  };

  const handleDelete = (songId) => {
    // Xử lý logic xóa bài hát
    console.log(`Deleting song with ID: ${songId}`);
  };

  const handleAddSong = () => {
    // Xử lý logic thêm bài hát
    console.log('Adding a new song');
  };

  return (
    <div className='px-6 py-4 bg-gray-200'>
      <div className='bg-white p-6 rounded-lg shadow-lg'>
      <div className='mb-4 text-left'>
          <button
            className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded'
            onClick={handleAddSong}
          >
            Add Song
          </button>
        </div>
        <h1 className='text-2xl font-semibold mb-6 text-center'>Song List</h1>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className='border p-3 text-center'>Name</th>
              <th className='border p-3 text-center'>Thumbnail</th>
              <th className='border p-3 text-center'>Track</th>
              <th className='border p-3 text-center'>Duration</th>
              <th className='border p-3 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song) => (
              <tr key={song.id}>
                <td className='border p-3 text-center'>{song.name}</td>
                <td className='border p-3 text-center'>{song.thumbnail}</td>
                <td className='border p-3 text-center'>{song.track}</td>
                <td className='border p-3 text-center'>{song.duration}</td>
                <td className='border p-2 flex justify-center'>
                  <button
                    className='bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded'
                    onClick={() => handleEdit(song.id)}
                  >
                    Edit
                  </button>
                  <button
                    className='bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded ml-2'
                    onClick={() => handleDelete(song.id)}
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

export default Song;



