import { useState } from "react";
import CloudinaryUpload from "../../shared/CloudinaryUpload";
import TextInput from "../../shared/TextInput";
import { makeAuthenticatedPOSTRequest } from "../../utils/serverHelpers";
import { useNavigate } from "react-router-dom";

const UploadSong = () => {
  const [name, setName] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [uploadedSongFileName, setUploadedSongFileName] = useState();
  const navigate = useNavigate();

  const submitSong = async () => {
    const data = { name, thumbnail, track: playlistUrl };
    const response = await makeAuthenticatedPOSTRequest("/song/create", data);
    if (response.err) {
      alert("Could not create song");
      return;
    }
    alert("Success");
    navigate("/");
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Add Song</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <TextInput
            label="Name"
            labelClassName="text-gray-700"
            placeholder="Name"
            value={name}
            setValue={setName}
          />
        </div>
        <div>
          <TextInput
            label="Thumbnail"
            labelClassName="text-gray-700"
            placeholder="Thumbnail"
            value={thumbnail}
            setValue={setThumbnail}
          />
        </div>
      </div>

      <div className="py-5">
        {uploadedSongFileName ? (
          <div className="bg-gray-100 rounded-full p-3 w-1/2 mx-auto text-center">
            {uploadedSongFileName.substring(0, 35)}...
          </div>
        ) : (
          <CloudinaryUpload
            setUrl={setPlaylistUrl}
            setName={setUploadedSongFileName}
          />
        )}
      </div>

      <div className="flex items-center justify-center">
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full cursor-pointer font-semibold"
          onClick={submitSong}
        >
          Submit Song
        </button>
      </div>
    </div>
  );
};

export default UploadSong;



