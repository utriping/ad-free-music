import React, { useState } from "react";

export default function Search({ setQuery }) {
  const [inputValue, setInputValue] = useState("");
  function handleKeyDown(e) {
    if (e.key === "Enter") {
      setQuery(inputValue);
    }
  }
  return (
    <div className="search-content">
      <div className="header-icons">
        <i className="fas fa-search"></i>
      </div>
      <input
        type="text"
        placeholder="What do you want to play?"
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="header-icons">
        <i className="fas fa-folder-open"></i>
      </div>
    </div>
  );
}
