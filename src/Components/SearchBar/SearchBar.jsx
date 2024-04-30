import React, { useState, useEffect } from 'react';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';

function SearchBar({ fetchSuggestions, onSelection }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSuggestions([]);
        } else {
            const getSuggestions = async () => {
                const fetchedSuggestions = await fetchSuggestions(searchTerm);
                setSuggestions(fetchedSuggestions);
            };
            getSuggestions();
        }
    }, [searchTerm, fetchSuggestions]);

    const handleOnSearch = (string) => {
        setSearchTerm(string);
    };

    const handleOnSelect = (e, item) => {
        e.preventDefault();
        console.log("selected", item);
        onSelection(item); // Call the onSelect prop with the selected item
        setSearchTerm('');
    };

    const handleOnHover = (item) => {
        console.log('Hovered:', item);
    };

    const handleOnFocus = () => {
        console.log('The search input is focused');
    };

    const handleOnClear = () => {
        console.log('The search input is cleared');
        setSuggestions([]);
    };


    return (
        <div style={{ width: '18.75em', backgroundColor: "white", height: "2.25em", marginTop: "0.313em", zIndex: 1 }}>
            <ReactSearchAutocomplete
                items={suggestions}
                onSearch={handleOnSearch}
                onSelection={handleOnSelect}
                onHover={handleOnHover}
                onFocus={handleOnFocus}
                onClear={handleOnClear}
                placeholder=""
                styling={{
                    backgroundColor: "white",
                    height: "2em",
                    borderRadius: "0.625em",
                    padding: "0.625em",
                    fontFamily: "poppins",
                    fontSize: "14px",
                    boxShadow: "none",
                    border: "1px solid #8D9093",

                }}
            />
        </div>
    );
}

export default SearchBar;
