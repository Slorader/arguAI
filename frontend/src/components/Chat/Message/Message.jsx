import React, { useState, useEffect, useRef } from "react";
import BotLogo from "../../../../public/images/AR_notext_white.png";

const Message = ({ type, value }) => {
    const [text, setText] = useState("");
    const paragraphRef = useRef(null);
    const loading = useRef(true);

    useEffect(() => {
        if (type === "bot") {
            setTimeout(() => {
                loading.current.style.display = "none";
                paragraphRef.current.style.display = "block";
                animateText();
            }, 3000);
        }
    }, [type]);

    const animateText = () => {
        const fullText = `After an argument analysis, here are your results :

    1 sub-conclusion : “Fall is the best time to visit America’s great cities, beaches, and mountains”
    3 premises : “The foliage is breath-taking” , “the weather is cooler”, “the crowds are gone”
    1 conclusion : “you can really relax and enjoy yourself”

    Here is your diagram :`;

        let index = 0;

        const intervalId = setInterval(() => {
            setText(fullText.substring(0, index));
            index++;
            if (index > fullText.length) {
                clearInterval(intervalId);
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
                        <p>
                            {value}
                        </p>
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
                            {text}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default Message;
