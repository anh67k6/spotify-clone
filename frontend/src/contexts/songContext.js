import { createContext } from "react";

const songContext = createContext({
    currentSong:null,
    setCurrentSong:() => {
    }
});

export default songContext;