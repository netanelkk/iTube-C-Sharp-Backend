import React, { useState, useRef } from 'react';
import AddComment from './add';
import FetchComments from './comments';

/*
    Video's comments
    Allowing adding, removing, tagging other users
*/
const Comments = ({ videoId, isUserSignedIn }) => {
    const [myComments, setMyComments] = useState([]);
    const [commentCount, setCommentCount] = useState(0); // comment_count
    const [myCommentCount, setMyCommentCount] = useState(0);

    const [page, setPage] = useState(1);
    const listInnerRef = useRef();
    const updateMyComments = (item) => {
        setMyCommentCount(myCommentCount => myCommentCount + 1);
        setMyComments(items => [item].concat(items));
    }

    const onScroll = () => {
        if (listInnerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
            if (scrollTop + clientHeight === scrollHeight) {
                if (page < Math.ceil(commentCount / window.MAX_PER_REQUEST_COMMENTS)) {
                    setPage(page => page + 1);
                }
            }
        }
    };


    return (
        <>
            <h2>
                {(commentCount + myCommentCount > 0) ? (commentCount + myCommentCount) : ""}
                &nbsp;Comment{(commentCount + myCommentCount > 1) ? "s" : ""}
            </h2>

            {(isUserSignedIn &&
                <AddComment
                    videoId={videoId}
                    updateMyComments={updateMyComments}
                    setCommentCount={setMyCommentCount} />)}

            <div className="video-comments"
                onScroll={() => onScroll()}
                ref={listInnerRef}>

                {(myComments.length > 0) &&
                    <div className="my-comments">
                        {myComments}
                    </div>}
                <FetchComments
                    videoId={videoId}
                    commentCount={commentCount}
                    setCommentCount={setCommentCount}
                    page={page}
                    setPage={setPage}
                    key={"COMD" + videoId} />

            </div>
        </>
    );
}

export default Comments;