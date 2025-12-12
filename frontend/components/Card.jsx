import React, { useContext, useState } from "react";
import { useAuth } from "../AuthContext";
import { supabase } from "../supabase";
import LoadingPage from "./LoadingPage.jsx";
import { DownloadingContext } from "../DownloadingContext.jsx";

const Card = ({ data, setSongUrl, isPlaying, setIsPlaying, index }) => {
  const { title, thumbnail, channel, url } = data;

  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadState, setDownloadState] = useContext(DownloadingContext);
  const { user } = useAuth();
  async function fetchSong() {
    if (downloadState.isDownloading) {
      return;
    }
    if (isPlaying) {
      setIsPlaying(false);
    }

    if (!user) {
      alert("Please login to play songs");
      return;
    }
    setDownloadState({ isDownloading: true, downloadingThis: data });
    setIsLoading((prev) => !prev);
    try {
      // Get the current session token
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("Not authenticated");
      }

      const res = await fetch("http://localhost:5000/api/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ url: url }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to extract song");
      }

      const data = await res.json();
      console.log("downloaded ", data.url);
      setSongUrl(data.url);
      setIsPlaying(true);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to play song. Please try again.");
    } finally {
      setIsLoading(false);
      setDownloadState({
        isDownloading: false,
        downloadingThis: null,
      });
    }
  }

  return (
    // When the card is clicked, send the video URL to the backend to retrieve the playable song URL
    <div
      className="country-card"
      role="button"
      onClick={fetchSong}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: "pointer",
        animationDelay: `${index * 0.05}s`,
      }}
    >
      <div className="card-image-wrapper">
        <img src={thumbnail} alt={title} />
        {isHovered && (
          <div className="play-overlay">
            <i
              className={`fas fa-${isLoading ? "spinner fa-spin" : "play"}`}
            ></i>
          </div>
        )}
      </div>
      <div className="card-text">
        <h3 className="card-title">{title}</h3>
        <p className="card-channel">
          <i className="fas fa-user"></i> {channel}
        </p>
      </div>
    </div>
  );
};
export default Card;
