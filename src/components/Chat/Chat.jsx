import Tool from "./Tool/Tool.jsx";
import Logo from '../../../public/images/AR_notext_white.png'

const Chat = ({handleSideBar, isSideBarOpen, className}) =>
{
    const handleArrowButton = () => {
        if (isSideBarOpen) {
            return (
                <Tool name="arrow_back_ios" infos="Close" onClick={handleSideBar} />
            );
        }
        return (
            <Tool name="arrow_forward_ios" infos="Open" onClick={handleSideBar} />
        );
    };
    return (

        <div className={className}>
            <div className="tools">
                {handleArrowButton()}
                <Tool name="add_circle" infos="New chat"/>
                <Tool name="download" infos="Download"/>
            </div>
            <div className="chat-container">
                <div className="logo">
                    <img src={Logo} alt="logo"/>
                </div>
                <div className="inputs">
                    <div className="input-content">
                        <textarea placeholder="Enter your text to be analyzed"/>
                        <button type='submit'>
                        <span className="material-symbols-rounded">
                            arrow_right_alt
                        </span>
                        </button>
                    </div>
                    <p>This is a beta version. Results may be inaccurate</p>
                </div>
            </div>

        </div>
    )
}

export default Chat