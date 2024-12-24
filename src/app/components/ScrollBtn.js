'use client'
import React, { useState, useEffect } from "react";

export default function ScrollButton() {
    const [isBottom, setIsBottom] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Check if the user is at the bottom of the page
            const scrolledToBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;
            setIsBottom(scrolledToBottom);
        };

        // Attach scroll listener
        window.addEventListener("scroll", handleScroll);

        // Clean up listener on unmount
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleClick = () => {
        if (isBottom) {
            // Scroll to top
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            // Scroll to bottom
            window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        }
    };

    return (
        <button
            onClick={handleClick}
            style={{
                position: "fixed",
                bottom: "20px",
                right: "10px",
                padding: "4px 8px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                zIndex: 1000,
            }}
        >
            {isBottom ? <i className="material-icons">keyboard_arrow_up</i> :
                <i className="material-icons">keyboard_arrow_down</i>}
        </button>
    );
}
