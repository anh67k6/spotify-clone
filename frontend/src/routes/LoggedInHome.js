import { useState, useEffect } from "react";
import { makeAuthenticatedGETRequest } from "../utils/serverHelpers";
import LoggedInContainer from "../containers/LoggedInContainer";

const Home = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [focusCardsData, setFocusCardsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (categoryData.length === 0) {
        try {
          const response = await makeAuthenticatedGETRequest(
            "/category/get/me"
          );
          setCategoryData(response.data);
        } catch (error) {
          console.error("Error fetching category data: ", error);
        }
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const getFocusCardsData = async () => {
      const tempFocusCardsData = [];
      for (const category of categoryData) {
        try {
          const response = await makeAuthenticatedGETRequest(
            `/category/get/${category._id}/songs`
          );
          if (response.data && response.data.songs) {
            tempFocusCardsData.push({ category, songs: response.data.songs });
          }
        } catch (error) {
          console.error("Error fetching songs for category:", error);
        }
      }
      setFocusCardsData(tempFocusCardsData);
    };

    if (categoryData.length > 0) {
      getFocusCardsData();
    }
  }, [categoryData]);

  return (
    <LoggedInContainer curActiveScreen="home">
      <PlaylistView titleText={categoryData} cardsData={focusCardsData} />
    </LoggedInContainer>
  );
};

const PlaylistView = ({ titleText, cardsData }) => {
  return (
    <div className="text-white mt-8">
      <div className="text-2xl font-semibold mb-5">
        {titleText.map((item) => item.name)}
      </div>
      <div className="w-full flex justify-between space-x-4">
        {cardsData.map((item) => (
          <Card
            key={item.category._id}
            thumbnail={item.category.thumbnail}
            name={item.category.name}
            artist={item.songs.map((song) => song.name).join(", ")} // Adjust accordingly
          />
        ))}
      </div>
    </div>
  );
};

const Card = ({ thumbnail, name, artist }) => {
  return (
    <div className="bg-black bg-opacity-40 w-1/5 p-4 rounded-lg">
      <div className="pb-4 pt-2">
        <img className="w-full rounded-md" src={thumbnail} alt="label" />
      </div>
      <div className="text-white font-semibold py-3">{name}</div>
      <div className="text-gray-500 text-sm">{artist}</div>
    </div>
  );
};

export default Home;
