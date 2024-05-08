import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {auth, db} from "./components/Firebase/firebase.jsx";
import Logo from "../public/images/AR_notext_white.png";
import SideBar from "./components/SideBar/SideBar.jsx";
import Home from "./components/Home/Home.jsx";
import Login from "./components/Login/Login.jsx";
import Register from "./components/Register/Register.jsx";
import Test from "./components/Test/Test.jsx";
import Modal from "./components/Modal/Modal.jsx";
import {doc, getDoc} from "firebase/firestore";

function App() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalOptions, setModalOptions] = useState([]);
    const chatClass = `chat ${isSideBarOpen ? '' : 'chat-fullscreen '}`;




    const handleSideBar = () => {
        setIsSideBarOpen(!isSideBarOpen);
    };

    const handleModal = () => {
        setIsModalOpen(!isModalOpen);
    };



    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user != null) {
                if (user.displayName) {
                    const displayNameParts = user.displayName.split(" ");
                    const firstName = displayNameParts[0];
                    const lastName = displayNameParts[1];

                    setUser({
                        ...user,
                        firstName: firstName,
                        lastName: lastName,
                    });
                } else {
                    try {
                        const userDocRef = doc(db, "Users", user.uid);
                        const userDocSnap = await getDoc(userDocRef);

                        if (userDocSnap.exists()) {
                            const userData = userDocSnap.data();
                            setUser({
                                ...user,
                                firstName: userData.firstName,
                                lastName: userData.lastName,
                            });
                        } else {
                            console.log("User data not found in database.");
                        }
                    } catch (error) {
                        console.error("Error fetching user data:", error);
                    }
                }
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });
        return unsubscribe;
    }, []);



    const sidebarClass = `sideBar ${isSideBarOpen ? '' : 'sideBar-closed '}`;

    if (isLoading) {
        return <div className="loading"><img src={Logo} alt="logo"/></div>;
    }

    return (
        <BrowserRouter>
            {user && (<SideBar className={sidebarClass}
                     handleSideBar={handleSideBar}
                     setModalOptions={setModalOptions}
                     user={user}
                     handleModal={handleModal}
            />)}
            <Routes>
                <Route path="/chat" element={!user ? <Navigate to="/login" /> : <Home
                    className={sidebarClass}
                    handleSideBar={handleSideBar}
                    isSideBarOpen={isSideBarOpen}
                    handleModal={handleModal}
                    chatClass ={chatClass}
                    isModalOpen={isModalOpen}
                    modalOptions={modalOptions}
                    setModalOptions={setModalOptions}
                />} />
                <Route path="/login" element={user ? <Navigate to="/chat" /> : <Login />} />
                <Route path="/register" element={user ? <Navigate to="/chat" /> : <Register />} />
                <Route path="/chat/:chatId" element={!user ? <Navigate to="/login" /> : <Test />} />
            </Routes>
            <ToastContainer />
            {isModalOpen && <Modal handleModal={handleModal} modalOptions={modalOptions} userDetails={user} />}
        </BrowserRouter>
    );
}

export default App;
