import { useState, useEffect, useContext } from "react";
import SingleSongCard from "../components/shared/SingleSongCard";
import { makeAuthenticatedGETRequest } from "../utils/serverHelpers";
import LoggedInContainer from "../containers/LoggedInContainer";
import { useLocation } from "react-router-dom";
import songContext from "../contexts/songContext";
import { checkPlaylistScreen } from "../containers/LoggedInContainer";
const LikedSongs = () => {
  const locationPath = useLocation();
  const [songData, setSongData] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const { setCurrentSong, setPlaylist, setLocation, location, setSongIdx } =
    useContext(songContext);

  useEffect(() => {
    const getData = async () => {
      const response = await makeAuthenticatedGETRequest("/song/likedSongs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      response.likedSongs.forEach((item) => {
        item.artist = {
          firstName: response.firstName,
          lastName: response.lastName,
        };
      });
      setSongData(response.likedSongs);
    };
    getData();
  }, [token]);

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
    <LoggedInContainer curActiveScreen="likedSongs">
      <div className="text-white text-xl font-semibold pb-4 pl-2 pt-8">
        Liked Songs
      </div>
      <div className="space-y-3 overflow-auto">
        {songData?.length !== 0 &&
          songData.map((item,index) => {
            return (
              <SingleSongCard
                key={item._id}
                info={item}
                playSound={() => {}}
                handleCardClick={handleCardClick.bind(this, index, item)}
              />
            );
          })}
      </div>
    </LoggedInContainer>
  );
};

export default LikedSongs;
