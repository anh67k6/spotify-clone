import "./output.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginComponent from "./routes/Login";
import SignupComponent from "./routes/Signup";
import HomeComponent from "./routes/Home";
import LoggedInHomeComponent from "./routes/LoggedInHome";
import UploadSong from "./routes/UploadSong";
import LikedSongs from "./routes/LikedSongs";
import MyMusic from "./routes/MyMusic";
import SearchPage from "./routes/SearchPage";
import Library from "./routes/Library";
import SinglePlaylistView from "./routes/SinglePlaylistView";
import { useCookies } from "react-cookie";
import songContext from "./contexts/songContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SeeMore from "./routes/SeeMore";
import { UserContextProvider } from "./contexts/userContext";

function App() {
  const [currentSong, setCurrentSong] = useState(null);
  const [soundPlayed, setSoundPlayed] = useState(null);
  const [playList, setPlaylist] = useState(null);
  const [isPaused, setIsPaused] = useState(true);
  const [cookie, setCookie] = useCookies(["token"]);
  const [location, setLocation] = useState(null);
  const [songIdx, setSongIdx] = useState(null);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isLooped, setIsLooped] = useState(false);
  return (
    <div className="w-screen h-screen font-poppins">
      <ToastContainer />
      <BrowserRouter>
        <UserContextProvider>
          {cookie.token ? (
            // logged in routes
            <songContext.Provider
              value={{
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
                songIdx,
                setSongIdx,
                isLooped,
                setIsLooped,
                isShuffled,
                setIsShuffled,
              }}
            >
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to="/home" />} // Chuyển hướng đến /home khi người dùng đã đăng nhập
                />
                <Route path="/home" element={<LoggedInHomeComponent />} />
                <Route path="/uploadSong" element={<UploadSong />} />
                <Route path="/myMusic" element={<MyMusic />} />
                <Route path="/likedSongs" element={<LikedSongs />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/library" element={<Library />} />
                <Route path="/category/:categoryId" element={<SeeMore />} />
                <Route
                  path="/playlist/:playlistId"
                  element={<SinglePlaylistView />}
                />
                <Route path="*" element={<Navigate to="/home" />} />
              </Routes>
            </songContext.Provider>
          ) : (
            // logged out routes
            <Routes>
              <Route path="/home" element={<HomeComponent />} />
              <Route path="/login" element={<LoginComponent />} />
              <Route path="/signup" element={<SignupComponent />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          )}
        </UserContextProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
