import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { supabase } from "../supabase";

export default function SideContent() {
  const [data, setData] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [displayPopUp, setDisplayPopUp] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  useEffect(() => {
    async function fetchDownloads() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const token = session?.access_token;
        if (!token) {
          console.warn("No access token found");
          return;
        }
        const res = await fetch(
          "https://ad-free-music.vercel.app/api/downloads",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const resData = await res.json();
        const dataWithId = resData.downloads?.map((song, ind) => {
          return { ...song, id: ind };
        });
        setData(dataWithId);
      } catch (err) {
        console.log(err);
      }

      return () => {
        console.log("Done");
      };
    }

    fetchDownloads();
  }, []);

  function toggleCheckbox(id) {
    setSelectedSongId((prev) =>
      prev.includes(id) ? prev.filter((songId) => songId != id) : [...prev, id]
    );
  }

  const downloads = data
    ?.filter((element, ind, arr) => {
      return element.name.toLowerCase().includes(inputValue);
    })
    .map((element, index, arr) => {
      console.log(element);
      return (
        <div key={index} className="downloadElements">
          <label htmlFor="songs">
            <input
              type="checkbox"
              onChange={() => toggleCheckbox(element.id)}
            />
          </label>
          {element.name.replaceAll("_-_", " - ").replaceAll("_", " ")}
        </div>
      );
    });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!playlistName) return;
    const selectedSongs = data.filter((song) => {
      return selectedSongId.includes(song.id);
    });
    if (selectedSongs?.length == 0) return;
    const data = {
      name: playlistName,
      songs: selectedSongs,
    };
    fetch("https://ad-free-music.vercel.app/api/create-playlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  function handleKeyDown1(e) {
    if (e.key === "Enter") {
      setQuery(inputValue);
    }
  }

  function handleKeyDown2(e) {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  }
  console.log(data);
  return (
    <>
      {displayPopUp ? (
        <div className="pop-up playlist-creator">
          <form className="inner-container" onSubmit={handleSubmit}>
            <input type="text" placeholder="Enter Name of the Playlist..." />
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
                onKeyDown={handleKeyDown1}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </div>

            <div>{downloads}</div>
            <button
              className="save-playlist"
              role="submit"
              onKeyDown={handleKeyDown2}
            >
              Save Playlist
            </button>
          </form>
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
          {data?.length > 0 ? (
            <p>Create a Playlist</p>
          ) : (
            <p>Download songs to create playlist</p>
          )}
        </div>
      </div>
    </>
  );
}
