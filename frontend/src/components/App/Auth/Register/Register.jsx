import React, { useState } from "react";
import Input from "../../Form/Input/Input.jsx";
import Button from "../../Form/Button/Button.jsx";
import Logo from '../../../../../public/images/AR_white.png';
import '../Login/login.css';
import "../../Form/Input/input.css";
import "../../Form/Button/buttons.css";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../../Firebase/firebase.jsx";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import Google from "../../../../../public/images/google.png";

const Register = () => {
    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const { fname, lname, email, password, confirmPassword } = formData;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!fname || !lname || !email || !password || !confirmPassword) {
            toast.error("All fields are required.", { position: "top-right" });
            return;
        }

        if (confirmPassword !== password) {
            toast.error("Passwords do not match.", { position: "top-right" });
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            const user = auth.currentUser;
            if (user) {
                await setDoc(doc(db, "Users", user.uid), {
                    uid: user.uid,
                    email: user.email,
                    firstName: fname,
                    lastName: lname,
                });
            }
            toast.success("User registered successfully!", { position: "top-right" });
        } catch (error) {
            toast.error("Email already exists.", { position: "top-right" });
        }
    };

    const saveUserToFirestore = async (user) => {
        const { uid, displayName, email } = user;
        const [firstName, lastName] = displayName.split(' ');

        const userDocRef = doc(db, "Users", uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            try {
                await setDoc(userDocRef, {
                    uid,
                    email,
                    firstName,
                    lastName,
                });
                console.log("New user saved to Firestore successfully.");
            } catch (error) {
                console.error("Error saving new user to Firestore:", error);
            }
        } else {
            console.log("User already exists in Firestore.");
        }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            await saveUserToFirestore(user);
            toast.success("Logged in with Google successfully!", { position: "top-right" });
        } catch (error) {
            console.error(error.message);
            toast.error(error.message, { position: "top-right" });
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
                    <p>Argu AI is a cutting-edge solution for automated argumentative analysis. Our platform, powered by artificial intelligence, is designed to help you analyze and structure arguments efficiently and accurately. Whether you are a student, researcher, professional or simply passionate about debates and argumentation, Argu AI gives you the tools you need to optimize your analyses.</p>
                </div>
                <div className="login-form">
                    <div className="title">
                        <span>Join </span>
                        <span className="colored">us</span>
                    </div>
                    <div className="register">
                        <span>Already have an account? Log in </span>
                        <a href="/login">here</a>
                    </div>
                    <div onClick={handleGoogleSignIn} className="google">
                        <img src={Google} alt="google" />
                        <span>Continue with Google</span>
                    </div>
                    <div className="separator">
                        <div className="line"></div>
                        <span>Or</span>
                    </div>
                    <form onSubmit={handleRegister} className="form">
                        <div className="input-line">
                            <Input
                                name="fname"
                                typeInput="text"
                                onChange={handleInputChange}
                                nameInput="First Name"
                                idInput="fname"
                                placeholder=""
                            />
                            <Input
                                name="lname"
                                typeInput="text"
                                onChange={handleInputChange}
                                nameInput="Last Name"
                                idInput="lname"
                                placeholder=""
                            />
                        </div>
                        <Input
                            name="email"
                            typeInput="email"
                            onChange={handleInputChange}
                            nameInput="Email"
                            idInput="email"
                            placeholder=""
                        />
                        <Input
                            name="password"
                            typeInput="password"
                            onChange={handleInputChange}
                            nameInput="Password"
                            idInput="password"
                            placeholder=""
                        />
                        <Input
                            name="confirmPassword"
                            typeInput="password"
                            onChange={handleInputChange}
                            nameInput="Confirm Password"
                            idInput="confirmPassword"
                            placeholder=""
                        />
                        <Button type="submit" name="Register" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
