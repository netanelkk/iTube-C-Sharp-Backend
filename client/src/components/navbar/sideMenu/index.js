import React, { useState, useRef } from 'react'
import { Link, useLocation } from "react-router-dom";
import Menu from './menu';
import Subscriptions from './subscriptions';

const Logo = ({ updateActive }) => {
  return (
    <Link to={window.PATH + "/"} onClick={updateActive}>
      <div id="logo">
        <i className="bi bi-play-btn"></i>
        <span id="i"></span>
      </div>
    </Link>
  );
}

/*
    Side navigation menu & subscription list
*/
function Navbar({ refreshSubs, isUserSignedIn }) {
  const location = useLocation();
  const listInnerRef = useRef();
  const [pathChange, setPathChange] = useState(0);
  const [bottom, setBottom] = useState(false);
  const [openNav, setOpenNav] = useState(null);

  const updateActive = () => {
    if (openNav !== null) {
      setOpenNav(false);
    }
    setPathChange(pathChange + 1);
  }

  React.useEffect(() => {
    updateActive();
  }, [location]);

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        setBottom(true);
      } else {
        setBottom(false);
      }
    }
  };

  const navToggle = () => {
    if (openNav === null) {
      setOpenNav(true);
    } else {
      setOpenNav(!openNav);
    }
  }


  // alt-nav is navigation option for mobile
  // instead of showing the menu, there is a button that opens the menu
  return (
    <>

      <div id="alt-nav">
        {openNav &&
          <div id="modal-bg" onClick={navToggle}></div>}
        <div id="open-nav" onClick={navToggle}>
          <i className="bi bi-list"></i>
        </div>
        <Link to={window.PATH + "/"} onClick={updateActive}>
          <i className="bi bi-play-btn" id="nav-logo"></i>
        </Link>
      </div>

      <div className={((openNav === true) ? "open" : "") + ((openNav === false) ? "close" : "")}
        id="navbar"
        onScroll={() => onScroll()}
        ref={listInnerRef}>
        <div id="nav-con">

          <Logo updateActive={updateActive} />

          <div id="menu">
            <Menu updateActive={updateActive} />
            <Subscriptions
              key={"refresh" + refreshSubs}
              isUserSignedIn={isUserSignedIn}
              bottom={bottom} />
          </div>

        </div>

        <div id="menu-footer">
          &copy; iTube 2023 &#183; Nati & Dor & Shahaf
        </div>
      </div>
    </>
  );
}

export default Navbar;
