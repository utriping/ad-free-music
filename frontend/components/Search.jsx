import React, { useState } from "react";

export default function Search({ setQuery }) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      setQuery(inputValue);
    }
  }

  return (
    <div className={`search-content ${isFocused ? "search-focused" : ""}`}>
      <div className="header-icons search-icon">
        <i className="fas fa-search"></i>
      </div>
      <input
        type="text"
        placeholder="What do you want to play?"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <div className="header-icons browse-icon" title="Browse Downloads">
        <i className="fas fa-folder-open"></i>
      </div>
    </div>
  );
}
