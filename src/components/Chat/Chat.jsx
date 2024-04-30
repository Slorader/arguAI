import Tool from "./Tool/Tool.jsx";

const Chat = ({handleSideBar, isSideBarOpen}) =>
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

        <div className="chat">
            <div className="tools">
                {handleArrowButton()}
                <Tool name="add_circle" infos="New chat"/>
                <Tool name="download" infos="Download"/>
            </div>

        </div>
    )
}

export default Chat