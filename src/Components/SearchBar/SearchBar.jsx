import React, { useState, useEffect, useRef } from "react";
import "./SearchBar.css";

const SearchBar = ({ searchTerm, setSearchTerm, onSelectSuggestion, fetchSuggestions }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [noSuggestions, setNoSuggestions] = useState(false);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
    const timeoutRef = useRef(null);
    const containerRef = useRef(null);

    const handleInputChange = async (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (term) {
            setShowSuggestions(true);
            const fetchedSuggestions = await fetchSuggestions(term);
            setSuggestions(Array.isArray(fetchedSuggestions) ? fetchedSuggestions : []);
            setNoSuggestions(Array.isArray(fetchedSuggestions) && fetchedSuggestions.length === 0);
            resetTimeout();
        } else {
            setShowSuggestions(false);
            setSuggestions([]);
            setNoSuggestions(false);
        }
    };

    const handleSuggestionSelect = (suggestion) => {
        onSelectSuggestion(suggestion);
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
        clearTimeout(timeoutRef.current);
    };

    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            setActiveSuggestionIndex((prevIndex) =>
                prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
            );
            resetTimeout();
        } else if (e.key === "ArrowUp") {
            setActiveSuggestionIndex((prevIndex) =>
                prevIndex > 0 ? prevIndex - 1 : 0
            );
            resetTimeout();
        } else if (e.key === "Enter" && activeSuggestionIndex >= 0) {
            handleSuggestionSelect(suggestions[activeSuggestionIndex]);
        }
    };

    const resetTimeout = () => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setShowSuggestions(false);
        }, 5000);
    };

    useEffect(() => {
        if (showSuggestions) {
            resetTimeout();
        }
        return () => {
            clearTimeout(timeoutRef.current);
        };
    }, [showSuggestions]);

    const handleMouseEnter = () => {
        clearTimeout(timeoutRef.current);
    };

    const handleMouseLeave = () => {
        resetTimeout();
    };

    const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            setShowSuggestions(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={containerRef} style={{ position: "relative", width: "350px" }}>
            <input
                type="text"
                placeholder=""
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                className="search-input"
                onFocus={() => setShowSuggestions(true)}
            />

            {showSuggestions && (
                <div 
                    className="suggestions-dropdown"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {noSuggestions ? (
                        <div className="suggestion-item no-suggestions">Search Record Not Found</div>
                    ) : (
                        suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className={`suggestion-item ${index === activeSuggestionIndex ? "active" : ""}`}
                                onClick={() => handleSuggestionSelect(suggestion)}
                            >
                                {suggestion.displayText}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
