import { useState, useEffect } from "react";
import SingleSongCard from "../components/shared/SingleSongCard";
import { makeAuthenticatedGETRequest } from "../utils/serverHelpers";
import LoggedInContainer from "../containers/LoggedInContainer";
import { useParams } from "react-router-dom";

import { Howl } from "howler";
const SeeMore = () => {
  const { categoryId } = useParams();
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
  return (
    <LoggedInContainer curActiveScreen="home">
      <div className="text-white text-xl font-semibold pb-4 pl-2 pt-8">
        {songData?.name}
      </div>
      <div className="space-y-3 overflow-auto">
        {songData && songData?.songs.length !== 0 ? (
          songData.songs.map((item, index) => {
            return (
              <SingleSongCard info={item} playSound={() => {}} key={item._id} />
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
