import { useState, useEffect } from "react";
import SingleSongCard from "../components/shared/SingleSongCard";
import { makeAuthenticatedGETRequest } from "../utils/serverHelpers";
import LoggedInContainer from "../containers/LoggedInContainer";
import { Howl } from "howler";
const MyMusic = () => {
  const [songData, setSongData] = useState([]);
  const [duration, setDuration] = useState(null);
  useEffect(() => {
    const getData = async () => {
      const response = await makeAuthenticatedGETRequest("/song/get/mysongs");
      response.data.forEach((item) => {
        const sound = new Howl({
          src: [item.track],
        });
        sound.once("load", () => {
          item.duration = sound.duration();
          setDuration(sound.duration());
        });
      });
      setSongData(response.data);
    };
    getData();
  }, []);
  return (
    <LoggedInContainer curActiveScreen="myMusic">
      <div className="text-white text-xl font-semibold pb-4 pl-2 pt-8">
        My Songs
      </div>
      <div className="space-y-3 overflow-auto">
        {songData.map((item) => {
          return (
            <SingleSongCard
              info={item}
              playSound={() => {}}
              key={item._id}
              duration={duration}
            />
          );
        })}
      </div>
    </LoggedInContainer>
  );
};

export default MyMusic;
