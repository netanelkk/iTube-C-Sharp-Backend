import React, { useEffect } from 'react'
import Async from "react-async";
import { fetchTrending } from "../../api";
import VideoBox from "../video/videoBox";
import { PCVideoTrending } from "../placeholderComponents/homepage"

/*
    Trending page with most viewed videos uploaded in the last month
*/
function Trending({ setTitle, topRef }) {
  setTitle("Trending");

  const getData = async () => {
    const d = await fetchTrending();
    if (!d.pass) throw new Error("error");
    return d.Data;
  }

  useEffect(() => {
    topRef.current.scrollTop = 0;
  }, []);

  return (
    <>
      <h1>Trending</h1>
      <Async promiseFn={getData}>
        {({ data, error, isPending }) => {
          if (isPending) return (<PCVideoTrending />);
          if (error) return (<div className="access-error">No videos were found</div>);
          if (data)
            return (
              <div className="row">
                {data.map((video, index) => (
                  <VideoBox
                    video={video}
                    col="4"
                    index={index}
                    key={"newest" + video.Id} />))}
              </div>
            )
          return null
        }}
      </Async>
    </>
  );
}

export default Trending;
