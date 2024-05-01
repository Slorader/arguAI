import Tool from "./Tool/Tool.jsx";
import Logo from '../../../public/images/AR_notext_white.png'
import {useRef, useState, useEffect} from "react";

const Chat = ({ handleSideBar, isSideBarOpen, className, handleModal }) => {
    const handleArrowButton = () => {
        if (isSideBarOpen) {
            return <Tool name="arrow_back_ios" infos="Close" onClick={handleSideBar} />;
        }
        return <Tool name="arrow_forward_ios" infos="Open" onClick={handleSideBar} />;
    };

    const textAreaRef = useRef(null)
    const [val, setVal] = useState("");
    const handleChange = (e) => {
        setVal(e.target.value);
    }

    useEffect( () =>{

            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
            }, [val])

    return (
        <div className={className}>
            <div className="tools">
                {handleArrowButton()}
                <Tool name="add_circle" infos="New chat"  />
                <Tool name="download" infos="Download" onClick={handleModal} />
            </div>
            <div className="chat-container">
                <div className="logo">
                    <img src={Logo} alt="logo" />
                </div>
                <div className="inputs">
                    <div className="input-content">
            <textarea
                placeholder="Enter your text to be analyzed"
                value={val}
                onChange={handleChange}
                rows="1"
                ref={textAreaRef}
            />
                        <button type="submit">
                            <span className="material-symbols-rounded">arrow_right_alt</span>
                        </button>
                    </div>
                    <p>This is a beta version. Results may be inaccurate</p>
                </div>
            </div>
        </div>
    );
};


export default Chat