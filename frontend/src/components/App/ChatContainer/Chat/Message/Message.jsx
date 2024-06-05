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

const Message = ({ type, value, chatId, analyse, loading, setDisabled }) => {
    const [text, setText] = useState("");
    const paragraphRef = useRef(null);
    const loadingRef = useRef(null);

    useEffect(() => {
        if (type === "bot" && chatId && analyse) {
            const animationPlayed = localStorage.getItem(`animationPlayed_${chatId}`);
            if (animationPlayed) {
                displayFullText();
                setDisabled();
            } else if (!loading) {
                loadingRef.current.style.display = "none";
                paragraphRef.current.style.display = "block";
                animateText();
            }
        }
    }, [type, chatId, analyse, loading]);

    const displayFullText = () => {
        setText(formatFullText(analyse));
        loadingRef.current.style.display = "none";
        paragraphRef.current.style.display = "block";
    };

    const formatFullText = (analyse) => {
        let fullText = "Here is your argument analysis:\n\n";

        const nodesDict = analyse.nodes.reduce((acc, node) => {
            acc[node.text] = node;
            return acc;
        }, {});

        const sourceToTargets = analyse.edges.reduce((acc, edge) => {
            if (!acc[edge.text_source_id]) {
                acc[edge.text_source_id] = [];
            }
            acc[edge.text_source_id].push(edge.text_target_id);
            return acc;
        }, {});

        const nodesWithRelations = new Set();

        for (const source in sourceToTargets) {
            const sourceNode = nodesDict[source];
            if (sourceNode) {
                nodesWithRelations.add(sourceNode.text);
                fullText += `Source: ${sourceNode.text}\n`;
                fullText += `Type: ${sourceNode.type}\n\n`;

                sourceToTargets[source].forEach(target => {
                    const targetNode = nodesDict[target];
                    if (targetNode) {
                        nodesWithRelations.add(targetNode.text);
                        fullText += `Target: ${targetNode.text}\n`;
                        fullText += `Type: ${targetNode.type}\n\n`;
                    }
                });

                fullText += '---\n\n';
            }
        }

        analyse.nodes.forEach(node => {
            if (!nodesWithRelations.has(node.text)) {
                fullText += `Node: ${node.text}\n`;
                fullText += `Type: ${node.type}\n\n`;
                fullText += '---\n\n';
            }
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
                setDisabled();
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
