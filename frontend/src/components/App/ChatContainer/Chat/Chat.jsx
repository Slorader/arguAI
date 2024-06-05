import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { auth } from "../../Firebase/firebase.jsx";
import Tool from "../../Home/NewChat/Tool/Tool.jsx";
import Message from "./Message/Message.jsx";
import drawGraph from './Graph/Graph.jsx';
import './Message/message.css';

const Chat = ({ handleSideBar, isSideBarOpen, className, handleModal, setModalOptions, userDetails }) => {
    const { chatId } = useParams();
    const navigate = useNavigate();
    const [chat, setChat] = useState(null);
    const [viewSchema, setViewSchema] = useState(false);
    const [analyse, setAnalyse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [chatResponse, analyseResponse] = await Promise.all([
                    axios.get(`http://127.0.0.1:5000/api/chats/${chatId}`),
                    axios.get(`http://127.0.0.1:5000/api/analyses/get/${chatId}`)
                ]);

                if (auth.currentUser.uid !== chatResponse.data.chat.user_uid) {
                    navigate('/chat');
                } else {
                    setChat(chatResponse.data.chat.text);
                    setAnalyse(analyseResponse.data);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [chatId, navigate]);

    useEffect(() => {
        if (analyse) {
            drawGraph(analyse);
        }
    }, [analyse, viewSchema]);

    const handleViews = () => {
        setViewSchema(!viewSchema);
    };

    const handleArrowButton = () => (
        <Tool
            name={isSideBarOpen ? "arrow_back_ios" : "arrow_forward_ios"}
            infos={isSideBarOpen ? "Close" : "Open"}
            onClick={handleSideBar}
        />
    );

    const handleExportButton = () => {
        setModalOptions({ title: 'Export', size: 'small' });
        handleModal();
    };

    const redirect = () => {
        navigate('/chat');
    };

    return (
        <div className={`${className} ${viewSchema ? 'view-schema' : ''}`}>
            <div className="tools">
                {handleArrowButton()}
                <Tool name="add_circle" infos="New chat" onClick={redirect} />
                <Tool name="download" disabled={disabled} infos="Download" onClick={handleExportButton} />
                <div onClick={handleViews} className={disabled ? "mode-choice disabled" : "mode-choice"}>
                    <span className={`material-symbols-rounded ${!viewSchema ? 'left-select' : ''}`}>
                        sms
                    </span>
                    <span className={`material-symbols-rounded ${viewSchema ? 'right-select' : ''}`}>
                        timeline
                    </span>
                </div>
            </div>
            {!viewSchema && (
                <div className="chat-container">
                    <div className="message-container">
                        <Message type="user" value={chat} />
                        <Message type="bot" loading={loading} setDisabled={setDisabled} chatId={chatId} analyse={analyse} />
                    </div>
                </div>
            )}
            {viewSchema && <div className="schema-container" id="schema-container"></div>}
        </div>
    );
};

export default Chat;
