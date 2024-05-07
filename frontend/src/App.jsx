import Home from "./components/Home/Home.jsx";
import Login from "./components/Login/Login.jsx"
import Register from "./components/Register/Register.jsx";
import {BrowserRouter, BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import { auth } from "./components/Firebase/firebase.jsx";
import {useEffect, useState} from "react";
import Logo from '../public/images/AR_notext_white.png'




function App() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setIsLoading(false);
        });

        return unsubscribe;
    }, []);

    if (isLoading) {
        return <div className="loading"><img src={Logo} alt="logo"/></div>;
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={!user ? <Navigate to="/login" /> : <Home />} />
                <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
                <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
            </Routes>
            <ToastContainer />
        </BrowserRouter>
    );
}



export default App