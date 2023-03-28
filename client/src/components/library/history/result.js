import React, { useEffect, useState, useRef } from 'react'
import { fetchHistory } from "../../../api";
import VideoSuggestion from "../../video/videoBox/videoSuggestion"
import { PCResultRow } from "../../placeholderComponents/homepage"
import Button from '@mui/material/Button';

const ResultList = ({ data }) => {
  return (
    <>
      {data.map((video) => (
        <VideoSuggestion
          key={video.Id}
          video={video}
          isHistory={true} />))}
    </>
  );
}

/*
    History page - Fetching
*/
const HistoryResult = ({ isUserSignedIn }) => {
  const loadButton = useRef(null);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const loadMore = () => {
    if (page < Math.ceil(count / window.MAX_PER_REQUEST)) {
      setPage((page) => page + 1);
    }
  }

  useEffect(() => {
    if (!loading && page == Math.ceil(count / window.MAX_PER_REQUEST)) {
      loadButton.current.classList.add('hide');
    }
  }, [loading]);

  useEffect(() => {
    const loadVideos = async () => {
      setLoading(true);
      const d = await fetchHistory(page);
      if (d.pass) {
        setCount(d.Count);
        setData((data) => [...data, ...d.Data]);
      }
      setLoading(false);
    }
    loadVideos();
  }, [page]);

  return (
    <>
      <h1>Watch History</h1>
      <div className="row">
        <ResultList data={data} />
      </div>
      {loading &&
        <PCResultRow />}

      {!loading &&
        <>
          {count > 0 &&
            <Button
              variant="outlined"
              onClick={loadMore}
              ref={loadButton}
              fullWidth>
              Load more channels...
            </Button>}

          {count == 0 &&
            <>
              {isUserSignedIn &&
                <div className="access-error">
                  You haven't watched any videos yet
                </div>}

              {!isUserSignedIn &&
                <div className="access-error">
                  <i className="bi bi-exclamation-circle"></i>
                  Sign in to get access to history
                </div>}
            </>
          }
        </>
      }
    </>
  );
}

export default HistoryResult;
