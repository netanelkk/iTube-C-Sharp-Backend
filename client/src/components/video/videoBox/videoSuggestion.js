import React from 'react'
import ReactTimeAgo from 'react-time-ago'
import { Link } from "react-router-dom";

const zeroPad = (num, places = 2) => String(num).padStart(places, '0')

function formatDuration(duration) {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return zeroPad(minutes) + ":" + zeroPad(seconds);
}

/*
    General component for video, "row" style
    Used in history, likes, search results, etc.
*/
const VideoSuggestion = ({ video, isHistory, isLiked, isActive }) => {
    return (
        <Link to={window.PATH + "/watch/" + video.Id}>
            <div 
            className={((isHistory || isLiked) ? "history" : "suggest") + ((isActive) ? " active" : "")}>
                <div className="suggest-pic" 
                style={{ backgroundImage: "url(" + window.SERVER + "/video_thumbnails/" + video.ThumbnailPath + ")" }}>
                    <div className="duration">
                        {formatDuration(video.Duration)}
                    </div>
                </div>

                <div className="suggest-details">
                    <span>
                        {video.Title}
                    </span>
                    <div className="creator">
                        <img src={"" + window.SERVER + "/user_thumbnails/" + (video.PicturePath ? video.PicturePath : "default.png")} alt="profile" />
                        <span>
                            {video.Username}
                        </span> 

                        {(!isLiked) ? <>    &#183;  </> : ""} 

                        {(isHistory) ? (<span className='suggest-time'>Watched </span>) : ""}

                        {!isLiked && 
                        <ReactTimeAgo 
                        date={(isHistory) ? Date.parse(video.HistoryDate) : Date.parse(video.UploadDate)} 
                        locale="en-US" 
                        className="suggest-time" />}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default VideoSuggestion;