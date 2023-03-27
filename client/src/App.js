import React, { useState } from 'react'
import Navbar from "./components/navbar/sideMenu";
import Searchbar from "./components/navbar/topMenu";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import { BrowserRouter } from "react-router-dom";
import Pages from './pages';

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
import './App.css';

TimeAgo.addDefaultLocale(en);
 // Path of the app
window.PATH = ""; // /cgroup7/test2/tar1/Pages
 // Api requests URL (** CHANGE ALSO IN /src/api/index.js **)
window.API_URL = "http://localhost:55317"; // http://proj.ruppin.ac.il/cgroup7/test2/tar1
 // URL for public content from the server
window.SERVER = window.API_URL.replace("/api", "") + "/content";
// Max number of result in each "Load More" [notice: must be changed in SQL also]
window.MAX_PER_REQUEST = 12; 
window.MAX_PER_REQUEST_COMMENTS = 15; 

function App() {
  const [isUserSignedIn, setIsUserSignedIn] = useState(localStorage.getItem('token') != null);
  const [refreshSubs, setRefreshSubs] = useState(0);
  const [refreshBar, setRefreshBar] = useState(0);

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("myid");
    setIsUserSignedIn(false);
    window.location.href = "";
  };


  return (
    <div>
      <BrowserRouter>
        <Navbar
          refreshSubs={refreshSubs}
          isUserSignedIn={isUserSignedIn}
        />
        <div id="main-page">
          <Searchbar
            refreshBar={refreshBar}
            isUserSignedIn={isUserSignedIn}
            setIsUserSignedIn={setIsUserSignedIn}
            onLogout={onLogout} />
          <Pages
            isUserSignedIn={isUserSignedIn}
            setRefreshSubs={setRefreshSubs}
            setRefreshBar={setRefreshBar} />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
