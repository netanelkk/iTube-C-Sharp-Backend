import React, { useEffect } from 'react'
import Async from "react-async";
import { fetchNewVideos, fetchPopular } from "../../api";
import VideoBox from "../video/videoBox";
import { PCVideoRow } from "../placeholderComponents/homepage"

/*
  Fetching the most liked videos in the past month
*/
const Popular = () => {
  const getPopular = async () => {
    const d = await fetchPopular();
    if (!d.pass) throw new Error("error");
    return d.Data;
  }

  return (
    <>
      <h1>Popular Right Now</h1>
      <Async promiseFn={getPopular}>
        {({ data, error, isPending }) => {
          if (isPending) return (<><PCVideoRow /><PCVideoRow /></>);
          if (error) return (<div className="access-error">No videos were found</div>);
          if (data)
            return (
              <div className="row">
                {data.map(video => (
                  <VideoBox
                    video={video}
                    col="4"
                    key={"popular" + video.Id} />))}
              </div>
            )
          return null
        }}
      </Async>
    </>
  )
}

const Newest = () => {
  const getData = async () => {
    const d = await fetchNewVideos();
    if (!d.pass) throw new Error("error");
    return d.Data;
  }

  return (
    <>
      <h1>Newest</h1>

      <Async promiseFn={getData}>
        {({ data, error, isPending }) => {
          if (isPending) return (<><PCVideoRow /><PCVideoRow /></>);
          if (error) return (<div className="access-error">No videos were found</div>);
          if (data)
            return (
              <div className="row">
                {data.map(video => (
                  <VideoBox
                    video={video}
                    col="4"
                    key={"newest" + video.Id} />))}
              </div>
            )
          return null
        }}
      </Async>
    </>
  )
}

/*
    Homepage with newest and popular videos
    Popular videos are videos that uploaded in the past month, with the most likes
*/
function Homepage({ setTitle, topRef }) {
  setTitle("");

  useEffect(() => {
    topRef.current.scrollTop = 0;
  }, []);

  return (
    <>
      <div className="hero">
        <div></div>
      </div>

      <Newest />
      <Popular />
      
    </>
  );
}

export default Homepage;
