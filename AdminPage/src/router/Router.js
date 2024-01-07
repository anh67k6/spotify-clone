import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import App from '../App'
import Dashboard from '../components/Dashboard'
import User from '../components/users/user'
import Song from '../components/songs/song'
import Login from '../components/auth/Login';
import NotFound from '../components/Not_Found_page'
import { useCookies } from 'react-cookie';


const Router = () => {
    const [cookies] = useCookies(['token']); 
    return (
        <div>
            <BrowserRouter>
                <Routes>
                <Route path="/login" element={cookies.token ? <Navigate to="/" /> : <Login />} />
                    <Route path="/" element={<App />}>
                        <Route index element={<Dashboard />} />
                        <Route path="/user" element={<User />} />
                        <Route path="/song" element={<Song />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default Router



