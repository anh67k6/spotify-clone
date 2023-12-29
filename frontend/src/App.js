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

function App() {
  const [currentSong, setCurrentSong] = useState(null);
  const [cookie, setCookie] = useCookies(["token"]);

  return (
    <div className="w-screen h-screen font-poppins">
      <BrowserRouter>
        {cookie.token ? (
          <Routes>
            <songContext.Provider value={{currentSong, setCurrentSong}}>
              <Route path="/" element={<HelloComponent />} />
              <Route path="/home" element={<LoggedInHomeComponent />} />
              <Route path="/uploadSong" element={<UploadSong />} />
              <Route path="/myMusic" element={<MyMusic />} />
              <Route path="*" element={<Navigate to="/home" />} />
              </songContext.Provider >
          </Routes>

        ) : (
          <Routes>
            <Route path="/home" element={<HomeComponent />} />
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/signup" element={<SignupComponent />} />
            <Route path="*" element={<Navigate to="/login" />} />
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
