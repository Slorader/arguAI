import React, {useState} from "react";
import Input from "../../Form/Input/Input.jsx";
import Button from "../../Form/Button/Button.jsx";
import Logo from '../../../../../public/images/AR_white.png';
import '../Login/login.css';
import "../../Form/Input/input.css";
import "../../Form/Button/buttons.css";
import {createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup} from "firebase/auth"
import {auth, db} from "../../Firebase/firebase.jsx"
import {setDoc, doc, getDoc} from "firebase/firestore"
import {toast} from "react-toastify";
import Google from "../../../../../public/images/google.png";

const Register = () => {

    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassord] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const handleRegister = async (e) => {
        e.preventDefault();
        if (confirmPassword === password)
        {
            try {
                await createUserWithEmailAndPassword(auth,email,password);
                const user = auth.currentUser;
                console.log(user);
                if (user) {
                    await setDoc(doc(db,"Users", user.uid),{
                        email : user.email,
                        firstName : fname,
                        lastName : lname,
                        uid : user.uid,
                    });
                }
                toast.success("User registered successfully !", {
                    position : "top-right",

                });
            } catch(error) {
                console.log(error.message);
                toast.error(error.message, {
                    position : "top-right",

                });
            }

        } else {
            toast.error("Passwords do not match.", {
                position : "top-right",

            });
        }


    };

    const saveUserToFirestore = async (user) => {
        const { uid, displayName, email } = user;
        const [firstName, lastName] = displayName.split(' ');

        const userDocRef = doc(db, "Users", uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            console.log("User already exists in Firestore.");
            return;
        }

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
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            await saveUserToFirestore(user);
            toast.success("Logged in with Google successfully !", {
                position : "top-right",
            });
        } catch(error) {
            console.log(error.message);
            toast.error(error.message, {
                position : "top-right",
            });
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
                    <p>"Lorem" is typically the beginning of a placeholder text known as "Lorem Ipsum." This text is used in the publishing and typesetting industry to  demonstrate the visual appearance of a document or website without  relying on meaningful content. Lorem Ipsum has been the industry's  standard dummy text ever since the 1500s.</p>
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
                        <img src={Google} alt="google"/>
                        <span>Continue with Google</span>
                    </div>
                    <div className="separator">
                        <div className="line"></div>
                        <span>Or</span>
                    </div>

                    <form onSubmit={handleRegister} className="form">
                        <div className="input-line">
                            <Input name="name" typeInput="text" onChange={(e) => setFname(e.target.value)}
                                   nameInput="Name" idInput="name" placeholder=""/>
                            <Input name="lastName" typeInput="text" onChange={(e) => setLname(e.target.value)}
                                   nameInput="Last name" idInput="lastName" placeholder=""/>
                        </div>
                        <Input name="email" typeInput="email" onChange={(e) => setEmail(e.target.value)}
                               nameInput="Email" idInput="registerEmail" placeholder=""/>
                        <Input name="password" typeInput="password" onChange={(e) => setPassord(e.target.value)}
                               nameInput="Password" idInput="passwordEmail" placeholder=""/>
                        <Input name="confirmPassword" typeInput="password"
                               onChange={(e) => setConfirmPassword(e.target.value)} nameInput="Confirm password"
                               idInput="confirmPasswordEmail" placeholder=""/>
                        <Button type="submit" name="Register"/>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;