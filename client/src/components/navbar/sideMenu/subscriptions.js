import React, { useState, useEffect, useRef } from 'react'
import { Link } from "react-router-dom";
import { mysubscriptions } from '../../../api';
import { PCSubscription } from "../../placeholderComponents/homepage"
import Button from '@mui/material/Button';

const ChannelRow = ({ channel }) => {
  return (
    <Link to={window.PATH + "/channel/" + channel.Id}>
      <li>
        <img src={"" + window.SERVER + "/user_thumbnails/" + (channel.PicturePath ? channel.PicturePath : "default.png")} alt="profile-pic" />
        <span>
          {channel.Username}
        </span>
      </li>
    </Link>
  );
}

/*
    Side subscription list
*/
const Subscriptions = ({ isUserSignedIn, bottom }) => {
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
    if (page < Math.ceil(count / window.MAX_PER_REQUEST)) {
      setPage((page) => page + 1);
    }
  }, [bottom]);

  useEffect(() => {
    const loadVideos = async () => {
      if (page == 1) {
        setData([]);
      }
      setLoading(true);
      const d = await mysubscriptions(page);
      if (!d.pass) {
        setLoading(false);
      } else {
        setCount(d.Data[0].Count);
        setData((data) => [...data, ...d.Data]);
        setLoading(false);
      }
    }
    loadVideos();
  }, [page]);

  return (
    <>
      {(isUserSignedIn && <><h2>SUBSCRIPTIONS</h2>
        <ul className="menu-list menu-sub">
          {data.map(channel => (
            <ChannelRow
              channel={channel}
              key={"mychannel" + channel.Id} />))}
        </ul>

        {loading &&
          <PCSubscription />}

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

            {count === 0 &&
              <span className="sub-error"></span>}
          </>}
      </>)}
    </>
  );
};

export default Subscriptions;