import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import Videos from "./videos";
import Channels from "./channels";
import About from './about';
import ChannelHead from './head';
import Tabs from './head/tabs';

/*
    User profile page
*/
function Channel(props) {
  const { id } = useParams();
  const { setRefreshSubs, isUserSignedIn, setTitle, setRefreshBar, topRef } = props;
  const [channelFound, setChannelFound] = useState(false);
  const [pageId, setPageId] = useState(0);
  const [about, setAbout] = useState("");
  const path = window.location.pathname.replace(window.PATH, '').split("/")[3];

  useEffect(() => {
    topRef.current.scrollTop = 0;
  }, []);

  return (
    <>
      <ChannelHead
        userId={id}
        setRefreshSubs={setRefreshSubs}
        setTitle={setTitle}
        setAbout={setAbout}
        setPageId={setPageId}
        setChannelFound={setChannelFound}
        isUserSignedIn={isUserSignedIn}
        setRefreshBar={setRefreshBar} />

      <Tabs
        pageId={pageId}
        setPageId={setPageId}
        channelId={id}
        path={path} />


      {channelFound &&
        <>
          {(pageId === 1 || pageId === 2) &&
            <Videos
              userId={id}
              key={"ch" + id + "tab" + pageId}
              tabpage={pageId} />}

          {pageId === 3 &&
            <Channels
              userId={id}
              key={"ch" + id + "tab" + pageId} />}

          {pageId === 4 &&
            <About
              about={about}
              userId={id} />}
        </>}
    </>
  );
}


export default React.memo(Channel);
