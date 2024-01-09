import React, { useState, useEffect, useRef } from "react";
import CloudinaryUpload from "../../shared/CloudinaryUpload";
import TextInput from "../../shared/TextInput";
import { makeAuthenticatedPOSTRequest, makeAuthenticatedGETRequest } from "../../utils/serverHelpers";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Howl } from "howler";

const UploadSong = () => {
  const [name, setName] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [singer, setSinger] = useState("");
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [uploadedSongFileName, setUploadedSongFileName] = useState();
  const [imageUrl, setImageUrl] = useState("");
  const [uploadedImageFileName, setUploadedImageFileName] = useState();
  const durationRef = useRef(0);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  
  useEffect(() => {
    if (playlistUrl.length === 0) return;
    const sound = new Howl({
      src: [playlistUrl],
    });
    sound.once("load", () => {
      durationRef.current = sound.duration();
      sound.unload();
    });
  }, [playlistUrl]);

  useEffect(() => {
    const getCates = async () => {
      console.log("test");
      const response = await makeAuthenticatedGETRequest("/category/getAll");
      setCategories(response.data);
      if (response.err) {
        toast.error("Could not get categories");
        return;
      }
    };
    getCates();
  }, []);

  const navigate = useNavigate();

  const submitSong = async () => {
    const data = {
      name,
      thumbnail,
      track: playlistUrl,
      duration: durationRef.current,
      singer,
      category: selectedCategory,
    };
    if (data.duration) {
      const response = await makeAuthenticatedPOSTRequest("/song/create", data);
      if (response.err) {
        toast.error("Could not create song");
        return;
      }
      toast.success("Success");
      navigate("/song");
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold mb-5 text-center text-gray-800">
        Upload Your Music
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <TextInput
            label="Music Name"
            placeholder="Enter music name"
            value={name}
            setValue={setName}
            className="mb-4"
          />
          <TextInput
            label="Singer"
            placeholder="Enter singer name"
            value={singer}
            setValue={setSinger}
          />
        </div>
        <div className="flex flex-col space-y-4">
          {thumbnail ? (
            <div className="flex items-center space-x-4">
              <TextInput
                label="Thumbnail"
                placeholder="Thumbnail"
                value={thumbnail.substring(0, 35) + "..."}
                readonly={true}
              />
              <button
                onClick={() => {
                  setThumbnail("");
                  setUploadedImageFileName("");
                }}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <TextInput
                label="Thumbnail"
                placeholder="Enter thumbnail URL"
                value={thumbnail}
                setValue={setThumbnail}
              />
            </div>
          )}
        </div>
      </div>
      <div className="mt-6">
        {uploadedSongFileName ? (
          <div className="flex items-center space-x-4">
            <div className="bg-gray-100 p-3 rounded-full w-1/3">
              {uploadedSongFileName.substring(0, 35)}...
            </div>
            <button
              onClick={() => {
                setPlaylistUrl("");
                setUploadedSongFileName("");
              }}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ) : (
          <CloudinaryUpload
            setUrl={setPlaylistUrl}
            setName={setUploadedSongFileName}
            resourceType="video"
            multiple={false}
            clientAllowedFormats={["mp3", "wav", "flac", "m4a", "aac"]}
            title="Upload Song"
          />
        )}
      </div>
      <div className="mt-4">
        <label htmlFor="category" className="text-gray-700 font-semibold mb-2 block">
          Category
        </label>
        <select
          id="category"
          className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option disabled selected>
            Category options
          </option>
          {categories.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-8 flex justify-center">
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



