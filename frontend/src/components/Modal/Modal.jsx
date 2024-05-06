import 'animate.css'
import Input from "../Input/Input.jsx";
import '../Input/input.css'
import Button from "../Button/Button.jsx";
import '../Button/buttons.css'
import {auth, db} from "../Firebase/firebase.jsx"
import { toast } from "react-toastify"
import {getDoc, doc} from "firebase/firestore"
import {useEffect, useState} from "react";
const Modal = ({handleModal, modalOptions, userDetails}) => {

    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassord] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');



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
                {modalOptions.title === 'Chats deleted' && (<div className="content-deleted">
                    <div className="option-deleted">
                        <a href="">The RGU School of Computing is a great place to study. The staff are friendly, the
                            labs
                            are state-of-the-art, and the subjects are engaging. So, you will have an amazing time
                            during
                            your degree.
                        </a>
                        <button>
                            <span className="material-symbols-rounded">
                                restore_from_trash
                            </span>
                        </button>
                        <button>
                            <span className="material-symbols-rounded">
                                delete
                            </span>
                        </button>
                    </div>
                    <div className="option-deleted">
                        <a href="">The RGU School of Computing is a great place to study. The staff are friendly, the
                            labs
                            are state-of-the-art, and the subjects are engaging. So, you will have an amazing time
                            during
                            your degree.
                        </a>
                        <button>
                            <span className="material-symbols-rounded">
                                restore_from_trash
                            </span>
                        </button>
                        <button>
                            <span className="material-symbols-rounded">
                                delete
                            </span>
                        </button>
                    </div>
                    <div className="option-deleted">
                        <a href="">The RGU School of Computing is a great place to study. The staff are friendly, the
                            labs
                            are state-of-the-art, and the subjects are engaging. So, you will have an amazing time
                            during
                            your degree.
                        </a>
                        <button>
                            <span className="material-symbols-rounded">
                                restore_from_trash
                            </span>
                        </button>
                        <button>
                            <span className="material-symbols-rounded">
                                delete
                            </span>
                        </button>
                    </div>
                    <div className="option-deleted">
                        <a href="">The RGU School of Computing is a great place to study. The staff are friendly, the
                            labs
                            are state-of-the-art, and the subjects are engaging. So, you will have an amazing time
                            during
                            your degree.
                        </a>
                        <button>
                            <span className="material-symbols-rounded">
                                restore_from_trash
                            </span>
                        </button>
                        <button>
                            <span className="material-symbols-rounded">
                                delete
                            </span>
                        </button>
                    </div>
                    <div className="option-deleted">
                        <a href="">The RGU School of Computing is a great place to study. The staff are friendly, the
                            labs
                            are state-of-the-art, and the subjects are engaging. So, you will have an amazing time
                            during
                            your degree.
                        </a>
                        <button>
                            <span className="material-symbols-rounded">
                                restore_from_trash
                            </span>
                        </button>
                        <button>
                            <span className="material-symbols-rounded">
                                delete
                            </span>
                        </button>
                    </div>
                </div>)}
                {modalOptions.title === "Account settings"  && userDetails && (<div className="content-profile">
                    <div className="input-line">
                        <Input nameInput="Name" value={userDetails.firstName} onChange={(e => setFname(e.target.value))} idInput="name" typeInput="text"></Input>
                        <Input nameInput="Last name" value={userDetails.lastName} onChange={(e => setLname(e.target.value))} idInput="last_name" typeInput="text"></Input>
                    </div>
                    <Input nameInput="Email" idInput="email" value={userDetails.email} onChange={(e => setEmail(e.target.value))} typeInput="email"></Input>
                    <Input nameInput="Current password" idInput="currentPassword" value={userDetails.password} onChange={(e => setPassord(e.target.value))} typeInput="password"></Input>
                    <Input nameInput="New password" idInput="newPassword" onChange={(e => setNewPassword(e.target.value))} typeInput="password"></Input>
                    <Input nameInput="Confirm new password" idInput="confirmPassword" onChange={(e => setConfirmNewPassword(e.target.value))} typeInput="password"></Input>
                    <Button name="Modify" idInput="modify"></Button>
                </div>)}
            </div>
        </div>
    )
}

export default Modal