import Tool from "../../Home/NewChat/Tool/Tool.jsx";
import Logo from '../../../../public/images/AR_white.png'
import Message from "../../Home/NewChat/Message/Message.jsx";
import '../../Home/NewChat/Message/message.css'

import {useRef, useState, useEffect} from "react";
import { auth } from "../../Firebase/firebase.jsx";
import {Navigate, useNavigate} from 'react-router-dom';

const NewChat = ({ handleSideBar, isSideBarOpen, className, handleModal, setModalOptions}) => {


    const handleArrowButton = () => {
        if (isSideBarOpen) {
            return <Tool name="arrow_back_ios" infos="Close" onClick={handleSideBar} />;
        }
        return <Tool name="arrow_forward_ios" infos="Open" onClick={handleSideBar} />;
    };

    const [isChat, setIsChat] = useState(false);


    const handleExportButton = () => {
        setModalOptions({title : 'Export', size: 'small'});
        handleModal();
    };


    return (
        <div className={className}>
            <div className="tools">
                {handleArrowButton()}
                <Tool name="add_circle" infos="New chat"  />
                <Tool name="download" infos="Download" onClick={handleExportButton} />
            </div>
            <div className="chat-container">
                <div className="message-container">
                    <Message type="user" value="coucou"/>
                    <Message type="bot"/>
                </div>
            </div>
        </div>
    );
};


export default NewChat