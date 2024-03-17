import { Routes, Route } from "react-router-dom";
import Login from "../pages/LoginPart/Login/Login";
import ForgetPw from "../pages/LoginPart/ForgetPw/ForgetPw";
import ChangePw from "../pages/LoginPart/ResetPw/ResetPw";



export function LoginRouter() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login/fp" element={<ForgetPw />} />
            <Route path="/login/resetpw" element={<ChangePw />} />
        </Routes>

    );
}
