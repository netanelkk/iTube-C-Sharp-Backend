import React, { useState, useRef, useEffect } from 'react'
import { channelSubscriptions } from "../../api";
import { PCChannels } from "../placeholderComponents/channel"
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';

// Channel brief info
const ChannelBox = ({ channel }) => {
  return (
    <Link className="channelbox col-lg-3 col-md-4 col-sm-6"
      to={window.PATH + "/channel/" + channel.Id}>
      <div>
        <img
          src={"" + window.SERVER + "/user_thumbnails/" + (channel.PicturePath ? channel.PicturePath : "default.png")}
          alt="profile" />
        <div className='channelbox-user'>
          {channel.Username}
        </div>
        <div className='channelbox-sub'>
          {channel.Subscribers} subscribers
        </div>
      </div>
    </Link>)
}

// Mapping the result
const ChannelsMap = ({ data }) => {
  return (
    <div className="row">
      {
        data.map(channel =>
        (<ChannelBox
          channel={channel}
          key={"chnlbox" + channel.Id} />))
      }
    </div>
  );
}

/*
    User profile page > Channels
    View all subscribed channels of user
*/
const Channels = ({ userId }) => {
  const loadButton = useRef(null);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  // Handling "Load more"
  const loadMore = () => {
    if (page < Math.ceil(count / window.MAX_PER_REQUEST)) {
      setPage((page) => page + 1);
    }
  }

  // Hiding the "Load more" button
  useEffect(() => {
    if (!loading && page == Math.ceil(count / window.MAX_PER_REQUEST)) {
      loadButton.current.classList.add('hide');
    }
  }, [loading]);

  // Fetching the data by page number
  useEffect(() => {
    const loadVideos = async () => {
      if (page == 1) {
        setData([]);
      }
      setLoading(true);
      const d = await channelSubscriptions(userId, page);
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
    <div className="channel">
      <h1 id="channel-title">{count} Channels</h1>
      <ChannelsMap data={data} />

      {loading
        &&
        <div className='row'><PCChannels /><PCChannels /></div>}


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

          {(count == 0) &&
            <div className="access-error">
              There are no channels yet
            </div>}
        </>}

    </div>
  );
};



export default Channels;