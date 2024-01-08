import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoggedInContainer from "../containers/LoggedInContainer";
import { makeAuthenticatedGETRequest } from "../utils/serverHelpers";
import SingleSongCard from "../components/shared/SingleSongCard";
import { Howl } from "howler";

const SinglePlaylistView = () => {
  const [playlistDetails, setPlaylistDetails] = useState({});
  const { playlistId } = useParams();

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
