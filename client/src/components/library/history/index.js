import React, { useEffect } from 'react'
import HistoryResult from './result';

/*
    History page
    Showing user's view history
*/
function History({ isUserSignedIn, setTitle, topRef }) {
  setTitle("Watch History");

  useEffect(() => {
    topRef.current.scrollTop = 0;
  }, []);

  return (
    <HistoryResult
      isUserSignedIn={isUserSignedIn}
    />
  )
}

export default History;
