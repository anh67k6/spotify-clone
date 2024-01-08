import {
  useContext,
  useState,
  useLayoutEffect,
  useRef,
  useEffect,
} from "react";
import { Howl, Howler } from "howler";
import { Icon } from "@iconify/react";
import spotify_logo from "../assets/images/spotify_logo_white.svg";
import IconText from "../components/shared/IconText";
import TextWithHover from "../components/shared/TextWithHover";
import songContext from "../contexts/songContext";
import CreatePlaylistModal from "../modals/CreatePlaylistModal";
import AddToPlaylistModal from "../modals/AddToPlaylistModal";
import { makeAuthenticatedPOSTRequest } from "../utils/serverHelpers";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { createFormatDuration } from "../utils/song";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import userContext from "../contexts/userContext";

export const checkPlaylistScreen = (pathname) => {
  if (
    pathname.startsWith("/playlist") ||
    pathname.startsWith("/myMusic") ||
    pathname.startsWith("/likedSongs") ||
    pathname.startsWith("/category")
  ) {
    return true;
  }
  return false;
};

const LoggedInContainer = ({ children, curActiveScreen }) => {
  const pathLocation = useLocation();
  const [createPlaylistModalOpen, setCreatePlaylistModalOpen] = useState(false);
  const [addToPlaylistModalOpen, setAddToPlaylistModalOpen] = useState(false);
  const navigate = useNavigate();
  const [currentActiveScreen, setCurrentActiveScreen] =
    useState(curActiveScreen);
  const [cookie, setCookie, removeCookie] = useCookies(["token"]);

  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const volumeRef = useRef(1);
  const { user } = useContext(userContext);
  const {
    currentSong,
    setCurrentSong,
    soundPlayed,
    setSoundPlayed,
    isPaused,
    setIsPaused,
    playList,
    setPlaylist,
    location,
    setLocation,
    setSongIdx,
    songIdx,
    isLooped,
    setIsLooped,
    isShuffled,
    setIsShuffled,
  } = useContext(songContext);


  const firstUpdate = useRef(true);
  const [progressValue, setProgressValue] = useState(0);
  useLayoutEffect(() => {
    // the following if statement will prevent the useEffect from running on the first render.
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    if (!currentSong) {
      return;
    }

    changeSong(currentSong.track);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong && currentSong.track]);

  const addSongToPlaylist = async (playlistId) => {
    const songId = currentSong._id;

    const payload = { playlistId, songId };
    const response = await makeAuthenticatedPOSTRequest(
      "/playlist/add/song",
      payload
    );
    if (response._id) {
      setAddToPlaylistModalOpen(false);
    }
  };
  const addSongToLikedSongs = async () => {
    const songId = currentSong._id;

    const payload = { songId };
    const response = await makeAuthenticatedPOSTRequest(
      "/song/add-to-liked-songs",
      payload
    );
  };

  useEffect(() => {
    let interval;
    if (soundPlayed && !isPaused) {
      interval = setInterval(() => {
        if (soundPlayed.playing()) {
          setProgressValue(soundPlayed.seek() / soundPlayed.duration());
        } else if (!isPaused) {
          setProgressValue(0);
          if (isLooped) {
            playSound();
          } else {
            if (!playList) {
              setIsPaused(true);
            } else {
              nextSong();
            }
          }
        }
      }, 1000);
    }
    return () => interval && clearInterval(interval);
  }, [soundPlayed, isPaused, isLooped, isShuffled, playList]);

  const playSound = () => {
    if (!soundPlayed) {
      return;
    }
    soundPlayed.play();
  };

  const changeSong = (songSrc) => {
    if (soundPlayed) {
      soundPlayed.stop();
    }
    let sound = new Howl({
      src: [songSrc],
      html5: true,
    });
    setSoundPlayed(sound);
    sound.play();
    setIsPaused(false);
  };

  const pauseSound = () => {
    soundPlayed.pause();
  };

  const nextSong = () => {
    if (playList?.length <= 1 && isLooped) return;
    if (isLooped) {
      setCurrentSong(playList[songIdx]);
    } else {
      let nextIdx;
      if (isShuffled) {
        nextIdx = Math.floor(Math.random() * playList.length);
      } else nextIdx = (songIdx + 1 + playList.length) % playList.length;
      setSongIdx(nextIdx);
      setCurrentSong(playList[nextIdx]);
    }
  };
  const prevSong = () => {
    if (playList?.length <= 1 && isLooped) return;
    if (isLooped) {
      setCurrentSong(playList[songIdx]);
    } else {
      let nextIdx;
      if (isShuffled) {
        nextIdx = Math.floor(Math.random() * playList.length);
      } else nextIdx = (songIdx - 1 + playList.length) % playList.length;
      setSongIdx(nextIdx);
      setCurrentSong(playList[nextIdx]);
    }
  };
  const togglePlayPause = () => {
    if (isPaused) {
      playSound();
      setIsPaused(false);
    } else {
      pauseSound();
      setIsPaused(true);
    }
  };
  const handleIconClick = () => {
    setPopupVisible(!isPopupVisible);
  };
  const handleLogOut = () => {
    removeCookie("token");
    removeCookie("user");
    navigate("/login");
  };

  return (
    <div className="h-full w-full bg-app-black">
      {createPlaylistModalOpen && (
        <CreatePlaylistModal
          closeModal={() => {
            setCreatePlaylistModalOpen(false);
          }}
        />
      )}
      {addToPlaylistModalOpen && (
        <AddToPlaylistModal
          closeModal={() => {
            setAddToPlaylistModalOpen(false);
          }}
          addSongToPlaylist={addSongToPlaylist}
        />
      )}
      <div className={`${currentSong ? "h-9/10" : "h-full"} w-full flex`}>
        {/* This first div will be the left panel */}
        <div className="h-full w-1/5 bg-black flex flex-col justify-between pb-10">
          <div>
            {/* This div is for logo */}
            <div className="logoDiv p-6">
              <img src={spotify_logo} alt="spotify logo" width={125} />
            </div>
            <div className="py-5">
              <IconText
                iconName={"material-symbols:home"}
                displayText={"Home"}
                targetLink={"/home"}
                active={curActiveScreen === "home"}
              />
              <IconText
                iconName={"material-symbols:search-rounded"}
                displayText={"Search"}
                active={curActiveScreen === "search"}
                targetLink={"/search"}
              />
              <IconText
                iconName={"icomoon-free:books"}
                displayText={"Library"}
                active={curActiveScreen === "library"}
                targetLink={"/library"}
              />
              <IconText
                iconName={"material-symbols:library-music-sharp"}
                displayText={"My Music"}
                targetLink="/myMusic"
                active={curActiveScreen === "myMusic"}
              />
            </div>
            <div className="pt-5">
              <IconText
                iconName={"material-symbols:add-box"}
                displayText={"Create Playlist"}
                onClick={() => {
                  setCreatePlaylistModalOpen(true);
                  setCurrentActiveScreen("createPlaylist");
                }}
                active={currentActiveScreen === "createPlaylist"}
              />
              <IconText
                iconName={"mdi:cards-heart"}
                displayText={"Liked Songs"}
                targetLink="/likedSongs"
                active={curActiveScreen === "likedSongs"}
              />
            </div>
          </div>
          <div className="px-5">
            <div className="border border-gray-100 text-white w-2/5 flex px-2 py-1 rounded-full items-center justify-center hover:border-white cursor-pointer">
              <Icon icon="carbon:earth-europe-africa" />
              <div className="ml-2 text-sm font-semibold">English</div>
            </div>
          </div>
        </div>
        {/* This second div will be the right part(main content) */}
        <div className="h-full w-4/5 bg-app-black overflow-auto">
          <div
            className={`navbar w-full h-1/10 bg-black bg-opacity-30 flex items-center ${
              pathLocation.pathname.startsWith("/category")
                ? "justify-between"
                : "justify-end"
            }`}
          >
            {pathLocation.pathname.startsWith("/category") && (
              <div
                className="flex items-center justify-center text-gray-200 hover:text-white ml-8 bg-gray-600 hover:bg-gray-400 rounded-full h-10 w-10 text-3xl cursor-pointer select-none"
                onClick={() => {
                  navigate(-1);
                }}
              >
                &lt;
              </div>
            )}
            <div className="w-1/2 flex h-full">
              <div className="w-2/3 flex justify-around items-center">
                <TextWithHover displayText={"Premium"} />
                <TextWithHover displayText={"Support"} />
                <TextWithHover displayText={"Download"} />
                <div className="h-1/2 border-r border-white"></div>
              </div>
              <div className="w-1/3 flex justify-around h-full items-center">
                <TextWithHover
                  targetLink={"/uploadSong"}
                  displayText={"Upload Song"}
                  active={curActiveScreen === "uploadSong"}
                />

                <div
                  className="bg-white w-10 h-10 flex items-center justify-center rounded-full font-semibold cursor-pointer relative"
                  onClick={handleIconClick}
                >
                  {user?.firstName.slice(0, 1).toUpperCase() +
                    user?.lastName.slice(0, 1).toUpperCase()}
                  {isPopupVisible && (
                    <div className="absolute top-12 transform -translate-x-1/2 border rounded shadow-md z-50">
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded"
                        onClick={handleLogOut}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="content p-8 pt-0 overflow-auto">{children}</div>
        </div>
      </div>
      {/* This div is the current playing song */}
      {currentSong && (
        <div className="w-full h-1/10 bg-black bg-opacity-30 text-white flex items-center px-4">
          <div className="w-1/4 flex items-center">
            <img
              src={currentSong.thumbnail}
              alt="currentSongThumbail"
              className="h-14 w-14 rounded"
            />
            <div className="pl-4">
              <div className="text-sm hover:underline cursor-pointer">
                {currentSong.name}
              </div>
              <div className="text-xs text-gray-500 hover:underline cursor-pointer">
                {currentSong.singer}
              </div>
            </div>
          </div>
          <div className="w-1/2 flex justify-center h-full flex-col items-center">
            <div className="flex w-1/3 justify-between items-center">
              {/* controls for the playing song go here */}
              <Icon
                icon="ph:shuffle-fill"
                fontSize={30}
                className={`cursor-pointer ${
                  isShuffled ? "text-white" : "text-gray-500"
                } hover:text-white`}
                onClick={() => setIsShuffled((prev) => !prev)}
              />
              <Icon
                icon="mdi:skip-previous-outline"
                fontSize={30}
                className="cursor-pointer text-gray-500 hover:text-white"
                onClick={() => prevSong()}
              />
              <Icon
                icon={
                  isPaused
                    ? "ic:baseline-play-circle"
                    : "ic:baseline-pause-circle"
                }
                fontSize={50}
                className="cursor-pointer text-gray-500 hover:text-white"
                onClick={togglePlayPause}
              />
              <Icon
                icon="mdi:skip-next-outline"
                fontSize={30}
                className="cursor-pointer text-gray-500 hover:text-white"
                onClick={() => nextSong()}
              />
              <Icon
                icon="ic:twotone-repeat"
                fontSize={30}
                className={`cursor-pointer ${
                  isLooped ? "text-white" : "text-gray-500"
                } hover:text-white`}
                onClick={() => setIsLooped((prev) => !prev)}
              />
            </div>
            {/* <div>Progress Bar Here</div> */}
            <div
              className="  flex flex-row h-1 mt-2 justify-between items-center space-x-2"
              style={{
                width: "50%",
              }}
            >
              <div className="text-xs select-none">
                {createFormatDuration(
                  Math.ceil(progressValue * currentSong.duration)
                )}
              </div>
              <input
                className="  flex-1 h-full appearance-none bg-gray-300 rounded-full"
                type="range"
                value={progressValue * 100}
                min="0"
                max="100"
                onChange={(e) => {
                  const newValue = e.target.value / 100;
                  setProgressValue(newValue);
                  soundPlayed.seek(newValue * soundPlayed.duration());
                }}
              />
              <div className="text-xs select-none">
                {createFormatDuration(currentSong.duration)}
              </div>
            </div>
          </div>
          <div className="w-1/4 flex justify-end pr-4 space-x-4 items-center">
            {!isMuted ? (
              <Icon
                icon="ic:baseline-volume-up"
                fontSize={30}
                className="cursor-pointer text-gray-500 hover:text-white"
                onClick={() => {
                  setIsMuted(true);
                  soundPlayed.volume(0);
                  volumeRef.current = volume;
                  setVolume(0);
                }}
              />
            ) : (
              <Icon
                icon="ic:baseline-volume-off"
                fontSize={30}
                className="cursor-pointer text-white "
                onClick={() => {
                  setIsMuted(false);
                  soundPlayed.volume(volumeRef.current);
                  setVolume(volumeRef.current);
                }}
              />
            )}
            <input
              className="h-1 appearance-none bg-gray-300 rounded-full"
              type="range"
              min="0"
              max="100"
              defaultValue="100"
              value={volume * 100}
              onChange={(e) => {
                soundPlayed.volume(e.target.value / 100);
                setVolume(e.target.value / 100);
              }}
            />
            <Icon
              icon="ic:round-playlist-add"
              fontSize={30}
              className="cursor-pointer text-gray-500 hover:text-white"
              onClick={() => {
                setAddToPlaylistModalOpen(true);
              }}
            />
            <Icon
              icon="ph:heart-bold"
              fontSize={25}
              className="cursor-pointer text-gray-500 hover:text-white"
              onClick={addSongToLikedSongs}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LoggedInContainer;
