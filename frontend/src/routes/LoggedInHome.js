import { useState, useEffect } from "react";
import { makeAuthenticatedGETRequest } from "../utils/serverHelpers";
import LoggedInContainer from "../containers/LoggedInContainer";
import { useContext } from "react";
import songContext from "../contexts/songContext";
import Howl from "howler";

const Home = () => {
  const [categoryData, setCategoryData] = useState([]);

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

  return (
    <LoggedInContainer curActiveScreen="home">
      {categoryData.map((item) => (
        <PlaylistView
          key={item._id}
          titleText={item.name}
          cardsData={item.songs}
        />
      ))}
    </LoggedInContainer>
  );
};

const PlaylistView = ({ titleText, cardsData }) => {
  return (
    <div className="text-white mt-8">
      <div className="flex flex-row justify-between">
        <div className="text-2xl font-semibold mb-5">{titleText}</div>
        <div
          className="text-base mb-5 cursor-pointer select-none 
          text-gray-400
          hover:underline
          hover:text-white
          self-end
        "
        >
          See More &gt;&gt;
        </div>
      </div>
      <div className="w-full flex flex-row space-x-4">
        {cardsData.map((item) => (
          <Card
            key={item._id}
            thumbnail={item.thumbnail}
            name={item.name}
            artist={item.singer} // Adjust accordingly
            item={item}
          />
        ))}
      </div>
    </div>
  );
};

const Card = ({ thumbnail, name, artist, item }) => {
  const { currentSong, isPaused, setIsPaused, soundPlayed, setCurrentSong } =
    useContext(songContext);
  const [isHovered, setIsHovered] = useState(false);

  const togglePlaySong = () => {
    if (currentSong) {
      if (currentSong._id === item._id) {
        if (isPaused) {
          soundPlayed.play();
          setIsPaused(false);
        } else {
          soundPlayed.pause();
          setIsPaused(true);
        }
      } 
      else {
        setCurrentSong(item);
      }
    } else {
      setCurrentSong(item);
    }
  };
  return (
    <div
      className="bg-black bg-opacity-40 w-1/5 p-4 rounded-lg cursor-pointer relative hover:bg-gray-900"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="pb-4 pt-2">
        <img className="w-full rounded-md h-40" src={thumbnail} alt="label" />
      </div>
      <div className="text-white font-semibold py-3">{name}</div>
      <div className="text-gray-500 text-sm">{artist}</div>
      {(isHovered || currentSong?._id === item._id) && (
        <div
          className="absolute bottom-1/4 right-5 bg-green-500 p-2 rounded-full hover:bg-green-400 transform transition duration-100 ease-in-out hover:scale-110"
          onClick={() => togglePlaySong()}
        >
          {!isPaused && currentSong?._id === item._id ? pauseIcon : playIcon}
        </div>
      )}
    </div>
  );
};

export default Home;

//       className="absolute bottom-1/4 right-5 bg-green-500 p-2 rounded-full hover:bg-green-400 transform transition duration-100 ease-in-out hover:scale-110"
//       onClick={() => {
//         if (!currentSong) {
//           setCurrentSong(item);
//           setIsPlaying(true);
//         } else {
//           if (currentSong._id === item._id) {
//             if (isPlaying) {
//               soundPlayed.pause();
//               setIsPlaying(false);
//             } else {
//               soundPlayed.play();
//               setIsPlaying(true);
//             }
//           } else {
//             setCurrentSong(item);
//             setIsPlaying(true);
//           }
//         }
//       }}
//     >
//       {isPlaying ? pauseIcon : playIcon}
//     </div>
//   );
// };
const pauseIcon = (
  <svg
    data-encore-id="icon"
    role="img"
    aria-hidden="true"
    viewBox="0 0 24 24"
    className=" w-8 h-8 text-black fill-current hover:text-black hover:opacity-90"
  >
    <path d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7H5.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-2.6z"></path>
  </svg>
);
const playIcon = (
  <svg
    data-encore-id="icon"
    role="img"
    aria-hidden="true"
    viewBox="0 0 24 24"
    className=" w-8 h-8 text-black fill-current hover:text-black hover:opacity-90"
  >
    <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
  </svg>
);
