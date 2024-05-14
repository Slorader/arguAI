import Tool from "../../Home/NewChat/Tool/Tool.jsx";
import Logo from '../../../../../public/images/AR_white.png'
import Message from "../../Home/NewChat/Message/Message.jsx";
import '../../Home/NewChat/Message/message.css'

import {useRef, useState, useEffect} from "react";
import {auth, db} from "../../Firebase/firebase.jsx";
import {Navigate, useNavigate, useParams} from 'react-router-dom';
import {doc, getDoc} from "firebase/firestore";
import axios from "axios";

const Chat = ({ handleSideBar, isSideBarOpen, className, handleModal, setModalOptions}) => {
    const { chatId } = useParams();
    const [chat, setChat] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchChatData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/api/chats/${chatId}`);
                setChat(response.data.chat.text);
            } catch (error) {
                console.error("Erreur lors de la récupération des données du chat:", error);
            }
        };

        fetchChatData();
    }, [chatId]);



    const handleArrowButton = () => {
        if (isSideBarOpen) {
            return <Tool name="arrow_back_ios" infos="Close" onClick={handleSideBar} />;
        }
        return <Tool name="arrow_forward_ios" infos="Open" onClick={handleSideBar} />;
    };

    const handleExportButton = () => {
        setModalOptions({title : 'Export', size: 'small'});
        handleModal();
    };

    const redirect = () => {
        navigate('/chat');
    }


    return (
        <div className={className}>
            <div className="tools">
                {handleArrowButton()}
                <Tool name="add_circle" infos="New chat" onClick={redirect}  />
                <Tool name="download" infos="Download" onClick={handleExportButton} />
            </div>
            <div className="chat-container">
                <div className="message-container">
                    <Message type="user" value={chat}/>
                    <Message type="bot"/>
                </div>
            </div>
        </div>
    );
};


export default Chat