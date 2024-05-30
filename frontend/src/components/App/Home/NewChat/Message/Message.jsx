import React, { useState, useEffect, useRef } from "react";
import BotLogo from "../../../../../../public/images/AR_notext_white.png";

const TextWithLineBreaks = ({ text }) => {
    return text.split('\n').map((str, index) => (
        <React.Fragment key={index}>
            {str}
            <br />
        </React.Fragment>
    ));
};

const Message = ({ type, value, chatId, analyse }) => {
    const [text, setText] = useState("");
    const paragraphRef = useRef(null);
    const loadingRef = useRef(null);


    useEffect(() => {
        if (type === "bot" && chatId && analyse) {
            const animationPlayed = localStorage.getItem(`animationPlayed_${chatId}`);
            if (animationPlayed) {
                displayFullText();
            } else {
                setTimeout(() => {
                    loadingRef.current.style.display = "none";
                    paragraphRef.current.style.display = "block";
                    animateText();
                }, 3000);
            }
        }
    }, [type, chatId, analyse]);

    const displayFullText = () => {
        setText(formatFullText(analyse));
        loadingRef.current.style.display = "none";
        paragraphRef.current.style.display = "block";
    };

    const formatFullText = (analyse) => {
        let fullText = "Here is your argument analysis:\n\n";
        analyse.nodes.forEach((node) => {
            fullText += `${node.text}\n`;
            fullText += `Type: ${node.type}\n\n`;
        });
        return fullText;
    };

    const animateText = () => {
        let fullText = formatFullText(analyse);
        let index = 0;

        const intervalId = setInterval(() => {
            setText(fullText.substring(0, index));
            index++;
            if (index > fullText.length) {
                clearInterval(intervalId);
                localStorage.setItem(`animationPlayed_${chatId}`, 'true');
            }
        }, 10);
    };

    return (
        <>
            {type === "user" && (
                <div className="message">
                    <div className="avatar">
                        <span>LT</span>
                    </div>
                    <div className="user-message">
                        <p>{value}</p>
                    </div>
                </div>
            )}
            {type === "bot" && (
                <div className="message">
                    <div className="avatar">
                        <img src={BotLogo} alt="bot-logo" />
                    </div>
                    <div className="bot-message">
                        <div ref={loadingRef} className="loading"></div>
                        <p ref={paragraphRef} style={{ display: "none" }}>
                            <TextWithLineBreaks text={text} />
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default Message;
