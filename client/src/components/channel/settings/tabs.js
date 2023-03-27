import React, { useEffect } from 'react'
import { Link } from "react-router-dom";

// Settings tabs (menu)
const Tabs = ({ pageId, setPageId, path, location }) => {
    useEffect(() => {
        let page = 1;
        if (path) {
            if (path === "profile")
                page = 2;
        }
        setPageId(page);
    }, [location]);

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
                <Link to="">
                    <div className='tab-item'>
                        Account
                    </div>
                    <div className='tab-underline'></div>
                </Link>
            </li>
            <li className='tab-li'>
                <Link to="profile">
                    <div className='tab-item'>
                        Profile
                    </div>
                    <div className='tab-underline'></div>
                </Link>
            </li>
        </ul>
    );
}


export default Tabs;
