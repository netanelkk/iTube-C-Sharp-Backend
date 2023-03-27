import React, { useState } from 'react'
import { login } from "../../api";
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';

function loginText() {
    return (<><i className="bi bi-box-arrow-in-right"></i><span>Login</span></>);
}

function loadingText() {
    return (<><div className="loading"></div><span>Loading..</span></>);
}

/*
    User login form
*/
const LoginForm = ({ onLoginSuccessful, setError }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [submitText, setSubmitText] = useState(loginText);
    const [disabled, setDisabled] = useState("");

    const onUsernameChange = (event) => setUsername(event.target.value);
    const onPasswordChange = (event) => setPassword(event.target.value);

    function loading(show = true) {
        if (show) {
            setDisabled("disabled");
            setSubmitText(loadingText);
        } else {
            setDisabled("");
            setSubmitText(loginText);
        }
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        loading();

        const loginResult = await login({ username, password });
        if (loginResult.pass) {
            setError("");
            onLoginSuccessful();
            localStorage.setItem("token", loginResult.Token);
        } else {
            setError(loginResult.Message);
        }

        loading(false);
    };


    return (
        <>
            <h2>Sign in</h2>
            <form className="sign-form" onSubmit={onSubmit}>
                <table className="form">
                    <tbody>
                        <tr>
                            <td>
                                <TextField
                                    label="Username"
                                    variant="outlined"
                                    value={username}
                                    onChange={onUsernameChange}
                                    required
                                    fullWidth
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextField
                                    type="password"
                                    label="Password"
                                    variant="outlined"
                                    value={password}
                                    onChange={onPasswordChange}
                                    required
                                    fullWidth
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={disabled}
                    fullWidth>
                    {submitText}
                </Button>
            </form>
        </>
    );
}

export default LoginForm;