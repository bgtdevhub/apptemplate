import React from 'react';
import './SearchSuggestions.css';

const capitalizeFirstLetterInString = myString => {
  const splitString = myString.split(' ');

  const upperCaseString = splitString.map(el => {
    if (el[0] === '(') {
      if (el[1] !== undefined) {
        return '(' + el[1].toUpperCase() + el.slice(2);
      }

      return el;
    } else {
      if (el[0] !== undefined) {
        return el[0].toUpperCase() + el.slice(1);
      }

      return el;
    }
  })

  return upperCaseString.join(' ');
}

const highlightSearchTerm = (myString, searchTerm) => {

  searchTerm = searchTerm.trim();

  const highlightString = myString.replace(searchTerm, "<b>" + searchTerm + "</b>");
  return {__html: highlightString};
}

const SearchSuggestions = (props) => {

  const searchResultsClass = "resultsPane";
  const searchResultsClassHidden = ["resultsPane hidden"];

  return (
    <div className={props.visible ? searchResultsClass : searchResultsClassHidden}>
      {
        props.vmAddressSuggestions.length ? <div className="headerLabel">Address</div> : <div></div>
      }
      {
        props.vmAddressSuggestions.map((el, index) => {
          return (          
            <div key={index}
              className="suggestionText"
              onClick={(event) => props.doSearch(capitalizeFirstLetterInString(el.text.toLowerCase()), "address")}
              dangerouslySetInnerHTML={highlightSearchTerm(capitalizeFirstLetterInString(el.text.toLowerCase()), capitalizeFirstLetterInString(props.searchTerm.toLowerCase()))}  
            >
            </div>
          )
        })
      }
      {
        props.vmLocalitySuggestions.length ? <div className="headerLabel">Locality</div> : <div></div>
      }
      {
        props.vmLocalitySuggestions.map((el, index) => {
          return (          
            <div key={index}
              className="suggestionText"
              onClick={(event) => props.doSearch(capitalizeFirstLetterInString(el.text.toLowerCase()), "locality")}
              dangerouslySetInnerHTML={highlightSearchTerm(capitalizeFirstLetterInString(el.text.toLowerCase()), capitalizeFirstLetterInString(props.searchTerm.toLowerCase()))}
            >
            </div>
          )
        })
      }
    </div>
  )
};

export default SearchSuggestions;