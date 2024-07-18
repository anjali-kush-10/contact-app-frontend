import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';


const Auth = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const path = window.location.pathname;
        // console.log(path);
        const token = localStorage.getItem("token");
        // console.log(token);
        if (!token) {
            navigate("/login");
        }
        else if ((path === "/login" || path === "/register") && token) {
            navigate("/");
        }

    }, []);

    return (
        <></>
    )
}

export default Auth;