import React, { useRef, useEffect, useState } from 'react';

function loadingText() {
    return (<><div className="loading" id="comment-loading"></div></>);
}

const EditTitle = ({videoTitle, setVideoTitle, setDiscard}) => {
    const editTitleRef = useRef(null);
    const [videoEditTitle, setVideoEditTitle] = useState(videoTitle);
    const onVideoEditTitleChange = (event) => { setVideoEditTitle(event.target.value); };
    const [loading, setLoading] = useState(false);

    const editTitleSubmit = (e) => {
        e.preventDefault();
        change();
    }

    useEffect(() => {
        function handleClickOutside(event) {
          if (editTitleRef.current && !editTitleRef.current.contains(event.target)) {
            change();
          }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [editTitleRef, videoEditTitle]);

    function change() {
        if(videoEditTitle === videoTitle || videoEditTitle === "") {
            setDiscard(x => x + 1);
        }else{
            setLoading(true);
            setVideoTitle(videoEditTitle);
        }
    }

    return (<div className='title-edit' ref={editTitleRef}>
        <form onSubmit={editTitleSubmit}>
             <h3 className="subtitle">Edit Title</h3>
             {!loading && <input type="text" className="input" value={videoEditTitle}
                onChange={onVideoEditTitleChange} maxLength="100" autoFocus required />}
             {loading && loadingText()}
        </form>
        </div>
    )
}

export default EditTitle;