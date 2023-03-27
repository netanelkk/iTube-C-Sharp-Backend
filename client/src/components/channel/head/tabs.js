import React, { useEffect } from 'react'
import { Link } from "react-router-dom";

/*
    User profile page - Header - Tabs (menu)
*/
const Tabs = ({ channelId, pageId, setPageId, path }) => {
  useEffect(() => {
    let page = 1;
    if (path) {
      switch (path) {
        case "liked":
          page = 2;
          break;
        case "channels":
          page = 3;
          break;
        case "about":
          page = 4;
          break;
      }
    }
    setPageId(page);
  }, [path]);

  useEffect(() => {
    clearActive();
    if (pageId > 0)
      document.querySelectorAll('.tab-li')[pageId - 1].classList.add("active");
  }, [pageId]);

  const clearActive = () => {
    const collection = document.getElementsByClassName("tab-li");
    for (const c of collection) {
      c.classList.remove("active");
    }
  }

  return (
    <ul className='tab-menu'>
      <li className='tab-li'>
        <Link to={window.PATH + "/channel/" + channelId}>
          <div className='tab-item'>Videos</div>
          <div className='tab-underline'></div>
        </Link>
      </li>
      <li className='tab-li'>
        <Link to={window.PATH + "/channel/" + channelId + "/liked"}>
          <div className='tab-item'>Liked Videos</div>
          <div className='tab-underline'></div>
        </Link>
      </li>
      <li className='tab-li'>
        <Link to={window.PATH + "/channel/" + channelId + "/channels"}>
          <div className='tab-item'>Channels</div>
          <div className='tab-underline'></div>
        </Link>
      </li>
      <li className='tab-li'>
        <Link to={window.PATH + "/channel/" + channelId + "/about"}>
          <div className='tab-item'>About</div>
          <div className='tab-underline'></div>
        </Link>
      </li>
    </ul>
  );
}

export default Tabs;