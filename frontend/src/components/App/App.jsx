import React, { useEffect, useState, useCallback } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, db } from "./Firebase/firebase.jsx";
import Logo from "../../../public/images/AR_notext_white.png";
import SideBar from "./SideBar/SideBar.jsx";
import Home from "./Home/Home.jsx";
import Login from "./Auth/Login/Login.jsx";
import Register from "./Auth/Register/Register.jsx";
import ChatContainer from "./ChatContainer/ChatContainer.jsx";
import Modal from "./Modal/Modal.jsx";
import { doc, getDoc } from "firebase/firestore";

function App() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalOptions, setModalOptions] = useState([]);
    const [newChatNotification, setNewChatNotification] = useState(false);
    const [updateSettings, setUpdateSettings] = useState(false);

    const toggleState = (setter) => () => setter(prev => !prev);

    const handleSideBar = toggleState(setIsSideBarOpen);
    const handleModal = toggleState(setIsModalOpen);
    const notifySettings = toggleState(setUpdateSettings);
    const notifyNewChat = toggleState(setNewChatNotification);

    const fetchUserDetails = useCallback(async (user) => {
        if (user.displayName) {
            const [firstName, lastName] = user.displayName.split(" ");
            setUser({ ...user, firstName, lastName });
        } else {
            try {
                const userDocRef = doc(db, "Users", user.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const { firstName, lastName } = userDocSnap.data();
                    setUser({ ...user, firstName, lastName });
                } else {
                    console.log("User data not found in database.");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                await fetchUserDetails(user);
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });
        return unsubscribe;
    }, [fetchUserDetails]);

    const sidebarClass = `sideBar ${isSideBarOpen ? '' : 'sideBar-closed'}`;
    const chatClass = `chat ${isSideBarOpen ? '' : 'chat-fullscreen'}`;

    if (isLoading) {
        return <div className="loading"><img src={Logo} alt="logo" /></div>;
    }

    return (
        <BrowserRouter>
            {user && (
                <SideBar
                    className={sidebarClass}
                    handleSideBar={handleSideBar}
                    setModalOptions={setModalOptions}
                    user={user}
                    handleModal={handleModal}
                    notifyNewChat={newChatNotification}
                    updateSideBarSettings={updateSettings}
                />
            )}
            <Routes>
                <Route path="/chat" element={user ? <Home
                    className={sidebarClass}
                    handleSideBar={handleSideBar}
                    isSideBarOpen={isSideBarOpen}
                    handleModal={handleModal}
                    chatClass={chatClass}
                    isModalOpen={isModalOpen}
                    modalOptions={modalOptions}
                    setModalOptions={setModalOptions}
                    notifyNewChat={notifyNewChat}
                /> : <Navigate to="/login" />} />
                <Route path="/login" element={user ? <Navigate to="/chat" /> : <Login />} />
                <Route path="/register" element={user ? <Navigate to="/chat" /> : <Register />} />
                <Route path="/chat/:chatId" element={user ? <ChatContainer
                    className={sidebarClass}
                    handleSideBar={handleSideBar}
                    isSideBarOpen={isSideBarOpen}
                    handleModal={handleModal}
                    chatClass={chatClass}
                    isModalOpen={isModalOpen}
                    modalOptions={modalOptions}
                    setModalOptions={setModalOptions}
                /> : <Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/chat" />} />
            </Routes>
            <ToastContainer />
            {isModalOpen && <Modal
                handleModal={handleModal}
                notifyNewChat={notifyNewChat}
                modalOptions={modalOptions}
                userDetails={user}
                notifySettings={notifySettings}
            />}
        </BrowserRouter>
    );
}

export default App;
