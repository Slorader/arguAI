import Tool from "./Tool/Tool.jsx";
import Logo from '../../../../../public/images/AR_notext_white.png'
import {useRef, useState, useEffect} from "react";
import { auth } from "../../Firebase/firebase.jsx";
import {useNavigate} from 'react-router-dom';

const NewChat = ({ handleSideBar, isSideBarOpen, className, handleModal, setModalOptions, notifyNewChat}) => {

    const textAreaRef = useRef(null)
    const [val, setVal] = useState("");
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const navigate = useNavigate();

    const handleArrowButton = () => {
        if (isSideBarOpen) {
            return <Tool name="arrow_back_ios" infos="Close" onClick={handleSideBar} />;
        }
        return <Tool name="arrow_forward_ios" infos="Open" onClick={handleSideBar} />;
    };


    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);


    const handleChange = (e) => {
        setVal(e.target.value);
    }

    useEffect( () =>{

            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
            }
            , [val])



    const handleExportButton = () => {
        setModalOptions({title : 'Export', size: 'small'});
        handleModal();
    };

    function removeSpaceEnd(text) {
        return text.replace(/[\s\n]+$/, '');
    }

    const sendMessageToServer = async () => {
        const currentDateTime = new Date().toISOString();
        const data = {
            text: removeSpaceEnd(val),
            user_uid: auth.currentUser.uid,
            created: currentDateTime,
            modified: currentDateTime,
            bin: false,
        };

        try {
            const analysisResponse = await fetch('http://localhost:5000/api/analyses/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: val })
            });

            if (!analysisResponse.ok) {
                throw new Error('Failed to send message to server');
            }

            const analysisData = await analysisResponse.json();
            console.log('Response from server:', analysisData);

            const chatResponse = await fetch('http://localhost:5000/api/chats/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: data })
            });

            if (!chatResponse.ok) {
                throw new Error('Failed to save chat in database');
            }

            const chatResult = await chatResponse.json();
            const chat_id = chatResult.docRef_id;
            notifyNewChat();

            const analysisSaveResponse = await fetch(`http://localhost:5000/api/analyses/add/${chat_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(analysisData)
            });

            if (!analysisSaveResponse.ok) {
                throw new Error('Failed to save analysis in database');
            }

            navigate(`/chat/${chat_id}`);
        } catch (error) {
            console.error('Error:', error);
        }

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                <Tool name="add_circle" infos="New chat" disabled={true} />
                <Tool name="download" infos="Download" disabled={true} onClick={handleExportButton} />
            </div>
            <div className="chat-container">

                <div className="home">
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
                </div>
            </div>
        </div>
    );
};


export default NewChat