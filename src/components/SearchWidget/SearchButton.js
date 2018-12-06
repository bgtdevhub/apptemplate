import React from 'react';
import './SearchButton.css';

const SearchButton = (props) => {

    const buttonFontClasses = ['esri-icon-search searchButtonFont'];

    return (
        <div className="searchButton">
            <i className={buttonFontClasses}></i>
        </div>
    )
}

export default SearchButton;