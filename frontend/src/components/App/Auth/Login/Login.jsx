import "./login.css"
import Logo from '../../../../../public/images/AR_white.png'
import Google from '../../../../../public/images/google.png'
import Input from "../../Form/Input/Input.jsx";
import "../../Form/Input/input.css"
import Button from "../../Form/Button/Button.jsx";
import "../../Form/Button/buttons.css"
import {useState} from "react";
import { signInWithEmailAndPassword } from "firebase/auth"
import {auth, db} from "../../Firebase/firebase.jsx"
import {toast} from "react-toastify";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {doc, getDoc, setDoc} from "firebase/firestore";
import { useNavigate } from "react-router-dom";


const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassord] = useState('');
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userDocRef = doc(db, "Users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
                await setDoc(userDocRef, {
                    uid: user.uid,
                    firstName: user.displayName.split(' ')[0],
                    lastName: user.displayName.split(' ')[1],
                    email: user.email,
                });
            }

            navigate("/chat");
            toast.success("User logged in successfully with Google!", { position: "top-right" });
        } catch (error) {
            console.error(error.message);
            toast.error("Incorrect email or password.", { position: "top-right" });
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/chat");
            toast.success("User logged successfully !", {
                position : "top-right",
            });
        } catch (error) {
            console.log(error.message);
            toast.error("Incorrect email or password.", {
                position : "top-right",
            });
        }
    }

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
                    <div onClick={handleGoogleLogin} className="google">
                        <img src={Google} alt="google"/>
                        <span>Continue with Google</span>
                    </div>
                    <div className="separator">
                        <div className="line"></div>
                        <span>Or</span>
                    </div>
                    <form onSubmit={handleSubmit} className="form">
                        <Input typeInput="email" nameInput="Email" onChange={(e) => setEmail(e.target.value)}
                               idInput="login-email" placeholder=""></Input>
                        <Input typeInput="password" nameInput="Password" onChange={(e) => setPassord(e.target.value)}
                               idInput="password-email" placeholder=""></Input>
                        <Button type="sumbit" name="Log in"></Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login