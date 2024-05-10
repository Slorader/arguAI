import './history.css';
import PropTypes from 'prop-types';
import {useEffect, useRef, useState} from "react";

const History = ({ allChats }) => {
    const [todayChats, setTodayChats] = useState([]);
    const [yesterdayChats, setYesterdayChats] = useState([]);
    const [last7DaysChats, setLast7DaysChats] = useState([]);

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
                    todayChatsTemp.unshift(chat);
                } else if (chatDateString === yesterdayString) {
                    yesterdayChatsTemp.unshift(chat);
                } else {
                    last7DaysChatsTemp.unshift(chat);
                }
            });

            setTodayChats(todayChatsTemp);
            setYesterdayChats(yesterdayChatsTemp);
            setLast7DaysChats(last7DaysChatsTemp);
            animateText();
        }
        fillHistory();
    }, [allChats]);

    const [text, setText] = useState("");
    const paragraphRef = useRef(null);



    const animateText = () => {
        const fullText = "Bonjour à tous";

        let index = 0;

        const intervalId = setInterval(() => {
            setText(fullText.substring(0, index));
            index++;
            if (index > fullText.length) {
                clearInterval(intervalId);
            }
        }, 100);
    };


    return (
        <div className="history">
            <div className="time">
                <p>Today</p>
                    <div className="text new-text" >
                        <a ref={paragraphRef} href="">{text}</a>
                        <button>
                            <span className="material-symbols-rounded">delete</span>
                        </button>
                    </div>
            </div>

            <div className="time">
                <p>Yesterday</p>
                {yesterdayChats.map(chat => (
                    <div className="text" key={chat.id}>
                        <a href={`/chat/${chat.id}`}>{chat.text}</a>
                        <button>
                            <span className="material-symbols-rounded">delete</span>
                        </button>
                    </div>
                ))}
            </div>

            <div className="time">
                <p>Last 7 days</p>
                {last7DaysChats.map(chat => (
                    <div className="text" key={chat.id}>
                        <a href={`/chat/${chat.id}`}>{chat.text}</a>
                        <button>
                            <span className="material-symbols-rounded">delete</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default History;
