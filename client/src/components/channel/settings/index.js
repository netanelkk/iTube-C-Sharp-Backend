import React, { useState, useEffect } from 'react'
import ErrorLogin from "../../errors/errorLogin";
import Error404 from "../../errors/error404";
import { PCFormLabel, PCFormPicture } from "../../placeholderComponents/homepage"
import Async from "react-async";
import { mydetails } from "../../../api";
import { useLocation } from "react-router-dom";
import Profile from './profile';
import Account from './account';
import Tabs from './tabs';

/*
    User settings
*/
function Settings({ isUserSignedIn, setRefreshBar, setTitle, topRef }) {
    setTitle("Settings");
    const location = useLocation();
    const [pageId, setPageId] = useState(1);
    const path = window.location.pathname.replace(window.PATH, '').split("/")[2];

    const getData = async () => {
        const d = await mydetails();
        if (!d.pass) throw new Error("error");
        return d.Data;
    }

    useEffect(() => {
        topRef.current.scrollTop = 0;
    }, [pageId]);

    return (
        <>
            {!isUserSignedIn &&
                <ErrorLogin />}

            {isUserSignedIn && <>
                <h1>Settings</h1>

                <Tabs
                    pageId={pageId}
                    setPageId={setPageId}
                    path={path}
                    key={"tab" + pageId}
                    location={location} />

                {pageId === 1 &&
                    <Async promiseFn={getData}>
                        {({ data, error, isPending }) => {
                            if (isPending) return (<><PCFormLabel /><PCFormLabel /><PCFormLabel /><br /><PCFormLabel /></>)
                            if (error) { return (<Error404 />); }
                            if (data)
                                return (
                                    <Account data={data} setRefreshBar={setRefreshBar} />
                                )
                        }}
                    </Async>
                }

                {pageId === 2 &&
                    <Async promiseFn={getData}>
                        {({ data, error, isPending }) => {
                            if (isPending) return (<>
                            <div className="row">
                                <div>
                                    <PCFormPicture />
                                </div>
                                <div style={{ marginTop: "50px" }}>
                                    <PCFormLabel />
                                </div>
                            </div></>)
                            if (error) { return (<Error404 />); }
                            if (data)
                                return (
                                    <Profile data={data} />
                                )
                        }}
                    </Async>
                }
            </>
            }
        </>
    );
}


export default Settings;
