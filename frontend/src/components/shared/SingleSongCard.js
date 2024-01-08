import { useContext, useEffect, useRef, useState } from "react";
import songContext from "../../contexts/songContext";
import { createFormatDuration } from "../../utils/song";

const SingleSongCard = ({ info, playSound }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { currentSong, setCurrentSong } = useContext(songContext);
  function secondsToMinutes(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    const formattedTime = `${minutes}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;
    return formattedTime;
  }
  return (
    <div
      className="flex hover:bg-gray-400 hover:bg-opacity-20 p-2 rounded-sm cursor-pointer"
      onClick={() => {
        setCurrentSong(info);
      }}
    >
      <div
        className="w-14 h-14 bg-cover bg-center"
        style={{
          backgroundImage: `url("${info.thumbnail}")`,
        }}
      ></div>
      <div className="flex w-full">
        <div className="text-white flex justify-center  flex-col pl-4 w-5/6">
          <div className="cursor-pointer hover:underline">{info.name}</div>
          <div className="text-xs text-gray-400 cursor-pointer hover:underline">
            {info.singer}
          </div>
        </div>
        <div className="w-1/6 flex items-center justify-center text-gray-400 text-sm">
          <div>{secondsToMinutes(info.duration)}</div>
        </div>
      </div>
    </div>
  );
};

export default SingleSongCard;
