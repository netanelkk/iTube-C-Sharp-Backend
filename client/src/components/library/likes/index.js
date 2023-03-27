import React, { useEffect } from 'react'
import LikedResult from './result';


/*
    Likes page
    Showing user's like history
*/
function Liked({ isUserSignedIn, setTitle, topRef }) {
  setTitle("Liked Videos");

  useEffect(() => {
    topRef.current.scrollTop = 0;
  }, []);

  return (
    <LikedResult
      isUserSignedIn={isUserSignedIn}
    />
  )
}

export default Liked;
