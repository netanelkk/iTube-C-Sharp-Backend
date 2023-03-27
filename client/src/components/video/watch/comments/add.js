import React, { useState, useRef, useEffect } from 'react';
import { addComment } from "../../../../api";
import ContentEditable from 'react-contenteditable';
import reactStringReplace from 'react-string-replace';
import { Link } from "react-router-dom";
import { Comment } from "./comments";
import { Tag } from './tag';

function sendText() {
    return (<><i className="bi bi-send" id="comment-send"></i></>);
}

function loadingText() {
    return (<><div className="loading"></div></>);
}

// Adding tag links to comment
export function contentWithTags(content, tags) {
    for (let tag in tags) {
        content = reactStringReplace(content, "@" + tag, () => (
            <Link to={window.PATH + "/channel/" + tags[tag]}
                key={"usrtag" + Math.random()}>
                <span className='tag'>
                    @{tag}
                </span>
            </Link>
        ));
    }
    return content;
}

// User search (@) suggestions
const Suggestion = ({ user, addTag, isActive }) => {
    const tagClick = (e) => {
        e.preventDefault();
        addTag(user.Username);
    };

    return (
        <li className={(isActive) ? "sug-active" : "sug"} onClick={tagClick}>
            <img src={"" + window.SERVER + "/user_thumbnails/" + (user.PicturePath ? user.PicturePath : "default.png")} alt="profile" />
            <span>
                {user.Username}
            </span>
        </li>
    )
}

/*
    Adding comment to video
*/
var tag = null;
const AddComment = ({ videoId, updateMyComments, setCommentCount }) => {
    const [content, setContent] = useState("");
    const [submitText, setSubmitText] = useState(sendText);
    const [disabled, setDisabled] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [sugIndex, setSugIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    function loading(show = true) {
        if (show) {
            setDisabled("disabled");
            setSubmitText(loadingText);
        } else {
            setDisabled("");
            setSubmitText(sendText);
        }
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        loading();
        const sendResult = await addComment(videoId, tag.stripHtml(tag.content));
        if (sendResult.pass) {
            setContent("");
            tag.content = "";
            sendResult.Data.Content = contentWithTags(sendResult.Data.Content, sendResult.Tags);
            updateMyComments(<Comment
                key={"comment" + sendResult.Data.Id}
                comment={sendResult.Data}
                setCommentCount={setCommentCount} />);
        }
        loading(false);
    };


    const contentEditable = useRef();

    async function handleChange(e) {
        const valueSplit = tag.handleChange(e.target.value);
        setContent(tag.content);
        if (tag.tagMode) {
            setIsLoading(true);
            await tag.getSuggestions(valueSplit);
            setIsLoading(false);
            setSuggestions(tag.suggestions);
            setSugIndex(tag.sugIndex);
        }else{
            tag.suggestions = [];
            setSuggestions([]);
        }
    }

    const addTag = (username) => {
        tag.addTag(username);
        setContent(tag.content);
        setSuggestions(tag.suggestions);
        contentEditable.current.focus();
    };

    const onKeyPressed = (e) => {
        if(["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) {
            e.preventDefault();
            if(e.key === "Enter") {
                if (tag.suggestions.length > 0) {
                    addTag(tag.suggestions[tag.sugIndex].Username);
                    tag.suggestions = [];
                    setSuggestions(tag.suggestions);
                } else {
                    onSubmit(e);
                }
            }else{
                tag.keyboardPress(e.key);
                setSugIndex(tag.sugIndex);
            }
        }
    }

    const insertTag = (e) => {
        e.preventDefault();
        setContent((content + "@").replace("<br>", ""));
        contentEditable.current.focus();
    }

    useEffect(() => {
        tag = new Tag();
    }, []);

    return (
        <div className="comment-container">
            <form className="comment-form" onSubmit={onSubmit}>
                <div id="comment-textbox">
                    <ContentEditable
                        innerRef={contentEditable}
                        html={content}
                        onChange={handleChange}
                        onKeyDown={onKeyPressed} />
                    <span onClick={insertTag} title="Tag User">
                        @
                    </span>
                </div>
                <button disabled={disabled}>
                    {submitText}
                </button>
            </form>

            {suggestions.length > 0 &&
                <ul className="tag-suggestions">
                    {isLoading && <li id="tag-loading"></li>}
                    {suggestions.map((user, index) =>
                        <Suggestion
                            key={"suggest" + user.Username}
                            user={user}
                            addTag={addTag}
                            isActive={(index === sugIndex)} />)}
                </ul>}
        </div>
    );
}

export default AddComment;