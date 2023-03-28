import React, { useRef, useEffect, useState } from 'react'
import { deletevideo } from "../../../../api";
import Button from '@mui/material/Button';

function loadingText() {
  return (<><div className="loading" id="comment-loading"></div></>);
}

const Delete = ({ setDiscard, videoId, videoBox, setCount }) => {
  const editDeleteRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (editDeleteRef.current && !editDeleteRef.current.contains(event.target)) {
        setDiscard(x => x + 1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editDeleteRef]);


  async function deleteVideo() {
    setLoading(true);
    const deleteResult = await deletevideo(videoId);
    if (deleteResult.pass) {
      setCount(x => x - 1);
      videoBox.current.classList.add('hide');
    }
    setDiscard(x => x + 1);
  }

  return (<div className='title-edit' ref={editDeleteRef}>
    <h3 className="subtitle">Are You Sure?</h3>
    {!loading && <>
      <Button
        color="error"
        variant="contained"
        onClick={deleteVideo}
        fullWidth>
        Delete Video
      </Button>
      <Button
        variant="outlined"
        onClick={() => setDiscard(x => x + 1)}
        fullWidth>
        Abort
      </Button>
    </>}
    {loading && loadingText()}
  </div>
  )
}

export default Delete;