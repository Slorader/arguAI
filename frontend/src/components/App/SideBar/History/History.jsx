import './history.css';
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { auth } from "../../Firebase/firebase.jsx";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const History = ({ allChats }) => {
    const [todayChats, setTodayChats] = useState([]);
    const [yesterdayChats, setYesterdayChats] = useState([]);
    const [last7DaysChats, setLast7DaysChats] = useState([]);
    const navigate = useNavigate();

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    useEffect(() => {
        const fillHistory = () => {
            const todayChatsTemp = [];
            const yesterdayChatsTemp = [];
            const last7DaysChatsTemp = [];

            allChats.forEach(chat => {
                if (chat.bin) return;

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

            setTodayChats(todayChatsTemp);
            setYesterdayChats(yesterdayChatsTemp);
            setLast7DaysChats(last7DaysChatsTemp);
        };
        fillHistory();
    }, [allChats]);

    const addToBin = async (chat) => {
        try {
            await axios.post(`http://localhost:5000/api/chats/set_bin_attribute/${chat.id}`, null, {
                headers: { 'Content-Type': 'application/json' }
            });

            setTodayChats(todayChats.filter(c => c.id !== chat.id));
            setYesterdayChats(yesterdayChats.filter(c => c.id !== chat.id));
            setLast7DaysChats(last7DaysChats.filter(c => c.id !== chat.id));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const renderChats = (chats, title) => (
        <div className="time">
            <p>{title}</p>
            {chats
                .sort((a, b) => new Date(b.created) - new Date(a.created))
                .map(chat => (
                    <div className="text" key={chat.id}>
                        <a href="#" onClick={(e) => {
                            e.preventDefault();
                            navigate(`/chat/${chat.id}`);
                        }}>{chat.text}</a>
                        <button onClick={() => addToBin(chat)}>
                            <span className="material-symbols-rounded">delete</span>
                        </button>
                    </div>
                ))}
        </div>
    );

    return (
        <div className="history">
            {todayChats.length > 0 && renderChats(todayChats, "Today")}
            {yesterdayChats.length > 0 && renderChats(yesterdayChats, "Yesterday")}
            {last7DaysChats.length > 0 && renderChats(last7DaysChats, "Last 7 days")}
        </div>
    );
};

History.propTypes = {
    allChats: PropTypes.array.isRequired
};

export default History;
