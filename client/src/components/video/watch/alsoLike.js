import React from 'react'
import Async from "react-async";
import VideoBox from "../../video/videoBox";
import { PCChannel } from "../../placeholderComponents/channel"
import { fetchAlsoLike } from "../../../api";

/*
    Also like section - List of suggested videos
*/
function AlsoLike({ videoId }) {
    const getRecommendations = async () => {
        const d = await fetchAlsoLike(videoId);
        if (!d.pass) throw new Error("error");
        return d.Data;
    }
    return (
        <>
            <h2 id="recommendationTitle">
                You Might Also Like
            </h2>
            <Async promiseFn={getRecommendations}>
                {({ data, error, isPending }) => {
                    if (isPending) return (<>
                        <div className="row">
                            <PCChannel />
                        </div>
                        <div className="row">
                            <PCChannel />
                        </div>
                    </>)
                    if (error) return;
                    if (data)
                        return (
                            <>
                                <div className="row">
                                    {data.map(video =>
                                        <VideoBox
                                            video={video}
                                            col="3"
                                            key={"recommended" + video.Id} />)}
                                </div>
                            </>
                        )
                    return null
                }}
            </Async>
        </>
    )
}

export default AlsoLike;