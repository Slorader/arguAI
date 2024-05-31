import 'animate.css'
import Input from "../Form/Input/Input.jsx";
import '../Form/Input/input.css'
import Button from "../Form/Button/Button.jsx";
import '../Form/Button/buttons.css'
import {useEffect, useState} from "react";
import {auth, db} from "../Firebase/firebase.jsx";
import axios from "axios";
import GLogo from "../../../../public/images/google.png";
import {toast} from "react-toastify";


const Modal = ({handleModal, modalOptions, userDetails, notifyNewChat, notifySettings}) => {

    const [fname,setFname] = useState('');
    const [lname,setLname] = useState('');
    const [email,setEmail] = useState('');
    const [binChats, setBinChats] = useState([]);

    const setUser = () => {
        setFname(userDetails.firstName);
        setLname(userDetails.lastName);
        setEmail(userDetails.email);
    }

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };


    useEffect(() => {
        setUser();
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

    const modifyUser = async () => {
        const user = auth.currentUser;
        const data = {
            firstName: fname,
            lastName: lname,
            email: email,
        };

        if (user && isValidEmail(email)) {
            try {
                const userId = user.uid;
                const response = await axios.post(`http://127.0.0.1:5000/api/users/modify/${userId}`, data);

                notifySettings();
                toast.success("User informations updated successfully.", { position: "top-right" });
            } catch (error) {
                if (error.code === 'auth/requires-recent-login') {
                    toast.error("Please re-authenticate and try again.", { position: "top-right" });
                    console.error("Erreur d'authentification : l'utilisateur doit se reconnecter", error);
                } else {
                    toast.error("User update error.", { position: "top-right" });
                    console.error("Erreur lors de la modification des données de l'utilisateur:", error);
                }
            }
        } else {
            console.log('email invalide');
        }
    };

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
                                <div className="buttons-deleted">
                                    <button onClick={() => {
                                        restoreChats(chat.id)
                                    }}>
                                    <span className="material-symbols-rounded">
                                        restore_from_trash
                                    </span>
                                    </button>
                                    <button onClick={() => {
                                        deleteChats(chat.id)
                                    }}>
                                    <span className="material-symbols-rounded">
                                        delete
                                    </span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {modalOptions.title === "Account settings" && userDetails && (<div className="content-profile">
                    <div className="input-line">
                        <Input nameInput="Name" disabled={auth.currentUser.displayName} value={fname} onChange={(e => setFname(e.target.value))}
                               idInput="name" typeInput="text"></Input>
                        <Input nameInput="Last name" disabled={auth.currentUser.displayName} value={lname}
                               onChange={(e => setLname(e.target.value))} idInput="last_name" typeInput="text"></Input>
                    </div>
                    <Input nameInput="Email" disabled={true} idInput="email" value={email}
                           onChange={(e => setEmail(e.target.value))} typeInput="email">
                    </Input>
                    <div className="google">
                        <img src={GLogo} alt="google"/>
                        <span className="google-text">Connected with Google</span>
                        {auth.currentUser.displayName && (<span className="material-symbols-rounded">
                        check_circle
                        </span>)}
                        {!auth.currentUser.displayName && (<span className="material-symbols-rounded">
                        cancel
                        </span>)}
                    </div>
                </div>)}
                {modalOptions.title === "Account settings" && (<div className="modal-btn">
                    <Button name="Modify" disabled={auth.currentUser.displayName} onClick={modifyUser}></Button>
                </div>)}
            </div>
        </div>
    )
}

export default Modal