import React, { useState } from 'react'
import Login from "../../login"
import Member from './member';
import Search from './search';

/*
    Side header with search & user menu
*/
function Searchbar(props) {
    const { onLogout, isUserSignedIn, setIsUserSignedIn, refreshBar } = props;
    const [openLogin, setOpenLogin] = useState(false);

    const closeLogin = () => { setOpenLogin(false); };

    const onLoginSuccessful = () => {
        setIsUserSignedIn(true);
        setOpenLogin(false);
        window.location.href = "";
    };

    return (<>
        {(openLogin &&
            <Login
                closeLogin={closeLogin}
                onLoginSuccessful={onLoginSuccessful} />)}

        <div id="search-bar">
            <Search />
            <Member
                refreshBar={refreshBar}
                onLogout={onLogout}
                isUserSignedIn={isUserSignedIn}
                setOpenLogin={setOpenLogin} />
        </div>
    </>
    );
}

export default Searchbar;
