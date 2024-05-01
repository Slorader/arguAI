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

    const sidebarClass = `sideBar ${isSideBarOpen ? '' : 'sideBar-closed '}`;
    const chatClass = `chat ${isSideBarOpen ? '' : 'chat-fullscreen '}`;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalOptions, setModalOptions] = useState([]);


    const handleModal = () => {
        setIsModalOpen(!isModalOpen);
    }


    return (
        <>
            <SideBar  className={sidebarClass}
                      handleModal = {handleModal}
                      setModalOptions = {setModalOptions}

            />
            <Chat handleSideBar={handleSideBar}
                  isSideBarOpen={isSideBarOpen}
                  handleModal = {handleModal}
                  className={chatClass}
                  setModalOptions = {setModalOptions}

            />
            {isModalOpen && <Modal handleModal = {handleModal} modalOptions = {modalOptions} />}
        </>
    );
}


export default App
