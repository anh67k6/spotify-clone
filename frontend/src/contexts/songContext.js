import { createContext } from "react";

const songContext = createContext({
  currentSong: null,
  setCurrentSong: (currentSong) => {},
  soundPlayed: null,
  duration: null,
  setSoundPlayed: () => {},
  isPaused: null,
  setIsPaused: () => {},
  playList: null,
  setPlaylist: () => {},
  location: null,
  setLocation: () => {},
  songIdx: null,
  setSongIdx: () => {},
  isShuffled: null,
  setIsShuffled: () => {},
  isLooped: null,
  setIsLooped: () => {},
});

export default songContext;
