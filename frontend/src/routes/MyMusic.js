import { useState, useEffect } from "react";
import SingleSongCard from "../components/shared/SingleSongCard";
import { makeAuthenticatedGETRequest } from "../utils/serverHelpers";
import LoggedInContainer from "../containers/LoggedInContainer";
import { Howl } from "howler";
const MyMusic = () => {
  const [songData, setSongData] = useState([]);
  useEffect(() => {
    if (songData.length == 0) {
      const getData = async () => {
        const response = await makeAuthenticatedGETRequest("/song/get/mysongs");
        setSongData(response.data);
      };
      getData();
    }
  }, []);
  return (
    <LoggedInContainer curActiveScreen="myMusic">
      <div className="text-white text-xl font-semibold pb-4 pl-2 pt-8">
        My Songs
      </div>
      <div className="space-y-3 overflow-auto">
        {songData.length !== 0 &&
          songData.map((item, index) => {
            return (
              <SingleSongCard info={item} playSound={() => {}} key={item._id} />
            );
          })}
      </div>
    </LoggedInContainer>
  );
};

export default MyMusic;
