import React from 'react';
import './SearchInput.css';

const SearchInput = (props) => {

    const inputChangedHandler = (props, event) => {
        const searchTerm = event.target.value;
        props.showSuggestion(searchTerm);
    }

    const searchInputClass = "searchInput";

    return (
        <input type="text"
            spellCheck="false"
            className={searchInputClass}
            placeholder="Find Location"
            onChange={(event) => {inputChangedHandler(props, event)}}
            value={props.searchTerm}
        />
    )
};

export default SearchInput;