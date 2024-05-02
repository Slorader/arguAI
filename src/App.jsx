import Home from "./components/Home/Home.jsx";
import Login from "./components/Login/Login.jsx"
import Register from "./components/Register/Register.jsx";
import {BrowserRouter, BrowserRouter as Router, Route, Routes} from 'react-router-dom';



function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}></Route>
                <Route path="/login" element={<Login/>}></Route>
                <Route path="/register" element={<Register/>}></Route>

            </Routes>
        </BrowserRouter>
    );
}


export default App
