import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/login/login';
import ForgotPassword from './pages/login/forgetpw/forgotpw';
import Changepw from './pages/login/changepw/changepw';

const createRoutes=() => (
    <Routes>
        <Route path="login" element={<Login/>}/>
        <Route path="login/fp" element={<ForgotPassword/>}/>
        <Route path="changepw" element={<Changepw/>} />

    </Routes>
);

export default createRoutes;

