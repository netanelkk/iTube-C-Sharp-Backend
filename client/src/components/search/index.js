import React, { useEffect } from 'react'
import { useParams } from "react-router-dom";
import SearchResult from './result';

/*
    Search result page
*/
function Search({ setTitle, topRef }) {
  const { query } = useParams();
  setTitle(decodeURI(query));

  useEffect(() => {
    topRef.current.scrollTop = 0;
  }, []);

  return (
    <SearchResult
      key={query}
      query={query} />
  )
}

export default Search;
