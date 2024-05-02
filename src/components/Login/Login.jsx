import "../Login/login.css"
import Logo from '../../../public/images/AR_white.png'
import Input from "../Input/Input.jsx";
import "../Input/input.css"
import Button from "../Button/Button.jsx";
import "../Button/buttons.css"

const Login = () => {

    return(
        <div className="login">
            <div className="login-logo">
                <img src={Logo} alt="logo"/>
            </div>
            <div className="login-container">
                <div className="infos">
                    <div className="title">
                        <span>Start on Argu </span>
                        <span className="colored">AI</span>
                    </div>
                    <p>"Lorem" is typically the beginning of a placeholder text known as "Lorem  Ipsum." This text is used in the publishing and typesetting industry to  demonstrate the visual appearance of a document or website without  relying on meaningful content. Lorem Ipsum has been the industry's  standard dummy text ever since the 1500s.
                    </p>
                </div>
                <div className="login-form">
                    <div className="title">
                        <span>Log </span>
                        <span className="colored">in</span>
                    </div>
                    <div className="register">
                        <span>You do not have an account ? Register </span>
                        <a href="/register">here</a>
                    </div>
                    <div className="form">
                        <Input typeInput="email" nameInput="Email" idInput="login-email"></Input>
                        <Input typeInput="password" nameInput="Password" idInput="password-email"></Input>
                        <Button name="Log in"></Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login