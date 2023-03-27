import React, { useState, useRef, useEffect } from 'react'
import { AddLinks } from 'react-link-text';

function ToggleButton() {
    const [descToggle, setDescToggle] = useState("Show More");
    const toggleDescription = (e) => { 
         setDescToggle((descToggle=="Show More") ? "Show Less" : "Show More");
         e.target.parentElement.classList.toggle('open');
     };

    return (
    <button className="a" onClick={toggleDescription}>{descToggle}</button>
    );
}

/*
    Video's description
    If its too long, "Show more" will appear
*/
const Description = ({ desc }) => {
    const [showMore, setShowMore] = useState(false);
    const ref = useRef();
    useEffect(() => {
        if (ref.current.clientHeight > 100) {
            setShowMore(true);
        }
    }, []);

    return (
        <div className={"description" + (!showMore ? " open" : "")}>
            <h3>Description</h3>
            <p ref={ref}><AddLinks options={{ className: "a" }}>{desc}</AddLinks></p>
            <ToggleButton />
        </div>
    )
}

export default Description;