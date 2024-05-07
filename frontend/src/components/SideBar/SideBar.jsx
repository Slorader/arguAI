import Logo from '../../../public/images/AR_white.png'
import History from './History/History.jsx'
import Tool from "../Chat/Tool/Tool.jsx";
import '../Chat/chat.css'
import {useEffect, useState} from "react";
import 'animate.css';
import {auth, db} from "../Firebase/firebase.jsx"
import { toast } from "react-toastify"
import {getDoc, doc} from "firebase/firestore"


const SideBar = ({className, handleModal, setModalOptions, handleSideBar, userDetails}) =>
{

    console.log(userDetails);

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
            <History />
            {userDetails && (<div className="settings" onClick={handleSettingsClick}>
                <div className="user-icon">
                        <span>
                            {userDetails.firstName.substring(0, 1).toUpperCase()}{userDetails.lastName.substring(0, 1).toUpperCase()}
                        </span>
                </div>
                <p>{userDetails.firstName} {userDetails.lastName}</p>
                <span className="material-symbols-rounded">
                        expand_all
                    </span>
            </div>)}
            {isModalOpen && (<div className="modal-settings animate__animated animate__fadeIn">
                <div className="user-infos">
                    <span>{userDetails.firstName}</span>
                    <p>{userDetails.email}</p>
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