import React, { useState, useRef, useEffect } from 'react'
import { graph } from './graph';
import { totalviews } from "../../api";
import { PCAbout } from "../placeholderComponents/channel"
import ReactTooltip from 'react-tooltip';

function loadingGraph() {
    return (<><div className="loading loading-graph"></div></>);
}

/*
    User profile page > About
    View about info of user
*/
function About({ about, userId }) {
    const graphRef = useRef(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getTotalviews = async () => {
            setLoading(true);
            const d = await totalviews(userId);
            setLoading(false);
            if (d.pass && graphRef.current) {
                let data = Object.keys(d.Data).map((k) => d.Data[k]);
                let points = graph(graphRef.current, data);
                buildGraph(data, points);
            }
        }
        getTotalviews();
    }, []);

    // Placing interactive points to graph
    const buildGraph = (data, points) => {
        if (points.length > 1) {
            for (let i = 1; i <= points.length; i++) {
                document.getElementById("point" + i).style.left = (points[i - 1].x - 4) + "px";
                document.getElementById("point" + i).style.top = (points[i - 1].y - 4) + "px";
                document.getElementById("point" + i).setAttribute("data-tip", data[i - 1] + " View" + (data[i - 1] === 1 ? "" : "s"));
            }
            ReactTooltip.rebuild();
        }
    }

    return (
        <div className="channel channel-flex">

            <ReactTooltip />

            <div style={{ flex: 1 }}>
                <h1 className='channel-about-title'>
                    Total Views
                </h1>
                <div className="graph">
                    {loading && <div className='loading-graph-wrap'>{loadingGraph()}</div>}
                    <div className={"" + ((loading) ? "hide" : "")}>
                        <div className='point' id="point1"></div>
                        <div className='point' id="point2"></div>
                        <div className='point' id="point3"></div>
                        <div className='point' id="point4"></div>
                        <div className='point' id="point5"></div>
                        <div className='point' id="point6"></div>
                    </div>
                    <canvas width="650" height="220" ref={graphRef}></canvas>
                </div>
            </div>

            <div style={{ flex: 1 }}>
                <h1 className='channel-about-title about-title'>
                    About
                </h1>
                {(about === "") ? <PCAbout /> : <p>{about}</p>}
            </div>
            
        </div>
    )
}

export default About;