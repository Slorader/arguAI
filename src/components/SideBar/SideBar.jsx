import Logo from '../../../public/images/AR_white.png'
import History from './History/History.jsx'
const SideBar = () =>
{
    return (

        <div className="sideBar">
            <div className="logo">
                <img src={Logo} alt="logo"/>
            </div>
            <History/>
            <div className="settings">
                <span className="user-icon">LT</span>
                <p>Léo Trux</p>
                <span  className="material-symbols-rounded">
                    expand_all
                </span>

            </div>
        </div>


    )
}

export default SideBar;