import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import Async from "react-async";
import { watch } from "../../../api";
import Error404 from "../../errors/error404";
import { Player } from 'video-react';
import ReactTimeAgo from 'react-time-ago'
import { Link } from "react-router-dom";
import { PCVideoWatch } from "../../placeholderComponents/video";
import PasswordBox from './passwordBox';
import Description from './description';
import AlsoLike from './alsoLike';
import Comments from './comments';
import LikeButton from './like';

const Video = ({ isUserSignedIn, data, id }) => {
    return (
        <div className="video-content">
            <div id='video-player-box'>
                <div className="video-info">
                    <div id="video-left-info">
                        <span className="video-details">
                            <i className="bi bi-eye-fill"></i>
                            {data.Views} Views
                        </span>
                        <span className="dot-padding">·</span>
                        <span className="video-details">
                            Uploaded <ReactTimeAgo
                                date={Date.parse(data.UploadDate)}
                                locale="en-US" />
                        </span>
                    </div>
                    <div id="video-right-info">
                        <LikeButton
                            likes={data.Likes}
                            videoId={id}
                            didLike={data.DidLike}
                            isUserSignedIn={isUserSignedIn} />
                    </div>
                </div>
                <Player
                    poster={"" + window.SERVER + "/video_thumbnails/" + data.ThumbnailPath}
                    src={"" + window.SERVER + "/videos/" + data.VideoPath}
                    fluid={false}
                    width="100%"
                    autoPlay
                />
            </div>
            <div className="video-chat">
                <div id="video-publisher">
                    <Link to={window.PATH + "/channel/" + data.UserId}>
                        <img src={"" + window.SERVER + "/user_thumbnails/" + (data.PicturePath ? data.PicturePath : "default.png")} />
                        <div className="publisher-details">
                            {data.Username}
                            <div>
                                {data.Subscribers} Subscribers
                            </div>
                        </div>
                    </Link>
                </div>
                <Comments videoId={id} isUserSignedIn={isUserSignedIn} />
            </div>
        </div>
    )
}

/*
    Video page
*/
function Watch(props) {
    const { isUserSignedIn, setTitle, topRef } = props;
    const { id } = useParams();
    const [watchPassword, setWatchPassword] = useState("");

    const getData = async () => {
        const d = await watch(id, watchPassword);
        if (!d.pass) {
            setWatchPassword("");
            throw new Error(d.Message);
        }
        return d.Data;
    }

    useEffect(() => {
        topRef.current.scrollTop = 0;
    }, [id]);


    return (
        <>
            <Async promiseFn={getData}>
                {({ data, error, isPending }) => {
                    if (isPending) return (<><PCVideoWatch /></>);
                    if (error) {
                        // Password required for video
                        if (error.message === "pw") {
                            return (
                                <>
                                    <PCVideoWatch />
                                    <PasswordBox
                                        setWatchPassword={setWatchPassword} />
                                </>)
                        } else {
                            return (<Error404 />)
                        }
                    }
                    if (data) {
                        setTitle(data.Title);
                        return (
                            <div className='watch-content'>
                                <h1 id="video-title">
                                    {data.Title}
                                </h1>
                                <Video
                                    isUserSignedIn={isUserSignedIn}
                                    data={data}
                                    id={id}
                                />
                                <Description
                                    desc={data.Description} />

                                <AlsoLike
                                    videoId={id} />
                            </div>
                        )
                    }
                }}

            </Async>
        </>
    );
}

export default Watch;
