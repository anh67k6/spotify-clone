import { useState, useEffect } from "react";
import SingleSongCard from "../components/shared/SingleSongCard";
import { makeAuthenticatedGETRequest } from "../utils/serverHelpers";
import LoggedInContainer from "../containers/LoggedInContainer";

const LikedSongs = () => {
  const [songData, setSongData] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const getData = async () => {
      const response = await makeAuthenticatedGETRequest("/song/likedSongs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSongData(response.likedSongs);
      console.log(response.likedSongs);
    };
    getData();
  }, [token]);

  return (
    <LoggedInContainer curActiveScreen="likedSongs">
      <div className="text-white text-xl font-semibold pb-4 pl-2 pt-8">
        Liked Songs
      </div>
      <div className="space-y-3 overflow-auto">
        {songData.map((item) => {
          return (
            <SingleSongCard key={item._id} info={item} playSound={() => {}} />
          );
        })}
      </div>
    </LoggedInContainer>
  );
};

export default LikedSongs;
