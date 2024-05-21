import React, { useState } from "react";
import "./SearchBar.css";


const SearchBar = ({ searchTerm, setSearchTerm, onSelectSuggestion, fetchSuggestions }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [noSuggestions, setNoSuggestions] = useState(false);

    const handleInputChange = async (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (term) {
            setShowSuggestions(true);
            const fetchedSuggestions = await fetchSuggestions(term);
            setSuggestions(fetchedSuggestions);
            setNoSuggestions(fetchedSuggestions.length === 0);
        } else {
            setShowSuggestions(false);
            setSuggestions([]);
        }
    };


    const handleSuggestionSelect = (suggestion) => {
        onSelectSuggestion(suggestion);
        setShowSuggestions(false);
    };

    return (
        <div style={{ position: "relative", width: "350px" }}>
            <input
                type="text"
                placeholder=""
                value={searchTerm}
                onChange={handleInputChange}
                autoComplete="off"
                className="search-input"
            />
      
            {showSuggestions && (
                <div className="suggestions-dropdown">
                    {noSuggestions ? (
                        <div className="suggestion-item no-suggestions">Search Result Not Found</div>
                    ) : (
                        suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className="suggestion-item"
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