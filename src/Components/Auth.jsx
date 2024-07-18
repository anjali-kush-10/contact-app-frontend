import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const Auth = () => {

    const userData = useSelector((state) => state.authReducer.userData);
    const authToken = useSelector((data) => data.authReducer.userToken);

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
        <>
        </>
    )
}

export default Auth;