import '../../app.css'
import SideBar from '../SideBar/SideBar.jsx'
import '../SideBar/sideBar.css'
import '../Home/NewChat/newchat.css'
import Modal from "../Modal/Modal.jsx";
import '../Modal/modal.css'
import {useEffect, useState} from "react";
import {auth, db} from "../Firebase/firebase.jsx";
import {doc, getDoc} from "firebase/firestore";
import Chat from "./Chat/Chat.jsx";

const Test = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalOptions, setModalOptions] = useState([]);
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const docRef = doc(db, "Users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setUserDetails(userData);
                } else {
                    console.log("User data does not exist.");
                }
            } else {
                console.log("No user signed in.");
            }
        });

        return () => unsubscribe();
    }, []);

    const handleSideBar = () => {
        setIsSideBarOpen(!isSideBarOpen);
    };

    const handleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const sidebarClass = `sideBar ${isSideBarOpen ? '' : 'sideBar-closed '}`;
    const chatClass = `chat ${isSideBarOpen ? '' : 'chat-fullscreen '}`;

    return (
        <>
            <SideBar
                className={sidebarClass}
                handleModal={handleModal}
                setModalOptions={setModalOptions}
                handleSideBar={handleSideBar}
                userDetails={userDetails}
            />
            <Chat
                handleSideBar={handleSideBar}
                isSideBarOpen={isSideBarOpen}
                handleModal={handleModal}
                className={chatClass}
                setModalOptions={setModalOptions}
                userDetails={userDetails}
            />
            {isModalOpen && <Modal handleModal={handleModal} modalOptions={modalOptions} userDetails={userDetails} />}

        </>
    );
};

export default Test