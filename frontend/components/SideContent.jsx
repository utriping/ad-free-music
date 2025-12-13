import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { supabase } from "../supabase";

export default function SideContent() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [displayPopUp, setDisplayPopUp] = useState(false);
  useEffect(() => {
    async function fetchDownloads() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const token = session?.access_token;

        const res = await fetch("http://localhost:5000/api/downloads", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const resData = await res.json();
        setData(resData.downloads);
      } catch (err) {
        console.log(err);
      }

      return () => {
        console.log("Done");
      };
    }

    fetchDownloads();
  }, []);
  const downloads = data
    .filter((element, ind, arr) => {
      return element.name.includes(inputValue);
    })
    .map((element, index, arr) => {
      console.log(element);
      return (
        <div key={index} className="downloadElements">
          {element.name}
        </div>
      );
    });

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      setQuery(inputValue);
    }
  }
  return (
    <>
      {displayPopUp ? (
        <div className="pop-up playlist-creator">
          <div className="inner-container">
            <div
              className={`search-content ${isFocused ? "search-focused" : ""}`}
            >
              <div className="header-icons search-icon">
                <i className="fas fa-search"></i>
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </div>
            <div>{downloads}</div>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="side-content">
        <h4 className="side-content-title">
          <i className="fas fa-music"></i> Playlists
        </h4>
        <div
          className="playlist-placeholder"
          style={{ cursor: "pointer" }}
          onClick={() => setDisplayPopUp(true)}
        >
          <i className="fas fa-folder-plus"></i>
          {data.length === 0 ? (
            <p>Download songs to create playlist</p>
          ) : (
            <p>Create a Playlist</p>
          )}
        </div>
      </div>
    </>
  );
}
