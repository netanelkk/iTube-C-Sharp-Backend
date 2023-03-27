import React, { useState, useRef, useEffect } from 'react';
import { fetchComments, deletecomment } from "../../../../api";
import ReactTimeAgo from 'react-time-ago';
import { Link } from "react-router-dom";
import { contentWithTags } from './add';
import { MAX_PER_REQUEST } from './';

function commentLoading() {
    return (<><div className="loading" id="comment-loading"></div></>);
}

function loadingText() {
    return (<><div className="loading"></div></>);
}

function deleteIcon() {
    return (<i className="bi bi-x"></i>);
}

export function Comment({ comment, setCommentCount }) {
    const commentBox = useRef(null);
    const [deleteText, setDeleteText] = useState(deleteIcon);
    const [disabled, setDisabled] = useState(false);
    const allowDelete = (localStorage.getItem("myid") == comment.UserId);

    const loading = (show = true) => {
        if (show) {
            setDisabled(true);
            setDeleteText(loadingText);
        } else {
            setDisabled(false);
            setDeleteText(deleteIcon);
        }
    }

    const deleteClick = async (e) => {
        const target = e.currentTarget;
        if (!disabled) {
            target.classList.add("cursor-default");
            loading();
            const d = await deletecomment(comment.Id);
            if (d.pass) {
                commentBox.current.classList.add('hide');
                setCommentCount(x => x - 1);
            }
            loading(false);
            target.classList.remove("cursor-default");
        }
    }

    return (
        <div className="comment" ref={commentBox}>
            <div>
                <span>
                    <Link to={window.PATH + "/channel/" + comment.UserId}>
                        {comment.Username}
                    </Link>
                    <span className="comment-date">
                        &nbsp;&#183;&nbsp;
                        <ReactTimeAgo date={Date.parse(comment.Date)} locale="en-US" />
                    </span>
                </span>
                <p>
                    {comment.Content}
                </p>
            </div>

            {allowDelete &&
                <div title="Delete Comment"
                    onClick={deleteClick}>
                    {deleteText}
                </div>}
        </div>
    )
};

const CommentsList = ({ data, setCommentCount }) => {
    return (<>
        {data.map(comment => (
            <Comment
                key={"comment" + comment.Id}
                cid={comment.Id}
                comment={comment}
                setCommentCount={setCommentCount} />
        ))}
    </>
    )
}

/*
    Fetching all comments
*/
function FetchComments({ videoId, commentCount, setCommentCount, page, setPage }) {
    const loadButton = useRef(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadMore = () => {
        if (page < Math.ceil(commentCount / window.MAX_PER_REQUEST_COMMENTS)) {
            setPage(page => page + 1);
        }
    }

    useEffect(() => {
        if (!loading && page == Math.ceil(commentCount / window.MAX_PER_REQUEST_COMMENTS)) {
            loadButton.current.classList.add('hide');
        }
    }, [loading]);

    useEffect(() => {
        const loadComments = async () => {
            setLoading(true);
            const d = await fetchComments(videoId, page);
            if (!d.pass) {
                setLoading(false);
            } else {
                setCommentCount(d.Count);
                for (let i = 0; i < d.Data.length; i++) {
                    d.Data[i].Content = contentWithTags(d.Data[i].Content, d.Tags);
                }
                setData((data) => [...data, ...d.Data]);
                setLoading(false);
            }
        }
        loadComments();
    }, [page]);


    return (
        <>
            <CommentsList
                data={data}
                setCommentCount={setCommentCount} />

            {loading &&
                commentLoading()}

            {!loading &&
                <>
                    {commentCount > 0 &&
                        <button className="loadmore"
                            onClick={loadMore}
                            ref={loadButton}>
                            Load more comments...
                        </button>}

                    {commentCount === 0 &&
                        <span className="comments-error">
                        </span>}
                </>}
        </>
    )
}

export default React.memo(FetchComments);