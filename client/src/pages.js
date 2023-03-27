import React, { useRef } from 'react'
import Search from "./components/search"
import Trending from "./components/homepage/trending"
import Channel from "./components/channel"
import Subscriptions from "./components/library/subscriptions"
import History from "./components/library/history"
import Likes from "./components/library/likes"
import Error404 from "./components/errors/error404";
import Upload from "./components/video/upload"
import Settings from "./components/channel/settings";
import Homepage from './components/homepage';
import Watch from "./components/video/watch"
import { Routes, Route } from "react-router-dom";

// React route for pages
const Pages = React.memo((props) => {
    const { isUserSignedIn, setRefreshSubs, setRefreshBar } = props;
    const topRef = useRef();

    // Set page title according to page
    const setTitle = (title) => {
        document.title = "iTube" + ((title == "") ? "" : " - " + title);
    };

    return (
        <div id="main-content" ref={topRef}>
            <Routes>
                <Route
                    path={window.PATH + "/"}
                    element={<Homepage setTitle={setTitle}
                        topRef={topRef} />} />

                <Route
                    path={window.PATH + "/trending"}
                    element={<Trending setTitle={setTitle}
                        topRef={topRef} />} />

                <Route
                    path={window.PATH + "/watch"}
                    element={<Watch isUserSignedIn={isUserSignedIn}
                        setTitle={setTitle}
                        topRef={topRef} />}>
                    <Route path=":id" />
                </Route>

                <Route
                    path={window.PATH + "/search"}
                    element={<Search setTitle={setTitle} topRef={topRef} />}>
                    <Route path=":query" />
                </Route>

                <Route
                    path={window.PATH + "/channel"}
                    element={<Channel
                        setTitle={setTitle}
                        isUserSignedIn={isUserSignedIn}
                        setRefreshSubs={setRefreshSubs}
                        setRefreshBar={setRefreshBar}
                        topRef={topRef} />}>
                    <Route path=":id">
                        <Route path="liked" />
                        <Route path="channels" />
                        <Route path="about" />
                    </Route>
                </Route>

                <Route
                    path={window.PATH + "/subscriptions"}
                    element={<Subscriptions
                        setTitle={setTitle}
                        isUserSignedIn={isUserSignedIn}
                        topRef={topRef} />} />

                <Route
                    path={window.PATH + "/history"}
                    element={<History setTitle={setTitle}
                        isUserSignedIn={isUserSignedIn}
                        topRef={topRef} />} />

                <Route
                    path={window.PATH + "/likes"}
                    element={<Likes
                        setTitle={setTitle}
                        isUserSignedIn={isUserSignedIn}
                        topRef={topRef} />} />

                <Route
                    path={window.PATH + "/upload"}
                    element={<Upload
                        setTitle={setTitle}
                        isUserSignedIn={isUserSignedIn}
                        topRef={topRef} />} />

                <Route
                    path={window.PATH + "/settings"}
                    element={<Settings
                        setTitle={setTitle}
                        isUserSignedIn={isUserSignedIn}
                        setRefreshBar={setRefreshBar}
                        topRef={topRef} />} >
                    <Route path="profile" />

                </Route>

                <Route
                    path="*"
                    element={<Error404 />} />

            </Routes>
        </div>
    );
});

export default Pages;