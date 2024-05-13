import './history.css';
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";

const History = ({ allChats }) => {
    const [todayChats, setTodayChats] = useState([]);
    const [yesterdayChats, setYesterdayChats] = useState([]);
    const [last7DaysChats, setLast7DaysChats] = useState([]);
    const [newChat, setNewChat] = useState(null);
    const [allChatsLast, setAllChatsLast] = useState([]);

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    useEffect(() => {
        const fillHistory = () => {
            const todayChatsTemp = [];
            const yesterdayChatsTemp = [];
            const last7DaysChatsTemp = [];

            allChats.forEach(chat => {
                const chatDate = new Date(chat.created);
                const chatDateString = chatDate.toDateString();
                const todayString = today.toDateString();
                const yesterdayString = yesterday.toDateString();

                if (chatDateString === todayString) {
                    todayChatsTemp.push(chat);
                } else if (chatDateString === yesterdayString) {
                    yesterdayChatsTemp.push(chat);
                } else {
                    last7DaysChatsTemp.push(chat);
                }
            });

            setAllChatsLast(allChats);
            const tempNewChat = allChats.find(chat => !allChatsLast.some(oldChat => oldChat.id === chat.id));
            setNewChat(tempNewChat);
            console.log(newChat);

            setTodayChats(todayChatsTemp);
            setYesterdayChats(yesterdayChatsTemp);
            setLast7DaysChats(last7DaysChatsTemp);
        }
        fillHistory();
    }, [allChats, allChatsLast]);

    useEffect(() => {
        if (newChat) {
            animateText(newChat.text);
        }
    }, [newChat]);

    const animateText = (text) => {
        const link = document.querySelector('.new-chat a');
        if (!link) return;
        const fullText = text;
        let index = 0;

        link.textContent = '';

        const intervalId = setInterval(() => {
            link.textContent += fullText[index];
            index++;
            if (index >= fullText.length) {
                clearInterval(intervalId);
            }
        }, 30);
    };

    return (
        <div className="history">
            {todayChats.length > 0 && (
                <div className="time">
                    <p>Today</p>
                    {todayChats.sort((a, b) => new Date(b.created) - new Date(a.created)).map(chat => (
                        <div className={`text ${chat.id === newChat?.id ? 'new-chat' : ''}`} key={chat.id}>
                            <a href={`/chat/${chat.id}`}>{chat.text}</a>
                            <button>
                                <span className="material-symbols-rounded">delete</span>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {yesterdayChats.length > 0 && (
                <div className="time">
                    <p>Yesterday</p>
                    {yesterdayChats.sort((a, b) => new Date(b.created) - new Date(a.created)).map(chat => (
                        <div className="text" key={chat.id}>
                            <a href={`/chat/${chat.id}`}>{chat.text}</a>
                            <button>
                                <span className="material-symbols-rounded">delete</span>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {last7DaysChats.length > 0 && (
                <div className="time">
                    <p>Last 7 days</p>
                    {last7DaysChats.sort((a, b) => new Date(b.created) - new Date(a.created)).map(chat => (
                        <div className="text" key={chat.id}>
                            <a href={`/chat/${chat.id}`}>{chat.text}</a>
                            <button>
                                <span className="material-symbols-rounded">delete</span>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
