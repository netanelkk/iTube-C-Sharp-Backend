import React, { useState } from 'react'
import { login, register } from "../../api";
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';

function registerText() {
    return (<><span>Register</span></>);
}

function loadingText() {
    return (<><div className="loading"></div><span>Loading..</span></>);
}

function usernameFormat() {
    return (<>
        <b>Username Invalid:</b>
        <ul>
            <li>Must contain 3-18 characters</li>
            <li>Must contain only letters and numbers</li>
            <li>Can have underscore only between words</li>
        </ul>
    </>)
}

function passwordFormat() {
    return (<>
        <b>Password Invalid:</b>
        <ul>
            <li>Must contain 6-18 characters</li>
        </ul>
    </>)
}

/*
    User registration form
*/
const RegisterForm = ({ setError, onLoginSuccessful }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [disabled, setDisabled] = useState("");
    const [buttonText, setbuttonText] = useState(registerText);

    const onUsernameChange = (event) => setUsername(event.target.value);
    const onEmailChange = (event) => setEmail(event.target.value);
    const onPasswordChange = (event) => setPassword(event.target.value);

    function loading(show = true) {
        if (show) {
            setDisabled("disabled");
            setbuttonText(loadingText);
        } else {
            setDisabled("");
            setbuttonText(registerText);
        }
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        loading();

        const registerResult = await register({ username, email, password });
        if (registerResult.pass) {
            setError("");
            const loginResult = await login({ username, password });
            if (loginResult.pass) {
                onLoginSuccessful();
                localStorage.setItem("token", loginResult.Token);
            }
        } else {
            if (registerResult.Message === "USERNAME") {
                setError(usernameFormat);
            } else if (registerResult.Message === "PASSWORD") {
                setError(passwordFormat);
            } else {
                setError(registerResult.Message);
            }
        }

        loading(false);
    };

    return (
        <>
            <h2>Sign Up</h2>
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
                                    type="email"
                                    label="Email"
                                    variant="outlined"
                                    value={email}
                                    onChange={onEmailChange}
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
                    {buttonText}
                </Button>
            </form>
        </>
    );
}

export default RegisterForm;