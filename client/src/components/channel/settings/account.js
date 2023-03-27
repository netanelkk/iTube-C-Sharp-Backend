import React, { useState } from 'react'
import { updatedetails } from "../../../api";
import AlertMessage from './alert';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';

function applyText() {
    return (<><span>Apply</span></>);
}

function loadingText() {
    return (<><div className="loading"></div><span>Loading..</span></>);
}

/*
    User settings > Account
    Changing account details such as email and password
*/
const Account = ({ data, setRefreshBar }) => {
    const [buttonText, setbuttonText] = useState(applyText);
    const [disabled, setDisabled] = useState("");
    const [email, setEmail] = useState(data.Email);
    const [newPassword, setNewPassword] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const onPasswordChange = (event) => setPassword(event.target.value);
    const onNewPasswordChange = (event) => setNewPassword(event.target.value);
    const onEmailChange = (event) => setEmail(event.target.value);

    function loading(show = true) {
        if (show) {
            setDisabled("disabled");
            setbuttonText(loadingText());
        } else {
            setDisabled("");
            setbuttonText(applyText());
        }
    }

    const submit = async (e) => {
        e.preventDefault();
        loading();
        const updateResult = await updatedetails({ email, newPassword, password });
        if (updateResult.pass) {
            setAlertMessage("Settings updated successfully");
            setSuccess(true);
            setNewPassword("");
            setPassword("");
            setTimeout(() => {
                setRefreshBar(x => x + 1);
            }, 2000);
        } else {
            setSuccess(false);
            setAlertMessage(updateResult.Message);
        }

        loading(false);
    }


    return (
        <>
            {alertMessage &&
                <AlertMessage
                    alertMessage={alertMessage}
                    setAlertMessage={setAlertMessage}
                    success={success} />}

            <form className='upload-form' onSubmit={submit}>
                <TextField
                    label="Username"
                    variant="outlined"
                    value={data.Username}
                    disabled
                    fullWidth
                />

                <TextField
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={onEmailChange}
                    fullWidth
                />

                <TextField
                    type="password"
                    label="New Password (Leave empty to keep the same)"
                    placeholder="Leave empty to keep the same"
                    variant="outlined"
                    value={newPassword}
                    onChange={onNewPasswordChange}
                    fullWidth
                />

                <h3 className="subtitle" style={{ marginTop: "50px" }}>Current Password</h3>

                <TextField
                    type="password"
                    label="Current Password"
                    variant="outlined"
                    value={password}
                    onChange={onPasswordChange}
                    fullWidth
                />

                <Button
                    type="submit"
                    variant="contained"
                    disabled={disabled}>
                    {buttonText}
                </Button>
            </form>
        </>
    );
}

export default Account;