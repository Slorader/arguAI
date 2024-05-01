import 'animate.css'
const Modal = ({handleModal}) => {


    return (

        <div className="modal" onClick={handleModal}>
            <div className="modal-content animate__animated animate__fadeInUp">
                <div className="modal-header">
                    <h2>Export</h2>
                    <button onClick={handleModal}>
                    <span className="material-symbols-rounded">
                        close
                    </span>
                    </button>
                </div>
                <div className="content">
                    <div className="option">
                        <p>Export as JSON</p>
                        <span className="material-symbols-rounded">
                            description
                        </span>
                    </div>
                    <div className="option">
                        <p>Export as PNG</p>
                        <span className="material-symbols-rounded">
                            add_photo_alternate
                        </span>
                    </div>
                </div>

            </div>

        </div>


    )
}

export default Modal