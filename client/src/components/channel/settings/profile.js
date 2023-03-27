import React, { useState } from 'react'
import { updateprofile } from "../../../api";
import { Link } from "react-router-dom";
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
    User settings > Profile
    Changing account info
*/
const Profile = ({ data }) => {
    const [buttonText, setbuttonText] = useState(applyText);
    const [disabled, setDisabled] = useState("");
    const [success, setSuccess] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [about, setAbout] = useState(data.About);
    const onAboutChange = (event) => setAbout(event.target.value);

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
        const updateResult = await updateprofile(about);
        if (updateResult.pass) {
            setSuccess(true);
            setAlertMessage("Settings updated successfully");
        } else {
            setSuccess(false);
            setAlertMessage("Try again later");
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
                <h3 className="subtitle">Picture</h3>
                <div>
                    <img src={"" + window.SERVER + "/user_thumbnails/" + (data.PicturePath ? data.PicturePath : "default.png")} alt="profile" className="profile-pic" />
                </div>

                <p className='ref-button'>
                    <Link to={window.PATH + "/channel/" + localStorage.getItem('myid')}>
                        Change from channel page
                    </Link>
                </p>
                <br />

                <h3 className="subtitle">About</h3>

                <TextField
                    label="About"
                    variant="outlined"
                    placeholder='Write here about you..'
                    onChange={onAboutChange}
                    value={about}
                    maxLength="255"
                    fullWidth
                    multiline
                />

                <Button
                    type="submit"
                    variant="contained"
                    disabled={disabled}>
                    {buttonText}
                </Button>
            </form>
        </>
    )
}


export default Profile;