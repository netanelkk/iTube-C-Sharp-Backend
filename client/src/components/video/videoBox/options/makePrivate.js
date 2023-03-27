import React, { useRef, useEffect, useState } from 'react'
import { updateprivate } from "../../../../api";

function loadingText() {
    return (<><div className="loading" id="comment-loading"></div></>);
}

const MakePrivate = ({ setDiscard, videoId, locked, setLocked }) => {
    const editPrivateRef = useRef(null);
    const [password, setPassword] = useState("");
    const onPasswordChange = (event) => { setPassword(event.target.value); };
    const [loading, setLoading] = useState(false);
    const [privateChecked, setPrivateChecked] = useState(locked);

    const privateSubmit = (e) => {
        e.preventDefault();
        change();
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (editPrivateRef.current && !editPrivateRef.current.contains(event.target)) {
                change();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [editPrivateRef, privateChecked, password]);


    async function change() {
        setLoading(true);
        let pw = password;
        if (!privateChecked) { pw = ""; setPassword(pw); }
        const updateResult = await updateprivate({ videoId, password: pw, privateChecked });
        if (updateResult.pass) {
            if (!(privateChecked && pw == ''))
                setLocked(pw !== '');
            setDiscard(x => x + 1);
        }
    }

    const privateChange = () => {
        setPrivateChecked(!privateChecked);
    }

    return (<div className='title-edit' ref={editPrivateRef}>
        <form onSubmit={privateSubmit}>
            <h3 className="subtitle">Private Video</h3>
            {!loading && <>
                <label className='custom-option' htmlFor="private">
                    <input type="checkbox" id="private" onChange={privateChange} defaultChecked={locked} />
                    <span className="checkmark"></span>
                    <span>Private</span>
                </label>
                {privateChecked && <input type="password" className="input" value={password}
                    placeholder="Enter Password For Video"
                    onChange={onPasswordChange} maxLength="20" autoFocus required />}
            </>
            }
            {loading && loadingText()}
        </form>
    </div>
    )
}

export default MakePrivate;