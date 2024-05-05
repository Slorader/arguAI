import React, { useState } from "react";
import axios from "axios";
import Input from "../Input/Input.jsx";
import Button from "../Button/Button.jsx";
import Logo from '../../../public/images/AR_white.png';
import '../Login/login.css';
import "../Input/input.css";
import "../Button/buttons.css";

const Register = () => {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const formData = { name, lastName, email, password, confirmPassword };
            const response = await axios.post("http://localhost:5000/api/users/register", formData);
            console.log(formData);
            console.log(response.data);
        } catch (error) {
            console.error("Error registering user:", error);
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
                    <p>"Lorem" is typically the beginning of a placeholder text known as "Lorem  Ipsum." This text is used in the publishing and typesetting industry to  demonstrate the visual appearance of a document or website without  relying on meaningful content. Lorem Ipsum has been the industry's  standard dummy text ever since the 1500s.</p>
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
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="input-line">
                            <Input nameInput="Name" idInput="name" typeInput="text" value={name} onChange={(e) => setName(e.target.value)} />
                            <Input nameInput="Last name" idInput="lastName" typeInput="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </div>
                        <Input typeInput="email" nameInput="Email" idInput="registerEmail" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <Input typeInput="password" nameInput="Password" idInput="passwordEmail" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <Input typeInput="password" nameInput="Confirm password" idInput="confirmPasswordEmail" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        <Button type="submit" name="Register" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
