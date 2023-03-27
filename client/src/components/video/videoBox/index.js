import React, { useRef, useEffect, useState } from 'react'
import ReactTimeAgo from 'react-time-ago'
import { Link, useNavigate } from "react-router-dom";
import { updatetitle } from "../../../api";
import { Delete, EditTitle, MakePrivate } from './options'

const zeroPad = (num, places = 2) => String(num).padStart(places, '0');

function formatDuration(duration) {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return zeroPad(minutes) + ":" + zeroPad(seconds);
}


/*
    General component for video, "box" style
    Used in main page, video suggestions, etc.
*/
export default function VideoBox(props) {
    const videoMenu = useRef(null);
    const videoBox = useRef(null);
    const { video, col, index, hidePublisher, setCount, userId } = props;
    const navigate = useNavigate();
    const [videoTitle, setVideoTitle] = useState(video.Title);
    const [showEditTitle, setShowEditTitle] = useState(false);
    const [showPrivate, setShowPrivate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [discard, setDiscard] = useState(0);
    const [locked, setLocked] = useState(video.Password === "LOCKED")
    const allowEdit = (localStorage.getItem("myid") === userId);

    const editTitleClick = () => {
        discardAll();
        setShowEditTitle(true);
    }
    const privateClick = () => {
        discardAll();
        setShowPrivate(true);
    }
    const deleteClick = () => {
        discardAll();
        setShowDelete(true);
    }

    const togglePublisher = (e) => {
        e.currentTarget.classList.toggle('active');
    };

    const openMenu = (e) => {
        e.preventDefault();
        videoMenu.current.classList.add('show');
    }
    const closeMenu = () => {
        videoMenu.current.classList.remove('show');
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (videoMenu.current && !videoMenu.current.contains(event.target)) {
                closeMenu();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [videoMenu]);

    useEffect(() => {
        discardAll();
    }, [discard]);

    useEffect(() => {
        async function update() {
            const updateResult = await updatetitle({ videoId: video.Id, title: videoTitle });
            if (updateResult.pass) {
                video.Title = videoTitle;
                discardAll();
            }
        }
        if (video.Title !== videoTitle)
            update();
    }, [videoTitle]);

    function discardAll() {
        closeMenu();
        setShowEditTitle(false);
        setShowPrivate(false);
        setShowDelete(false);
    }

    return (
        <div className={("col-xl-" + ((index === 0) ? "12" : col)) + " " +
            ("col-lg-" + ((index === 0) ? "12" : "4")) + " " +
            ("col-md-" + ((index === 0) ? "12" : "6"))} ref={videoBox}>

            {showEditTitle &&
                <EditTitle
                    videoTitle={videoTitle}
                    setVideoTitle={setVideoTitle}
                    setDiscard={setDiscard} />}
            {showPrivate &&
                <MakePrivate
                    setDiscard={setDiscard}
                    videoId={video.Id}
                    locked={locked}
                    setLocked={setLocked} />}
            {showDelete &&
                <Delete
                    setDiscard={setDiscard}
                    videoId={video.Id}
                    setCount={setCount}
                    videoBox={videoBox} />}

            {(allowEdit && hidePublisher) ?
                <ul className='video-menu' ref={videoMenu}>
                    <li onClick={editTitleClick}>
                        <i className="bi bi-pencil-square"></i>
                        Edit Title
                    </li>
                    <li onClick={privateClick}>
                        <i className="bi bi-shield-lock"></i>
                        Make Private
                    </li>
                    <li onClick={deleteClick}>
                        <i className="bi bi-trash"></i>
                        Delete
                    </li>
                </ul> : <div ref={videoMenu}></div>}

            <Link to={window.PATH + "/watch/" + video.Id}>
                <div className={"video-box" + ((index === 0) ? " big-box" : "")}
                    onMouseEnter={togglePublisher}
                    onMouseLeave={togglePublisher}>

                    <div className="video-pic"
                        style={{ backgroundImage: "url(" + window.SERVER + "/video_thumbnails/" + video.ThumbnailPath + ")" }}>

                        {!hidePublisher &&
                            <div
                                role='link'
                                onClick={(e) => { e.preventDefault(); navigate(window.PATH + "/channel/" + video.UserId); }} >
                                <div className="creator">
                                    <img src={"" + window.SERVER + "/user_thumbnails/" + (video.PicturePath ? video.PicturePath : "default.png")} alt="profile" />
                                    <span>
                                        {video.Username}
                                    </span>
                                </div>
                            </div>}

                        {(allowEdit && hidePublisher) &&
                            <>
                                <div className="creator" onClick={openMenu}>
                                    <i className="bi bi-three-dots"></i>
                                </div>
                            </> }
                        <div className="duration">
                            {formatDuration(video.Duration)}
                        </div>
                    </div>


                    <div className="video-desc">
                        <h2>
                            {locked && <i className="bi bi-lock-fill"></i>} 
                            {videoTitle}
                        </h2>
                        <span>
                            {video.Views} Views 
                            <span className='dot-padding'>&#183;</span>
                            <ReactTimeAgo date={Date.parse(video.UploadDate)} locale="en-US" />
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
}

