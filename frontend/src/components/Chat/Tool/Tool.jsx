import 'animate.css';


const Tool = ({name, infos, onClick}) =>
{

    return (
        <>
            <div className="tool">
                <button onClick={onClick}>
                    <span className="material-symbols-rounded">
                        {name}
                    </span>
                </button>
                <div className="tool-info animate__animated animate__fadeIn">
                    <span>{infos}</span>
                </div>

            </div>
        </>


    )
}

export default Tool