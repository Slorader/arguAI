import './app.css'
import SideBar from './components/SideBar/SideBar.jsx'
import './components/SideBar/sideBar.css'
import Chat from './components/Chat/Chat.jsx'
import './components/Chat/chat.css'
import Modal from './components/Modal/Modal.jsx'
import './components/Modal/modal.css'
import {useState} from "react";


function App() {
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);

    const handleSideBar = () => {
        setIsSideBarOpen(!isSideBarOpen);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const sidebarClass = `sideBar ${isSideBarOpen ? '' : 'sideBar-closed '}`;
    const chatClass = `chat ${isSideBarOpen ? '' : 'chat-fullscreen '}`;

    const handleModal = () => {
        setIsModalOpen(!isModalOpen);
    }


    return (
        <>
            <SideBar  className={sidebarClass} />
            <Chat handleSideBar={handleSideBar} isSideBarOpen={isSideBarOpen} handleModal = {handleModal} className={chatClass} />
            {isModalOpen && <Modal handleModal = {handleModal}/>}
        </>
    );
}


export default App
