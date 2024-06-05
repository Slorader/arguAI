import React, { useEffect, useState } from "react";
import { auth } from "../Firebase/firebase.jsx";
import axios from "axios";
import GLogo from "../../../../public/images/google.png";
import { toast } from "react-toastify";
import Input from "../Form/Input/Input.jsx";
import Button from "../Form/Button/Button.jsx";
import 'animate.css';
import '../Form/Input/input.css';
import '../Form/Button/buttons.css';
import { toPng } from 'html-to-image';
import download from 'downloadjs';

const Modal = ({ handleModal, modalOptions, userDetails, notifyNewChat, notifySettings }) => {
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [binChats, setBinChats] = useState([]);
    const [chatId, setChatId] = useState("");

    useEffect(() => {
        setUser();
        fetchBinChats();
        setChatId(window.location.href.split('/').pop());
    }, []);

    const setUser = () => {
        setFname(userDetails.firstName);
        setLname(userDetails.lastName);
        setEmail(userDetails.email);
    };

    const fetchBinChats = async () => {
        const userId = auth.currentUser.uid;
        if (userId) {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/api/chats/bins/${userId}`);
                setBinChats(response.data.bin_chats);
            } catch (error) {
                console.error("Erreur lors de la récupération des chats de la bin:", error);
            }
        }
    };

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const modifyUser = async () => {
        if (isValidEmail(email)) {
            try {
                await axios.post(`http://127.0.0.1:5000/api/users/modify/${auth.currentUser.uid}`, {
                    firstName: fname,
                    lastName: lname,
                    email: email,
                });
                notifySettings();
                toast.success("User informations updated successfully.", { position: "top-right" });
            } catch (error) {
                handleError(error, "User update error.");
            }
        } else {
            console.log('Email invalide');
        }
    };

    const handleError = (error, defaultMessage) => {
        if (error.code === 'auth/requires-recent-login') {
            toast.error("Please re-authenticate and try again.", { position: "top-right" });
        } else {
            toast.error(defaultMessage, { position: "top-right" });
        }
        console.error("Erreur:", error);
    };

    const deleteChats = async (chat_uid) => {
        try {
            await axios.delete(`http://127.0.0.1:5000/api/chats/delete/${chat_uid}`);
            setBinChats(binChats.filter(c => c.id !== chat_uid));
        } catch (error) {
            console.error("Erreur lors de la suppression du chat:", error);
        }
    };

    const restoreChats = async (chat_uid) => {
        try {
            await axios.post(`http://localhost:5000/api/chats/set_bin_attribute/${chat_uid}`);
            setBinChats(binChats.filter(c => c.id !== chat_uid));
            notifyNewChat();
        } catch (error) {
            console.error("Erreur lors de la restauration du chat:", error);
        }
    };

    const exportJson = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/analyses/get/${chatId}`);
            const analyse = response.data;
            const newWindow = window.open('', '_blank');
            newWindow.document.write('<html><head><title>JSON data</title></head><body><pre>' + JSON.stringify(analyse, null, 2) + '</pre></body></html>');
            newWindow.document.close();
        } catch (error) {
            console.error("Erreur lors de la récupération des données de l'analyse:", error);
        }
    };

    const handleCapture = () => {
        const element = document.getElementById('schema-container');
        if (!element) {
            console.error('Element not found!');
            return;
        }
        handleModal();
        toPng(element, {
            cacheBust: true,
            skipFonts: true
        }).then((dataUrl) => {
            download(dataUrl, `${chatId}.png`);
        }).catch((err) => {
            console.error('oops, something went wrong!', err);
        });
    };

    return (
        <div className="modal">
            <div className={`modal-content ${modalOptions.size} animate__animated animate__fadeInUp`}>
                <div className="modal-header">
                    <h2>{modalOptions.title}</h2>
                    <button onClick={handleModal}>
                        <span className="material-symbols-rounded">close</span>
                    </button>
                </div>
                {modalOptions.title === 'Export' && (
                    <div className="content">
                        <div onClick={exportJson} className="option">
                            <p>Export as JSON</p>
                            <span className="material-symbols-rounded">description</span>
                        </div>
                        <div onClick={handleCapture} className="option">
                            <p>Export as PNG</p>
                            <span className="material-symbols-rounded">add_photo_alternate</span>
                        </div>
                    </div>
                )}
                {modalOptions.title === 'Chats deleted' && (
                    <div className="content-deleted">
                        {binChats.map(chat => (
                            <div className="option-deleted" key={chat.id}>
                                <a href={`/chat/${chat.id}`}>{chat.text}</a>
                                <div className="buttons-deleted">
                                    <button onClick={() => restoreChats(chat.id)}>
                                        <span className="material-symbols-rounded">restore_from_trash</span>
                                    </button>
                                    <button onClick={() => deleteChats(chat.id)}>
                                        <span className="material-symbols-rounded">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {modalOptions.title === "Account settings" && userDetails && (
                    <>
                        <div className="content-profile">
                            <div className="input-line">
                                <Input
                                    nameInput="Name"
                                    disabled={!!auth.currentUser.displayName}
                                    value={fname}
                                    onChange={(e) => setFname(e.target.value)}
                                    idInput="name"
                                    typeInput="text"
                                />
                                <Input
                                    nameInput="Last name"
                                    disabled={!!auth.currentUser.displayName}
                                    value={lname}
                                    onChange={(e) => setLname(e.target.value)}
                                    idInput="last_name"
                                    typeInput="text"
                                />
                            </div>
                            <Input
                                nameInput="Email"
                                disabled
                                idInput="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                typeInput="email"
                            />
                            <div className="google">
                                <img src={GLogo} alt="google" />
                                <span className="google-text">Connected with Google</span>
                                <span className="material-symbols-rounded">
                                    {auth.currentUser.displayName ? "check_circle" : "cancel"}
                                </span>
                            </div>
                        </div>
                        <div className="modal-btn">
                            <Button
                                name="Modify"
                                disabled={!!auth.currentUser.displayName}
                                onClick={modifyUser}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Modal;
