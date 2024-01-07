import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import spotify_logo from "../assets/images/spotify_logo_white.svg";
import CloudinaryUpload from "../components/shared/CloudinaryUpload";
import IconText from "../components/shared/IconText";
import TextInput from "../components/shared/TextInput";
import TextWithHover from "../components/shared/TextWithHover";
import { makeAuthenticatedPOSTRequest } from "../utils/serverHelpers";
import { useNavigate } from "react-router-dom";
import LoggedInContainer from "../containers/LoggedInContainer";
import { Howl } from "howler";
const UploadSong = () => {
  const [name, setName] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [uploadedSongFileName, setUploadedSongFileName] = useState();
  const [imageUrl, setImageUrl] = useState("");
  const [uploadedImageFileName, setUploadedImageFileName] = useState();
  const durationRef = useRef(0);

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
  const navigate = useNavigate();

  const submitSong = async () => {
    const data = {
      name,
      thumbnail,
      track: playlistUrl,
      duration: durationRef.current,
    };

    if (data.duration) {
      const response = await makeAuthenticatedPOSTRequest("/song/create", data);
      console.log("response ", response);
      if (response?.err) {
        alert("Could not create song");
        return;
      } else {
        alert("Success");
      }
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
            label="Name"
            labelClassName={"text-white"}
            placeholder="Name"
            value={name}
            setValue={setName}
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
      <div
        className="bg-white w-40 flex items-center justify-center p-4 rounded-full cursor-pointer font-semibold"
        onClick={submitSong}
      >
        Submit Song
      </div>
    </LoggedInContainer>
  );
};

export default UploadSong;
