import { useContext, useEffect, useRef, useState } from "react";
import songContext from "../../contexts/songContext";
import { createFormatDuration } from "../../utils/song";

const SingleSongCard = ({ info, playSound, duration }) => {
  const { setCurrentSong } = useContext(songContext);
  const [formatDuration, setFormatDuration] = useState("");

  useEffect(() => {
    if (duration) {
      const formatDuration = createFormatDuration(duration);
      setFormatDuration(formatDuration);
    }
  }, [duration]);
  return (
    <div
      className="flex hover:bg-gray-400 hover:bg-opacity-20 p-2 rounded-sm"
      onClick={() => {
        setCurrentSong(info);
      }}
    >
      <div
        className="w-12 h-12 bg-cover bg-center"
        style={{
          backgroundImage: `url("${info.thumbnail}")`,
        }}
      ></div>
      <div className="flex w-full">
        <div className="text-white flex justify-center  flex-col pl-4 w-5/6">
          <div className="cursor-pointer hover:underline">{info.name}</div>
          <div className="text-xs text-gray-400 cursor-pointer hover:underline">
            {info.artist && info.artist.firstName + " " + info.artist.lastName}
          </div>
        </div>
        <div className="w-1/6 flex items-center justify-center text-gray-400 text-sm">
          <div>{formatDuration}</div>
        </div>
      </div>
    </div>
  );
};

export default SingleSongCard;
