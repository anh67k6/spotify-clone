import "./App.css";
import "./output.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginComponent from "./routes/Login";
import SignupComponent from "./routes/Signup";
import HomeComponent from "./routes/Home";
import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";
import LoggedInHomeComponent from "./routes/LoggedInHome";
import UploadSong from "./routes/UploadSong";
import MyMusic from "./routes/MyMusic";
import songContext from "./contexts/songContext";
import SearchPage from "./routes/SearchPage";
import Library from "./routes/Library";

function App() {
  const [currentSong, setCurrentSong] = useState(null);
  const [cookie, setCookie] = useCookies(["token"]);

  return (
    <div className="w-screen h-screen font-poppins">
      <BrowserRouter>
        {cookie.token ? (
          <songContext.Provider value={{ currentSong, setCurrentSong }}>
            <Routes>
              <Route path="/" element={<HelloComponent />} />
              <Route path="/home" element={<LoggedInHomeComponent />} />
              <Route path="/uploadSong" element={<UploadSong />} />
              <Route path="/myMusic" element={<MyMusic />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="*" element={<Navigate to="/home" />} />
              <Route path="/library" element={<Library />} />
            </Routes>
          </songContext.Provider >

        ) : (
          <Routes>
            <Route path="/home" element={<HomeComponent />} />
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/signup" element={<SignupComponent />} />
            <Route path="*" element={<Navigate to="/login" />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/myMusic" element={<MyMusic />} />


          </Routes>
        )}
      </BrowserRouter>
    </div>
  );
}

const HelloComponent = () => {
  return <div>This is Hello from component</div>;
};

export default App;
