import 'animate.css'
const Modal = ({handleModal, modalOptions}) => {


    return (

        <div className="modal">
            <div className="modal-content small animate__animated animate__fadeInUp">
                <div className="modal-header ">
                    <h2>{modalOptions.title}</h2>
                    <button onClick={handleModal}>
                    <span className="material-symbols-rounded">
                        close
                    </span>
                    </button>
                </div>
                {modalOptions.title === 'Export' && (<div className="content">
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
                </div>)}
                {modalOptions.title === 'Chats deleted' && (<div className="content-deleted">
                    <div className="option-deleted">
                        <a href="">The RGU School of Computing is a great place to study. The staff are friendly, the
                            labs
                            are state-of-the-art, and the subjects are engaging. So, you will have an amazing time
                            during
                            your degree.
                        </a>
                        <button>
                            <span className="material-symbols-rounded">
                                restore_from_trash
                            </span>
                        </button>
                        <button>
                            <span className="material-symbols-rounded">
                                delete
                            </span>
                        </button>
                    </div>
                    <div className="option-deleted">
                        <a href="">The RGU School of Computing is a great place to study. The staff are friendly, the
                            labs
                            are state-of-the-art, and the subjects are engaging. So, you will have an amazing time
                            during
                            your degree.
                        </a>
                        <button>
                            <span className="material-symbols-rounded">
                                restore_from_trash
                            </span>
                        </button>
                        <button>
                            <span className="material-symbols-rounded">
                                delete
                            </span>
                        </button>
                    </div>
                    <div className="option-deleted">
                        <a href="">The RGU School of Computing is a great place to study. The staff are friendly, the
                            labs
                            are state-of-the-art, and the subjects are engaging. So, you will have an amazing time
                            during
                            your degree.
                        </a>
                        <button>
                            <span className="material-symbols-rounded">
                                restore_from_trash
                            </span>
                        </button>
                        <button>
                            <span className="material-symbols-rounded">
                                delete
                            </span>
                        </button>
                    </div>
                    <div className="option-deleted">
                        <a href="">The RGU School of Computing is a great place to study. The staff are friendly, the
                            labs
                            are state-of-the-art, and the subjects are engaging. So, you will have an amazing time
                            during
                            your degree.
                        </a>
                        <button>
                            <span className="material-symbols-rounded">
                                restore_from_trash
                            </span>
                        </button>
                        <button>
                            <span className="material-symbols-rounded">
                                delete
                            </span>
                        </button>
                    </div>
                    <div className="option-deleted">
                        <a href="">The RGU School of Computing is a great place to study. The staff are friendly, the
                            labs
                            are state-of-the-art, and the subjects are engaging. So, you will have an amazing time
                            during
                            your degree.
                        </a>
                        <button>
                            <span className="material-symbols-rounded">
                                restore_from_trash
                            </span>
                        </button>
                        <button>
                            <span className="material-symbols-rounded">
                                delete
                            </span>
                        </button>
                    </div>
                </div>)}

            </div>
        </div>

    )
}

export default Modal