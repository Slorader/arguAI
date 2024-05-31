import Tool from "../../Home/NewChat/Tool/Tool.jsx";
import Logo from '../../../../../public/images/AR_white.png'
import Message from "../../Home/NewChat/Message/Message.jsx";
import '../../Home/NewChat/Message/message.css'
import drawGraph from './Graph/Graph.jsx';
import {auth, db} from "../../Firebase/firebase.jsx";
import {Navigate, useNavigate, useParams} from 'react-router-dom';
import {doc, getDoc} from "firebase/firestore";
import axios from "axios";
import {useEffect, useState} from "react";

const Chat = ({ handleSideBar, isSideBarOpen, className, handleModal, setModalOptions, userDetails}) => {
    const { chatId } = useParams();
    const [chat, setChat] = useState(null);
    const navigate = useNavigate();
    const [viewSchema, setViewSchema] = useState(false);
    const [analyse, setAnalyse] = useState(null);

    useEffect(() => {
        const fetchChatData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/api/chats/${chatId}`);
                if(auth.currentUser.uid !== response.data.chat.user_uid)
                {
                    navigate('/chat');
                }else {
                    setChat(response.data.chat.text);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données du chat:", error);
            }
        };

        const fetchAnalyseData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/api/analyses/get/${chatId}`);
                setAnalyse(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des données de l'analyse:", error);
            }
        };

        fetchChatData();
        fetchAnalyseData();
    }, [chatId]);



    useEffect(() => {
        if(analyse)
        {
            drawGraph(analyse);
        }
    }, [analyse, viewSchema]);

    const handleViews = () => {
        setViewSchema(!viewSchema);
    }

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
        <div className={`${className} ${viewSchema ? 'view-schema' : ''}`}>
            <div className="tools">
                {handleArrowButton()}
                <Tool name="add_circle" infos="New chat" onClick={redirect}  />
                <Tool name="download" infos="Download" onClick={handleExportButton} />
                <div onClick={handleViews} className="mode-choice">
                    <span className={`material-symbols-rounded ${!viewSchema ? 'left-select' : ''}`}>
                        sms
                    </span>
                    <span className={`material-symbols-rounded ${viewSchema ? 'right-select' : ''}`}>
                        timeline
                    </span>

                </div>
            </div>
            {!viewSchema && (<div className="chat-container">
                <div className="message-container">
                    <Message type="user" value={chat}/>
                    <Message type="bot" chatId={chatId} analyse={analyse}/>
                </div>
            </div>)}
            {viewSchema && (<div className="schema-container">
            </div>)}
        </div>
    );
};


export default Chat