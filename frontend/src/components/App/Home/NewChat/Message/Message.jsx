import React, { useState, useEffect, useRef } from "react";
import BotLogo from "../../../../../../public/images/AR_notext_white.png";
import axios from "axios";

const TextWithLineBreaks = ({ text }) => {
    return text.split('\n').map((str, index) => (
        <React.Fragment key={index}>
            {str}
            <br />
        </React.Fragment>
    ));
};

const Message = ({ type, value, chatId }) => {
    const [text, setText] = useState("");
    const paragraphRef = useRef(null);
    const loading = useRef(true);
    const [analyse, setAnalyse] = useState(null);

    useEffect(() => {
        if (type === "bot" && chatId) {
            setTimeout(() => {
                loading.current.style.display = "none";
                paragraphRef.current.style.display = "block";
                getAnalyse();
            }, 3000);
        }
    }, [type, chatId]);

    useEffect(() => {
        if (analyse) {
            animateText();
        }
    }, [analyse]);

    const getAnalyse = async (shouldAnimate = true) => {
        if (chatId) {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/api/analyses/get/${chatId}`);
                console.log(response.data);
                setAnalyse(response.data);
                if (!shouldAnimate) {
                    setText(formatFullText(response.data));
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données de l'analyse:", error);
            }
        }
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
                        <div ref={loading} className="loading"></div>
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
