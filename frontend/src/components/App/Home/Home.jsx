import '../app.css';
import '../SideBar/sideBar.css';
import './NewChat/newchat.css';
import '../Modal/modal.css';
import { useEffect, useState } from "react";
import { auth, db } from "../Firebase/firebase.jsx";
import { doc, getDoc } from "firebase/firestore";
import NewChat from "./NewChat/NewChat.jsx";

const Home = ({ handleSideBar, isSideBarOpen, handleModal, chatClass, setModalOptions, user, notifyNewChat }) => {
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        const fetchUserData = async (user) => {
            const docRef = doc(db, "Users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUserDetails(docSnap.data());
            } else {
                console.log("User data does not exist.");
            }
        };

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchUserData(user);
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
            userDetails={userDetails || user}
            notifyNewChat={notifyNewChat}
        />
    );
};

export default Home;
