

const Button = (props) => {

    return (
        <div className='btn'>
            <button type={props.type}>
                {props.name}
            </button>
        </div>
    )
}

export default Button