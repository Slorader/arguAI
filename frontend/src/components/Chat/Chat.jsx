import Tool from "./Tool/Tool.jsx";
import Logo from '../../../public/images/AR_notext_white.png'
import message from "./Message/Message.jsx";
import './Message/message.css'

import {useRef, useState, useEffect} from "react";
import Message from "./Message/Message.jsx";
import { auth } from "../Firebase/firebase.jsx";

const Chat = ({ handleSideBar, isSideBarOpen, className, handleModal, setModalOptions}) => {


    const handleArrowButton = () => {
        if (isSideBarOpen) {
            return <Tool name="arrow_back_ios" infos="Close" onClick={handleSideBar} />;
        }
        return <Tool name="arrow_forward_ios" infos="Open" onClick={handleSideBar} />;
    };

    const textAreaRef = useRef(null)
    const [val, setVal] = useState("");
    const [isChat, setIsChat] = useState(false);
    const [isHome, setIsHome] = useState(true);
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        // Mettre à jour la date et l'heure toutes les secondes
        const interval = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        // Nettoyer l'intervalle lors du démontage du composant
        return () => clearInterval(interval);
    }, []);


    const handleChange = (e) => {
        setVal(e.target.value);
    }

    useEffect( () =>{

            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
            }, [val])

    const handleExportButton = () => {
        setModalOptions({title : 'Export', size: 'small'});
        handleModal();
    };

    const sendMessageToServer = async () => {
        const data = {
            text : val,
            user_uid : auth.currentUser.uid,
            created : currentDateTime,
            modified : currentDateTime
        }
        try {
            const response = await fetch('http://localhost:5000/api/chats/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: data })
            });

            if (!response.ok) {
                throw new Error('Failed to send message to server');
            }

            const final = await response.json();
            console.log(final);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsChat(true);
        setIsHome(false);
        await sendMessageToServer(val);
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                return;
            }
            e.preventDefault();
            handleSubmit(e);
        }
    }

    return (
        <div className={className}>
            <div className="tools">
                {handleArrowButton()}
                <Tool name="add_circle" infos="New chat"  />
                <Tool name="download" infos="Download" onClick={handleExportButton} />
            </div>
            <div className="chat-container">
                {isChat && (<div className="message-container">
                    <Message type="user" value={val}/>
                    <Message type="bot"/>
                </div>)}
                {isHome && (<div className="home">
                    <div className="logo">
                        <img src={Logo} alt="logo"/>
                    </div>
                    <div className="inputs">
                        <form onSubmit={handleSubmit} id="chat-form">
                            <div className="input-content">
                            <textarea
                                placeholder="Enter your text to be analyzed"
                                value={val}
                                onChange={handleChange}
                                rows="1"
                                ref={textAreaRef}
                                onKeyDown={handleKeyDown}
                            />
                                <button type="submit" form="chat-form">
                                    <span className="material-symbols-rounded">arrow_right_alt</span>
                                </button>
                            </div>
                        </form>
                        <p>This is a beta version. Results may be inaccurate.</p>
                    </div>
                </div>)}
            </div>
        </div>
    );
};


export default Chat