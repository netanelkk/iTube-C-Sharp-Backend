import React, { useEffect, useState, useRef } from 'react'
import { suggestion } from "../../../api";
import VideoSuggestion from "../../video/videoBox/videoSuggestion"
import { useNavigate } from "react-router-dom";

/*
    Search
*/
var sugIndexValue = -1; // index value for keyboard navigation
const Search = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuggestions, setShowSuggetions] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sugIndex, setSugIndex] = useState(sugIndexValue);
    const [showSearch, setShowSearch] = useState(false);
    const inputRef = useRef(null);

    const navigate = useNavigate();
    const onQueryChange = (event) => {
        setShowSuggetions(true);
        setSearchQuery(event.target.value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        if (searchQuery !== "") {
            setShowSuggetions(false);
            inputRef.current.blur();
            // Checking if clicked on specific option or on show all results
            if (sugIndexValue < 0 || sugIndexValue === 4) {
                navigate(window.PATH + "/search/" + encodeURIComponent(encodeURIComponent((searchQuery))));
            } else {
                navigate(window.PATH + "/watch/" + data[sugIndexValue].Id);
            }
            setSugIndex(-1);
            sugIndexValue = -1;
        }
    };

    useEffect(() => {
        const getSuggestions = async () => {
            setLoading(true);
            const d = await suggestion(searchQuery);
            if (!d.pass) {
                setLoading(false);
                setShowSuggetions(false);
            } else {
                setData(d.Data);
                setLoading(false);
            }
        }
        if (searchQuery !== "")
            getSuggestions();
        else
            setShowSuggetions(false); // hiding all search suggestions if input is empty
    }, [searchQuery]);

    // Closing the search suggestions when clicking outside the area
    const wrapperRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggetions(false);
                setSugIndex(-1);
                sugIndexValue = -1;
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);


    // Keyboard navigation
    const onKeyPressed = (e) => {
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                sugIndexValue = (sugIndexValue + 1 < 5) ? sugIndexValue + 1 : sugIndexValue;
                setSugIndex(sugIndexValue);
                break;
            case "ArrowUp":
                e.preventDefault();
                sugIndexValue = (sugIndexValue - 1 >= 0) ? sugIndexValue - 1 : sugIndexValue;
                setSugIndex(sugIndexValue);
                break;
        }
    }

    return (
        <form onSubmit={onSubmit} id="search-form">
            <button
                type="submit"
                onClick={() => setShowSearch(true)}>
                <i className="bi bi-search"></i>
            </button>

            <div className={"search-bar-container" + (showSearch ? " show" : "")} ref={wrapperRef}>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={onQueryChange}
                    onKeyDown={onKeyPressed}
                    onFocus={() => { if (searchQuery !== "") { setShowSuggetions(true); } }}
                    ref={inputRef} />

                { showSuggestions &&
                    <div className="suggestions"
                        onClick={() => { setShowSuggetions(false); }}>

                        {loading && <div id="sug-loading"></div>}

                        {data.map((row, index) => (
                            <VideoSuggestion
                                key={row.Id}
                                video={row}
                                isActive={(index === sugIndex)} />))}

                        <div className={"suggestions-showmore" + ((sugIndex === 4) ? " active" : "")}
                            onClick={onSubmit}>
                            Show All Results
                        </div>
                    </div> }

                <div className='search-close'
                    onClick={() => { setSearchQuery(""); setShowSearch(false); }}>
                    <i className="bi bi-x"></i>
                </div>
            </div>
        </form>
    );
}

export default Search;