import { useState, useEffect, useContext } from "react";
import SingleSongCard from "../components/shared/SingleSongCard";
import { makeAuthenticatedGETRequest } from "../utils/serverHelpers";
import LoggedInContainer from "../containers/LoggedInContainer";
import { useLocation, useParams } from "react-router-dom";
import { checkPlaylistScreen } from "../containers/LoggedInContainer";
import { Howl } from "howler";
import songContext from "../contexts/songContext";
const SeeMore = () => {
  const locationPath = useLocation();
  const { categoryId } = useParams();
  const { setCurrentSong, setPlaylist, setLocation, location, setSongIdx } =
    useContext(songContext);
  const [songData, setSongData] = useState(null);
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await makeAuthenticatedGETRequest(
          `/category/get/${categoryId}/songs`
        );
        setSongData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);
  function handleCardClick(index, item) {

    if (
      (!location && checkPlaylistScreen(locationPath.pathname)) ||
      (location &&
        checkPlaylistScreen(locationPath.pathname) &&
        locationPath.pathname !== location)
    ) {
      setPlaylist(songData.songs);
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
    <LoggedInContainer curActiveScreen="home">
      <div className="text-white text-xl font-semibold pb-4 pl-2 pt-8">
        {songData?.name}
      </div>
      <div className="space-y-3 overflow-auto">
        {songData && songData?.songs.length !== 0 ? (
          songData.songs.map((item, index) => {
            return (
              <SingleSongCard
                info={item}
                playSound={() => {}}
                key={item._id}
                handleCardClick={handleCardClick.bind(this, index, item)}
              />
            );
          })
        ) : (
          <div className="text-white text-xl font-semibold pb-4 pl-2 pt-8">
            No songs found
          </div>
        )}
      </div>
    </LoggedInContainer>
  );
};

export default SeeMore;
