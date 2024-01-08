import { useState, useEffect, useContext } from "react";
import SingleSongCard from "../components/shared/SingleSongCard";
import { makeAuthenticatedGETRequest } from "../utils/serverHelpers";
import LoggedInContainer, {
  checkPlaylistScreen,
} from "../containers/LoggedInContainer";
import { Howl } from "howler";
import songContext from "../contexts/songContext";
import { useLocation } from "react-router-dom";

const MyMusic = () => {
  const locationPath = useLocation();
  const [songData, setSongData] = useState([]);
  const { setCurrentSong, setPlaylist, setLocation, location, setSongIdx } =
    useContext(songContext);
  useEffect(() => {
    if (songData.length == 0) {
      const getData = async () => {
        const response = await makeAuthenticatedGETRequest("/song/get/mysongs");
        setSongData(response.data);
      };
      getData();
    }
  }, []);

  function handleCardClick(index, item) {
    if (
      (!location && checkPlaylistScreen(locationPath.pathname)) ||
      (location &&
        checkPlaylistScreen(locationPath.pathname) &&
        locationPath.pathname !== location)
    ) {
      setPlaylist(songData);
      setLocation(locationPath.pathname);
      setSongIdx(index);
      setCurrentSong(item);
    } else if (
      location &&
      checkPlaylistScreen(locationPath.pathname) &&
      locationPath.pathname === location
    ) {
      setSongIdx(index);
      setCurrentSong(item);
    }
  }
  return (
    <LoggedInContainer curActiveScreen="myMusic">
      <div className="text-white text-xl font-semibold pb-4 pl-2 pt-8">
        My Songs
      </div>
      <div className="space-y-3 overflow-auto">
        {songData.length !== 0 &&
          songData.map((item, index) => {
            return (
              <SingleSongCard
                info={item}
                playSound={() => {}}
                key={item._id}
                handleCardClick={handleCardClick.bind(this, index, item)}
              />
            );
          })}
      </div>
    </LoggedInContainer>
  );
};

export default MyMusic;
