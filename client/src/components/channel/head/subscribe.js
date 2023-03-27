import React, { useState } from 'react';
import { subscribe, unsubscribe } from "../../../api";


function subButton() {
    return (<span title="subscribe"><i className="bi bi-plus-lg"></i><span>subscribe</span></span>);
}

function subedButton() {
    return (<span title="unsubscribe"><i className="bi bi-check-lg"></i><span>subscribed</span></span>);
}

function loadingText() {
    return (<><div className="loading" id="comment-loading"></div></>);
}

/*
    User profile page - Header - Subscribe button
*/
const SubscribeButton = ({ userId, subscribeState, setRefreshSubs, setRefreshHead }) => {
    const [buttonDisabled, setButtonDisabled] = useState(false);

    // [ -1 - loading ]||[ 0 - hide (guest) ]||[ 1 - show ]||[ 2 - already subscribed ]
    const [subState, setSubState] = useState(subscribeState);

    const subscribeClick = React.useCallback(async () => {
        if (!buttonDisabled) {
            setSubState(-1);
            setButtonDisabled(true);
            const d = await subscribe(userId);
            setButtonDisabled(false);
            if (!d.pass) {
                setSubState(subscribeState);
                throw new Error("error");
            } else {
                setRefreshSubs(x => x + 1);
                setRefreshHead(x => x + 1);
            }
        }
    }, []);

    const unsubscribeClick = React.useCallback(async () => {
        if (!buttonDisabled) {
            setSubState(-1);
            setButtonDisabled(true);
            const d = await unsubscribe(userId);
            setButtonDisabled(false);
            if (!d.pass) {
                setSubState(subscribeState);
                throw new Error("error");
            }
            setRefreshSubs(x => x + 1);
            setRefreshHead(x => x + 1);
        }
    }, []);

    return (<>
        {subState !== 0 &&
            <div className={"subscribe" + ((buttonDisabled || subState === 2) ? " disabled" : "")}
                onClick={(subState == 1) ? subscribeClick : unsubscribeClick}>
                {(subState == 1) ? subButton() : ""}
                {(subState == 2) ? subedButton() : ""}
                {(subState == -1) ? loadingText() : ""}
            </div>
        }
    </>
    );
}

export default SubscribeButton;