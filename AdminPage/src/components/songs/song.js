import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { makeAuthenticatedGETRequest, makeAuthenticatedDELETERequest } from '../../utils/serverHelpers';
import DeleteSongDialog from './DeleteSongDialog';
import { ToastContainer, toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-toastify/dist/ReactToastify.css';
import EditSongDialog from './EditSongDialog';



const Song = () => {
  const navigate = useNavigate();
  const [songData, setSongData] = useState([]);
  const [selectedSongId, setSelectedSongId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await makeAuthenticatedGETRequest("/song/get/all-songs");
        setSongData(response.data);
        console.log(response);
      } catch (error) {
        console.error("Error fetching song data: ", error);
      }
    };

    fetchData();
  }, []); // Thêm dependency là mảng rỗng để đảm bảo useEffect chỉ chạy một lần sau khi component mount

  // const handleEdit = (songId) => {
  //   // Xử lý logic chỉnh sửa bài hát
  // };

  const handleDelete = async (songId) => {
    setSelectedSongId(songId);
  };

  const handleDeleteConfirmed = async () => {
    try {
      const response = await makeAuthenticatedDELETERequest(`/song/delete/${selectedSongId}`);
      setSongData(songData.filter(song => song._id !== selectedSongId));
      toast.success('Song deleted successfully');
    } catch (error) {
      console.error('Error deleting song:', error);
      toast.error('Error deleting song');
    }
    setSelectedSongId(null);
  };

  const handleCancelDelete = () => {
    setSelectedSongId(null);
  };

  useEffect(() => {
    if (selectedSongId !== null) {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <DeleteSongDialog
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
  }, [selectedSongId]);

  const handleEdit = (songId) => {
    if (songData.length === 0) {
      console.error('Song data is empty.');
      return;
    }
  
    const songToEdit = songData.find((song) => song._id === songId);
    if (songToEdit) {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <EditSongDialog
              song={songToEdit}
              onEditConfirmed={(editedSong) => {
                // Cập nhật danh sách bài hát sau khi chỉnh sửa
                setSongData((prevSongs) =>
                  prevSongs.map((song) => (song._id === editedSong._id ? editedSong : song))
                );
                onClose(); // Đóng dialog sau khi xác nhận chỉnh sửa
              }}
              onCancel={onClose}
            />
          );
        },
        closeOnClickOutside: false,
      });
    } else {
      console.error(`Song with ID ${songId} not found`);
    }
  };
  

  const handleAddSong = () => {
    // Sử dụng navigate để chuyển hướng đến trang "/upload"
    navigate('/upload');
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
              <th className='border p-3 text-center'>Singer</th>
              <th className='border p-3 text-center'>Thumnail</th>
              <th className='border p-3 text-center'>Duration</th>
              <th className='border p-3 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {songData.map((song) => (
              <tr key={song._id}>
                <td className='border p-3 text-center overflow-hidden max-w-[150px] whitespace-nowrap'>
                  {song.name}
                </td>
                <td className='border p-3 text-center overflow-hidden max-w-[150px] whitespace-nowrap'>
                  {song.singer}
                </td>
                <td className='border p-3 text-center overflow-hidden max-w-[30px] max-h-[30px]'>
                  <img src={song.thumbnail} alt={`Thumbnail for ${song.name}`} className='max-w-full max-h-full' />
                </td>
                <td className='border p-3 text-center overflow-hidden max-w-[150px] whitespace-nowrap'>
                  {song.duration}
                </td>
                <td className='border p-2 flex justify-center'>
                  <button
                    className='border p-2 bg-blue-500 hover:bg-blue-600 text-white rounded'
                    onClick={() => handleEdit(song._id)}
                  >
                    Edit
                  </button>
                  <button
                    className='border p-2 bg-red-500 hover:bg-red-600 text-white rounded ml-2'
                    onClick={() => handleDelete(song._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Song;








