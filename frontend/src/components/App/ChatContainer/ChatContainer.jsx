import '../app.css';
import '../Home/NewChat/newchat.css';
import '../Modal/modal.css';
import { useEffect, useState } from "react";
import { auth, db } from "../Firebase/firebase.jsx";
import { doc, getDoc } from "firebase/firestore";
import Chat from "./Chat/Chat.jsx";

const ChatContainer = ({ handleSideBar, isSideBarOpen, handleModal, chatClass, setModalOptions, user }) => {
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

        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                await fetchUserData(user);
            } else {
                console.log("No user signed in.");
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <Chat
            handleSideBar={handleSideBar}
            isSideBarOpen={isSideBarOpen}
            handleModal={handleModal}
            className={chatClass}
            setModalOptions={setModalOptions}
            userDetails={userDetails || user}
        />
    );
};

export default ChatContainer;
