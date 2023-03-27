import React, { useState } from 'react'

function unlockText() {
    return (<><i className="bi bi-key"></i></>);
}

function unlockLoading() {
    return (<><div className="loading"></div></>);
}

/*
    Password form for locked videos requiring password
*/
const PasswordBox = ({ setWatchPassword }) => {
    const [password, setPassword] = useState("");
    const [submitText, setSubmitText] = useState(unlockText);
    const [disabled, setDisabled] = useState("");

    const onPasswordChange = (event) => setPassword(event.target.value);

    const onSubmitPassword = async (event) => {
        event.preventDefault();
        if (password !== "") {
            setSubmitText(unlockLoading);
            setDisabled("disabled");
            setWatchPassword(password);
        }
    };

    return (
        <div className="content-middle" id="password-box">
            <div className="content-password">
                <h3 className="subtitle">
                    This Video Is Protected
                </h3>
                <form className="password-form" onSubmit={onSubmitPassword}>
                    <input
                        type="password"
                        className="input"
                        placeholder='Enter Password'
                        value={password}
                        onChange={onPasswordChange}
                        required
                        autoFocus />

                    <button
                        className='submit'
                        disabled={disabled}>
                        {submitText}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default PasswordBox;
