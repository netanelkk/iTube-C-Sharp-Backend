import React, { useState } from 'react'
import { like } from "../../../api";

/*
    Like button (for registered users)
*/
const LikeButton = (props) => {
    const { videoId, didLike, isUserSignedIn } = props;
    const [liked, setLiked] = useState(didLike);
    const [likes, setLikes] = useState(props.likes);

    const likeUnlikeClick = async () => {
        if (isUserSignedIn) {
            if (!liked) {
                setLiked(true);
                const d = await like(videoId);
                if (!d.pass) {
                    setLiked(false);
                    throw new Error("error");
                }
                setLikes(likes => likes + 1);
            } else {
                setLiked(false);
                const d = await like(videoId);
                if (!d.pass) {
                    setLiked(true);
                    throw new Error("error");
                }
                setLikes(likes => likes - 1);
            }
        }
    }

    return (
        <div
            className={"like" + (isUserSignedIn && liked ? " liked" : "") + (!isUserSignedIn ? " disabled" : "")}
            onClick={likeUnlikeClick}>
            {(isUserSignedIn && liked ?
                <i className="bi bi-heart-fill"></i> :
                <i className="bi bi-heart"></i>)}
            <span>
                Like
            </span>
            <span id="count-likes">
                {likes}
            </span>
        </div>
    );
};

export default LikeButton;