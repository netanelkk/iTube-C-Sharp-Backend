import React, { useState } from 'react'
import LoginForm from './loginForm';
import RegisterForm from './registerForm';

/*
    Sign in & sign up modal
*/
function Login({ closeLogin, onLoginSuccessful }) {
    const [error, setError] = useState("");
    const [mode, setMode] = useState("login");

    const switchMode = (e) => {
        if (e) e.preventDefault();
        setError("");
        setMode((mode === "login") ? "register" : "login");
    }

    return (
        <>
            <div id="modal-bg" onClick={closeLogin}></div>
            <div id="signin-modal">
                <div id="modal-close" onClick={closeLogin}>
                    <i className="bi bi-x"></i>
                </div>

                {(mode === "login") &&
                    <LoginForm
                        onLoginSuccessful={onLoginSuccessful}
                        setError={setError} />}

                {(mode === "register") &&
                    <RegisterForm
                        setError={setError}
                        onLoginSuccessful={onLoginSuccessful} />}

                {(error !== '') && (
                    <div className="error">
                        {error}
                    </div>
                )}

                {(mode === "login") &&
                    <p>
                        Not a member?&nbsp;
                        <a href="#" onClick={switchMode}>Sign up</a>
                    </p>}

                {(mode === "register") &&
                    <p>
                        Already have an account?&nbsp;
                        <a href="#" onClick={switchMode}>Sign in</a>
                    </p>}
            </div>
        </>
    );
}

export default Login;
