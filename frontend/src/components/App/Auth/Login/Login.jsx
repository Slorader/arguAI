import "./login.css";
import Logo from '../../../../../public/images/AR_white.png';
import Google from '../../../../../public/images/google.png';
import Input from "../../Form/Input/Input.jsx";
import "../../Form/Input/input.css";
import Button from "../../Form/Button/Button.jsx";
import "../../Form/Button/buttons.css";
import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../../Firebase/firebase.jsx";
import { toast } from "react-toastify";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const { user } = await signInWithPopup(auth, provider);

            const userDocRef = doc(db, "Users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
                const [firstName, lastName] = user.displayName.split(' ');
                await setDoc(userDocRef, {
                    uid: user.uid,
                    firstName,
                    lastName,
                    email: user.email,
                });
            }

            navigate("/chat");
            toast.success("User logged in successfully with Google!", { position: "top-right" });
        } catch (error) {
            console.error(error.message);
            toast.error("An error occurred during Google login.", { position: "top-right" });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/chat");
            toast.success("User logged in successfully!", { position: "top-right" });
        } catch (error) {
            console.error(error.message);
            toast.error("Incorrect email or password.", { position: "top-right" });
        }
    };

    return (
        <div className="login">
            <div className="login-logo">
                <img src={Logo} alt="logo" />
            </div>
            <div className="login-container">
                <div className="infos">
                    <div className="title">
                        <span>Start on Argu </span>
                        <span className="colored">AI</span>
                    </div>
                    <p>
                        Argu AI is a cutting-edge solution for automated argumentative analysis. Our platform, powered by artificial intelligence, is designed to help you analyze and structure arguments efficiently and accurately. Whether you are a student, researcher, professional, or simply passionate about debates and argumentation, Argu AI gives you the tools you need to optimize your analyses.
                    </p>
                </div>
                <div className="login-form">
                    <div className="title">
                        <span>Log </span>
                        <span className="colored">in</span>
                    </div>
                    <div className="register">
                        <span>You do not have an account? Register </span>
                        <a href="/register">here</a>
                    </div>
                    <div onClick={handleGoogleLogin} className="google">
                        <img src={Google} alt="google" />
                        <span>Continue with Google</span>
                    </div>
                    <div className="separator">
                        <div className="line"></div>
                        <span>Or</span>
                    </div>
                    <form onSubmit={handleSubmit} className="form">
                        <Input
                            typeInput="email"
                            nameInput="Email"
                            onChange={(e) => setEmail(e.target.value)}
                            idInput="login-email"
                            placeholder=""
                        />
                        <Input
                            typeInput="password"
                            nameInput="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            idInput="login-password"
                            placeholder=""
                        />
                        <Button type="submit" name="Log in" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
