import Logo from '../../../public/images/AR_white.png'
import History from './History/History.jsx'
import {useState} from "react";
import 'animate.css';

const SideBar = ({className}) =>
{
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleSettingsClick = () => {
        setIsModalOpen(!isModalOpen);
    }

    return (

        <div className={className}>
            <div className="logo">
                <img src={Logo} alt="logo"/>
            </div>
            <History/>
            <div className="settings" onClick={handleSettingsClick}>
                <div className="user-icon"><span>LT</span></div>
                <p>Léo Trux</p>
                <span  className="material-symbols-rounded">
                    expand_all
                </span>
            </div>
            {isModalOpen && (<div className="modal-settings animate__animated animate__fadeIn">
                <div className="user-infos">
                    <span>Léo Trux</span>
                    <p>truxleo@gmail.com</p>
                </div>
                <div className="settings-line">
                    <a>Chats deleted</a>
                    <span className="material-symbols-rounded">
                        delete
                    </span>
                </div>
                <div className="settings-line">
                    <a>Profile</a>
                    <span className="material-symbols-rounded">
                        account_circle
                    </span>
                </div>
                <div className="settings-line">
                    <a>Help</a>
                    <span className="material-symbols-rounded">
                        indeterminate_question_box
                    </span>
                </div>
                <div className="settings-line">
                    <a>Logout</a>
                    <span className="material-symbols-rounded">
                        logout
                    </span>
                </div>

            </div>)}
        </div>


    )
}

export default SideBar;