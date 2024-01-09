import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoggedInContainer from "../containers/LoggedInContainer";
import { makeAuthenticatedGETRequest } from "../utils/serverHelpers";
import SingleSongCard from "../components/shared/SingleSongCard";
import { Howl } from "howler";
import { useLocation } from "react-router-dom";
import songContext from "../contexts/songContext";
import { useContext } from "react";
import { checkPlaylistScreen } from "../containers/LoggedInContainer";
const SinglePlaylistView = () => {
  const locationPath = useLocation();
  const [playlistDetails, setPlaylistDetails] = useState({});
  const { playlistId } = useParams();
  const { setCurrentSong, setPlaylist, setLocation, location, setSongIdx } =
    useContext(songContext);

  useEffect(() => {
    if (playlistDetails._id) return;
    const getData = async () => {
      const response = await makeAuthenticatedGETRequest(
        "/playlist/get/" + playlistId
      );

      setPlaylistDetails(response);
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
      setPlaylist(playlistDetails.songs);
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
    <LoggedInContainer curActiveScreen={"library"}>
      {playlistDetails._id && (
        <div>
          <div className="text-white text-xl pt-8 font-semibold">
            {playlistDetails.name}
          </div>
          <div className="pt-10 space-y-3">
            {playlistDetails.songs.length != 0 &&
              playlistDetails.songs.map((item, index) => {
                return (
                  <SingleSongCard
                    info={item}
                    key={JSON.stringify(item)}
                    playSound={() => {}}
                    handleCardClick={handleCardClick.bind(this, index, item)}
                  />
                );
              })}
          </div>
        </div>
      )}
    </LoggedInContainer>
  );
};

export default SinglePlaylistView;
