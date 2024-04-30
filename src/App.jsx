import './app.css'
import SideBar from './components/SideBar/SideBar.jsx'
import './components/SideBar/sideBar.css'
import Chat from './components/Chat/Chat.jsx'
import './components/Chat/chat.css'
import {useState} from "react";


function App() {
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);

    const handleSideBar = () => {
        setIsSideBarOpen(!isSideBarOpen);
    };

    const sidebarClass = `sideBar ${isSideBarOpen ? '' : 'sideBar-closed '}`;
    const chatClass = `chat ${isSideBarOpen ? '' : 'chat-fullscreen '}`;


    return (
        <>
            <SideBar  className={sidebarClass} />
            <Chat handleSideBar={handleSideBar} isSideBarOpen={isSideBarOpen} className={chatClass} />
        </>
    );
}


export default App
