import React, { useEffect, useState, useRef } from 'react'
import { mydetails } from "../../../api";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';

function user(username, picturePath) {
    return (<>
        <img src={"" + window.SERVER + "/user_thumbnails/" + (picturePath ? picturePath : "default.png")}
            className="user-profile-pic" alt="profile" />
        <span>
            {username}
        </span>
    </>);
}

function loadingUser() {
    return (<div className="module" id="nav-module"></div>);
}

/*
    User menu
*/
const Member = ({ onLogout, isUserSignedIn, setOpenLogin, refreshBar }) => {
    const [navTitle, setNavTitle] = useState(loadingUser());
    const [channelId, setChannelId] = useState(0);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        async function getDetails() {
            const d = await mydetails();
            if (d.pass) {
                setNavTitle(user(d.Data.Username, d.Data.PicturePath));
                setChannelId(d.Data.Id);
                if (localStorage.getItem('myid') === null)
                    localStorage.setItem("myid", d.Data.Id);
            } else {
                if (d.msg === "AUTH_FAIL")
                    onLogout();
                if (d.error) {
                    if (!d.error.includes("NetworkError"))
                        onLogout();
                }
            }
        }
        if (isUserSignedIn) {
            getDetails();
        }
    }, [refreshBar]);

    const showLogin = () => { setOpenLogin(true); };
    const openMenu = () => {
        setShowMenu(!showMenu);
    }

    const userRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (userRef.current && !userRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [userRef]);

    return (
        <div id="member">
            {(isUserSignedIn &&
                <>
                    <div style={{ position: "relative" }} ref={userRef}>
                        <div className="user" onClick={openMenu}>
                            {navTitle}
                            <i className="bi bi-caret-down-fill"></i>
                        </div>

                        {showMenu &&
                            <ul className='user-menu'>
                                <Link to={window.PATH + "/upload"}
                                    onClick={() => { setShowMenu(false); }}>
                                    <li>
                                        <i className="bi bi-upload"></i>
                                        Upload Video
                                    </li>
                                </Link>
                                <Link to={window.PATH + "/channel/" + channelId}
                                    onClick={() => { setShowMenu(false); }}>
                                    <li>
                                        <i className="bi bi-tv"></i>
                                        My Channel
                                    </li>
                                </Link>
                                <Link to={window.PATH + "/settings"}
                                    onClick={() => { setShowMenu(false); }}>
                                    <li>
                                        <i className="bi bi-gear"></i>
                                        Settings
                                    </li>
                                </Link>
                                <Link to={window.PATH + "/#logout"}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowMenu(false);
                                        onLogout();
                                    }}>
                                    <li>
                                        <i className="bi bi-box-arrow-right"></i>
                                        Logout
                                    </li>
                                </Link>
                            </ul>}
                    </div>
                </>)}

            {(!isUserSignedIn && <>
                <Button variant="outlined" onClick={showLogin}>
                    <i className="bi bi-people"></i>
                    Sign in
                </Button>
            </>)}
        </div>
    );
}

export default Member;