import 'animate.css'
import Input from "../Form/Input/Input.jsx";
import '../Form/Input/input.css'
import Button from "../Form/Button/Button.jsx";
import '../Form/Button/buttons.css'
import {useEffect, useState} from "react";
import {auth, db} from "../Firebase/firebase.jsx";
import axios from "axios";

const Modal = ({handleModal, modalOptions, userDetails, notifyNewChat}) => {

    const setFname = useState('');
    const setLname = useState('');
    const setEmail = useState('');
    const setPassord = useState('');
    const setNewPassword = useState('');
    const setConfirmNewPassword = useState('');
    const [binChats, setBinChats] = useState([]);


    useEffect(() => {
        const fetchBinChats = async () => {
            const userId = auth.currentUser.uid;
            if (userId)
            {
                try {

                    const response = await axios.get(`http://127.0.0.1:5000/api/chats/bins/${userId}`);
                    setBinChats(response.data.bin_chats);
                } catch (error) {
                    console.error("Erreur lors de la récupération des chats de la bin:", error);
                }
            }

        };

        fetchBinChats();
    }, []);


    const deleteChats = async (chat_uid) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:5000/api/chats/delete/${chat_uid}`);
            setBinChats(binChats.filter(c => c.id !== chat_uid));
        } catch (error) {
            console.error("Erreur lors de la suppression du chat:", error);
        }
    };

    const restoreChats = async (chat_uid) => {
        try {
            const response = await axios.post(`http://localhost:5000/api/chats/set_bin_attribute/${chat_uid}`, null, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setBinChats(binChats.filter(c => c.id !== chat_uid));
            notifyNewChat();
        } catch (error) {
            console.error("Erreur lors de la suppression du chat:", error);
        }
    };


    return (

        <div className="modal">
            <div className={"modal-content " + modalOptions.size + " animate__animated animate__fadeInUp"}>
                <div className="modal-header ">
                    <h2>{modalOptions.title}</h2>
                    <button onClick={handleModal}>
                    <span className="material-symbols-rounded">
                        close
                    </span>
                    </button>
                </div>
                {modalOptions.title === 'Export' && (<div className="content">
                    <div className="option">
                        <p>Export as JSON</p>
                        <span className="material-symbols-rounded">
                            description
                        </span>
                    </div>
                    <div className="option">
                        <p>Export as PNG</p>
                        <span className="material-symbols-rounded">
                            add_photo_alternate
                        </span>
                    </div>
                </div>)}
                {modalOptions.title === 'Chats deleted' && (
                    <div className="content-deleted">
                        {binChats.map(chat => (
                            <div className="option-deleted" key={chat.id}>
                                <a href={`/chat/${chat.id}`}>{chat.text}</a>
                                <button onClick={() => {restoreChats(chat.id)}}>
                                    <span className="material-symbols-rounded">
                                        restore_from_trash
                                    </span>
                                </button>
                                <button onClick={() => {deleteChats(chat.id)}}>
                                    <span className="material-symbols-rounded">
                                        delete
                                    </span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                {modalOptions.title === "Account settings" && userDetails && (<div className="content-profile">
                    <div className="input-line">
                        <Input nameInput="Name" value={userDetails.firstName} onChange={(e => setFname(e.target.value))}
                               idInput="name" typeInput="text"></Input>
                        <Input nameInput="Last name" value={userDetails.lastName}
                               onChange={(e => setLname(e.target.value))} idInput="last_name" typeInput="text"></Input>
                    </div>
                    <Input nameInput="Email" idInput="email" value={userDetails.email}
                           onChange={(e => setEmail(e.target.value))} typeInput="email"></Input>
                    <Input nameInput="Current password" idInput="currentPassword" value={userDetails.password}
                           onChange={(e => setPassord(e.target.value))} typeInput="password"></Input>
                    <Input nameInput="New password" idInput="newPassword"
                           onChange={(e => setNewPassword(e.target.value))} typeInput="password"></Input>
                    <Input nameInput="Confirm new password" idInput="confirmPassword"
                           onChange={(e => setConfirmNewPassword(e.target.value))} typeInput="password"></Input>
                </div>)}
                {modalOptions.title === "Account settings" && (<div className="modal-btn">
                    <Button name="Modify" idInput="modify"></Button>
                </div>)}
            </div>
        </div>
    )
}

export default Modal