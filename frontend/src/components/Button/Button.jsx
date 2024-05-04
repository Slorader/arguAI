

const Button = (props) => {

    return (
        <div className='btn' onClick={props.onclick}>
            <button type={props.type}>
                {props.name}
            </button>
        </div>
    )
}

export default Button