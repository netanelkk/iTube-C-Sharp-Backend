import React, { useState, useEffect } from 'react';
import { userDetails } from "../../../api";
import Error404 from "../../errors/error404";
import { PCChannelHead } from "../../placeholderComponents/channel";
import ProfilePicture from './profilePicture';
import SubscribeButton from './subscribe';

/*
    User profile page - Header
*/
const ChannelHead = ({ userId, setRefreshSubs, setChannelFound, isUserSignedIn, setTitle, setRefreshBar, setAbout }) => {
  const [refreshHead, setRefreshHead] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      const d = await userDetails(userId);
      setLoading(false);
      if (!d.pass) {
        setData("error");
        setChannelFound(false);
      } else {
        d.Data.RegisterDate = new Date(d.Data.RegisterDate).toLocaleDateString("he-IL");
        setChannelFound(true);
        setData(d.Data);
        setAbout((d.Data.About === "") ?
          <span className="about-empty">No Information</span> : d.Data.About);
        setTitle(d.Data.Username)
      }
    }
    setLoading(true);
    loadDetails();
  }, [userId, refreshHead]);

  return (
    <>
      {loading &&
        <PCChannelHead />}
      {!loading &&
        <>
          {data === "error" &&
            <Error404 />}

          {data !== "error" &&
            <div className="channel-head">
              <ProfilePicture
                userId={userId}
                picturePath={data.PicturePath}
                isUserSignedIn={isUserSignedIn}
                setRefreshBar={setRefreshBar} />

              <div className="channel-name">
                <h2>{data.Username}</h2>
                <div id="channel-info">
                  <i className="bi bi-calendar-day"></i>
                  <span>{data.RegisterDate}</span>
                  <span>&#183; {data.Subscribers} subscribers</span>
                </div>
              </div>

              <SubscribeButton
                subscribeState={data.SubscribeState}
                userId={userId}
                setRefreshSubs={setRefreshSubs}
                setRefreshHead={setRefreshHead} />
            </div>
          }
        </>}
    </>
  );
};

export default ChannelHead;