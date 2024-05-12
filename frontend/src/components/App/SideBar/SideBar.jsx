import Logo from '../../../../public/images/AR_white.png'
import History from './History/History.jsx'
import Tool from "../Home/NewChat/Tool/Tool.jsx";
import '../Home/NewChat/newchat.css'
import {useEffect, useState} from "react";
import 'animate.css';
import {auth, db} from "../Firebase/firebase.jsx"
import { toast } from "react-toastify"
import {getDoc, doc} from "firebase/firestore"
import axios from "axios";


const SideBar = ({className, handleModal, setModalOptions, handleSideBar, user, notifyNewChat}) =>
{

    const [allChats, setAllChats] = useState([]);

    useEffect(() => {
        const fetchChatData = async () => {
            try {

                const token = auth.currentUser.uid;
                const response = await axios.get(`http://127.0.0.1:5000/api/chats/`, {
                    headers : {
                        Authorization : token
                    }
                });
                setAllChats(response.data.chats);
            } catch (error) {
                console.error("Erreur lors de la récupération des données du chat:", error);
            }
        };

        fetchChatData();
    }, [notifyNewChat]);




    async function handleLogout() {
        try {
            await auth.signOut();
            window.location.href = "/login";
        } catch (error) {
            console.log(error);
        }
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleSettingsClick = () => {
        setIsModalOpen(!isModalOpen);
    }

    const handleProfileButton = () => {
        setModalOptions({title : 'Account settings', size: "large"});
        handleModal();
    }

    const handleDeletedButton = () => {
        setModalOptions({title : 'Chats deleted', size: 'medium'});
        handleModal();
    }

    return (
        <div className={className}>
            <div className="logo">
                <img src={Logo} alt="logo" />
                <Tool name="arrow_back_ios" infos="Close" onClick={handleSideBar} />
            </div>
            <History allChats = {allChats} />
            {user && (<div className="settings" onClick={handleSettingsClick}>
                <div className="user-icon">
                        <span>
                            {user.firstName.substring(0, 1).toUpperCase()}{user.lastName.substring(0, 1).toUpperCase()}
                        </span>
                </div>
                <p>{user.firstName} {user.lastName}</p>
                <span className="material-symbols-rounded">
                        expand_all
                    </span>
            </div>)}
            {isModalOpen && (<div className="modal-settings animate__animated animate__fadeIn">
                <div className="user-infos">
                    <span>{user.firstName}</span>
                    <p>{user.email}</p>
                </div>
                <div className="settings-line" onClick={handleDeletedButton}>
                    <a>Chats deleted</a>
                    <span className="material-symbols-rounded">
                            delete
                        </span>
                </div>
                <div className="settings-line" onClick={handleProfileButton}>
                    <a>Profile</a>
                    <span className="material-symbols-rounded">
                            account_circle
                        </span>
                </div>
                <div className="settings-line">
                    <a>Help</a>
                    <span className="material-symbols-rounded">
                            indeterminate_question_box
                        </span>
                </div>
                <div onClick={handleLogout} className="settings-line">
                    <a>Logout</a>
                    <span className="material-symbols-rounded">
                            logout
                        </span>
                </div>

            </div>)}
        </div>

    )
}

export default SideBar;