import '../../app.css'
import SideBar from '../SideBar/SideBar.jsx'
import '../SideBar/sideBar.css'
import NewChat from "./NewChat/NewChat.jsx";
import './NewChat/newchat.css'
import Modal from "../Modal/Modal.jsx";
import '../Modal/modal.css'
import {useEffect, useState} from "react";
import {auth, db} from "../Firebase/firebase.jsx";
import {doc, getDoc} from "firebase/firestore";

const Home = ({handleSideBar, isSideBarOpen, handleModal, chatClass, setModalOptions, user}) => {
    const [userDetails, setUserDetails] = useState(null);


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




    return (
        <NewChat
            handleSideBar={handleSideBar}
            isSideBarOpen={isSideBarOpen}
            handleModal={handleModal}
            className={chatClass}
            setModalOptions={setModalOptions}
            userDetails={user}
        />
    );
};

export default Home