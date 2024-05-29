import 'animate.css';

const Tool = ({name, infos, onClick, disabled}) =>
{

    return (
        <>
            <div className={`tool ${disabled ? 'disabled' : ''}`}>
                <button disabled={disabled} onClick={onClick}>
                    <span className={`material-symbols-rounded ${disabled ? 'disabled' : ''}`}>
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