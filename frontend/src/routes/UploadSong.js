import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import spotify_logo from "../assets/images/spotify_logo_white.svg";
import CloudinaryUpload from "../components/shared/CloudinaryUpload";
import IconText from "../components/shared/IconText";
import TextInput from "../components/shared/TextInput";
import TextWithHover from "../components/shared/TextWithHover";
import {
  makeAuthenticatedGETRequest,
  makeAuthenticatedPOSTRequest,
} from "../utils/serverHelpers";
import { useNavigate } from "react-router-dom";
import LoggedInContainer from "../containers/LoggedInContainer";
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
    if (playlistUrl.length == 0) return;
    const sound = new Howl({
      src: [playlistUrl],
    });
    sound.once("load", () => {
      durationRef.current = sound.duration();
      sound.unload();
    });
  }, [[playlistUrl]]);

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
    }
  };

  return (
    <LoggedInContainer curActiveScreen={"uploadSong"}>
      <div className="text-2xl font-semibold mb-5 text-white mt-8">
        Upload Your Music
      </div>
      <div className="w-2/3 flex flex-col space-y-3">
        <div className="w-1/2">
          <TextInput
            label="Music Name"
            labelClassName={"text-white"}
            placeholder="Music Name"
            value={name}
            setValue={setName}
            className={"mb-2"}
          />
          <TextInput
            label="Singer"
            labelClassName={"text-white"}
            placeholder="Singer Name"
            value={singer}
            setValue={setSinger}
          />
        </div>
        {thumbnail ? (
          <div className="w-1/2 flex flex-row space-x-4 items-end">
            <TextInput
              label="Thumbnail"
              labelClassName={"text-white "}
              placeholder="Thumbnail"
              value={thumbnail.substring(0, 35) + "..."}
              readonly={true}
            />
            <button
              onClick={() => {
                setThumbnail("");
                setUploadedImageFileName("");
              }}
              className="text-white "
            >
              X
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-row space-x-4 items-end">
            <TextInput
              label="Thumbnail"
              labelClassName={"text-white"}
              placeholder="Thumbnail"
              value={thumbnail}
              setValue={setThumbnail}
            />
            <div className="text-white text-2xl select-none"> Or </div>
            <CloudinaryUpload
              setUrl={setThumbnail}
              setName={setUploadedImageFileName}
              resourceType={"image"}
              clientAllowedFormats={[
                "png",
                "jpg",
                "jpeg",
                "gif",
                "svg",
                "webp",
                "bmp",
                "tiff",
              ]}
              multiple={false}
              title={"Upload Thumbnail"}
            />
          </div>
        )}
      </div>

      <div className="py-5">
        {uploadedSongFileName ? (
          <div className="flex flex-row space-x-3">
            <div className="bg-white rounded-full p-3 w-1/3">
              {uploadedSongFileName.substring(0, 35)}...
            </div>
            <button
              onClick={() => {
                setPlaylistUrl("");
                setUploadedSongFileName("");
              }}
              className="text-white"
            >
              X
            </button>
          </div>
        ) : (
          <CloudinaryUpload
            setUrl={setPlaylistUrl}
            setName={setUploadedSongFileName}
            resourceType={"video"}
            multiple={false}
            clientAllowedFormats={["mp3", "wav", "flac", "m4a", "aac"]}
            title={"Upload Song"}
          />
        )}
      </div>
      <div className="inline-block relative w-64">
        <div className={`font-semibold text-white mb-2`}>Category</div>
        <select
          className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option selected disabled>
            Category options
          </option>
          {categories.map((item) => {
            return (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            );
          })}
        </select>
        <div
          className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
          style={{
            top: "50%",
          }}
        >
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M10 12l-6-6h12l-6 6z" />
          </svg>
        </div>
      </div>
      <div className="mt-20 flex flex-row justify-center items-center w-full">
        <div
          className="bg-white w-40 flex items-center justify-center p-4 rounded-full cursor-pointer font-semibold"
          onClick={submitSong}
        >
          Submit Song
        </div>
      </div>
    </LoggedInContainer>
  );
};

export default UploadSong;
