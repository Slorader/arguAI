import '../../app.css'
import SideBar from '../SideBar/SideBar.jsx'
import '../SideBar/sideBar.css'
import Chat from "../Chat/Chat.jsx";
import '../Chat/chat.css'
import Modal from "../Modal/Modal.jsx";
import '../Modal/modal.css'
import {useState} from "react";

const Home = () => {

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

export default Home