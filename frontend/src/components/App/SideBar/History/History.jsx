import './history.css';
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import login from "../../Auth/Login/Login.jsx";
import {auth} from "../../Firebase/firebase.jsx";
import axios from "axios";

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
                    if (!chat.bin) {
                        todayChatsTemp.push(chat);
                    }
                } else if (chatDateString === yesterdayString) {
                    if (!chat.bin) {
                        yesterdayChatsTemp.push(chat);
                    }
                } else {
                    if (!chat.bin) {
                        last7DaysChatsTemp.push(chat);
                    }
                }
            });

            setTodayChats(todayChatsTemp);
            setYesterdayChats(yesterdayChatsTemp);
            setLast7DaysChats(last7DaysChatsTemp);
        };
        fillHistory();
    }, [allChats]);


    const addToBin = async (chat) => {
        try {
            const response = await axios.post(`http://localhost:5000/api/chats/set_bin_attribute/${chat.id}`, null, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setTodayChats(todayChats.filter(c => c.id !== chat.id));
            setYesterdayChats(yesterdayChats.filter(c => c.id !== chat.id));
            setLast7DaysChats(last7DaysChats.filter(c => c.id !== chat.id));
            console.log(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="history">
            {todayChats.length > 0 && (
                <div className="time">
                    <p>Today</p>
                    {todayChats
                        .sort((a, b) => new Date(b.created) - new Date(a.created))
                        .map(chat => (
                            <div className={'text'} key={chat.id}>
                                <a href={`/chat/${chat.id}`}>{chat.text}</a>
                                <button onClick={() => addToBin(chat)}>
                                    <span className="material-symbols-rounded">delete</span>
                                </button>
                            </div>
                        ))}
                </div>
            )}

            {yesterdayChats.length > 0 && (
                <div className="time">
                    <p>Yesterday</p>
                    {yesterdayChats
                        .sort((a, b) => new Date(b.created) - new Date(a.created))
                        .map(chat => (
                            <div className={'text'} key={chat.id}>
                                <a href={`/chat/${chat.id}`}>{chat.text}</a>
                                <button onClick={() => addToBin(chat)}>
                                    <span className="material-symbols-rounded">delete</span>
                                </button>
                            </div>
                        ))}
                </div>
            )}

            {last7DaysChats.length > 0 && (
                <div className="time">
                    <p>Last 7 days</p>
                    {last7DaysChats
                        .sort((a, b) => new Date(b.created) - new Date(a.created))
                        .map(chat => (
                            <div className={'text'} key={chat.id}>
                                <a href={`/chat/${chat.id}`}>{chat.text}</a>
                                <button onClick={() => addToBin(chat)}>
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