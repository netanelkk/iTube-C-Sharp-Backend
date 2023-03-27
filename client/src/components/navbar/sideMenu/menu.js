import React from 'react'
import { Link } from "react-router-dom";

function Menu({ updateActive }) {
  const path = window.location.pathname.replace(window.PATH,'').split("/")[1];
  
  return (
    <>
      <ul className="menu-list">
        <Link to={window.PATH + "/"} onClick={updateActive}>
          <li className={(path === "") ? "active" : ""}>
            <i className="bi bi-house-fill"></i>
            Home
          </li>
        </Link>
        <Link to={window.PATH + "/trending"} onClick={updateActive}>
          <li className={(path === "trending") ? "active" : ""}>
            <i className="bi bi-fire"></i>
            Trending
          </li>
        </Link>
      </ul>

      <h2>LIBRARY</h2>
      <ul className="menu-list">
        <Link to={window.PATH + "/subscriptions"} onClick={updateActive}>
          <li className={(path === "subscriptions") ? "active" : ""}>
            <i className="bi bi-bookmark-fill"></i>
            Subscriptions
          </li>
        </Link>
        <Link to={window.PATH + "/history"} onClick={updateActive}>
          <li className={(path === "history") ? "active" : ""}>
            <i className="bi bi-clock-fill"></i>
            History
          </li>
        </Link>
        <Link to={window.PATH + "/likes"} onClick={updateActive}>
          <li className={(path === "likes") ? "active" : ""}>
            <i className="bi bi-heart-fill"></i>
            Likes
          </li>
        </Link>
      </ul>
    </>
  )
}

export default Menu;
