import React, { useState } from "react";

const DownloadCard = ({ data, setSongUrl, isPlaying, setIsPlaying, index }) => {
  const { name, url } = data;
  const [isHovered, setIsHovered] = useState(false);

  function getSong() {
    setSongUrl(url);
    setIsPlaying(true);
  }

  return (
    <div
      className="country-card download-card"
      role="button"
      onClick={getSong}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: "pointer",
        animationDelay: `${index * 0.05}s`,
      }}
    >
      <div className="card-image-wrapper">
        <div className="download-card-image">
          <i className="fas fa-music"></i>
        </div>
        {isHovered && (
          <div className="play-overlay">
            <i className="fas fa-play"></i>
          </div>
        )}
      </div>
      <div className="card-text">
        <h3 className="card-title">
          {name.replaceAll("_-_", " - ").replaceAll("_", " ")}
        </h3>
        <p className="card-channel">
          <i className="fas fa-download"></i> Downloaded
        </p>
      </div>
    </div>
  );
};
export default DownloadCard;
