
const Button = (props) => {

    return (
        <div className='btn' onClick={props.onClick}>
            <button disabled={props.disabled} type={props.type}>
                {props.name}
            </button>
        </div>
    )
}

export default Button