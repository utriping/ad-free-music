import React, { useContext } from "react";
import { SongUrlContext } from "../SongUrlContext";

const DownloadCard = ({ data, setSongUrl, isPlaying, setIsPlaying }) => {
  const { name, url } = data;

  function getSong() {
    // try {
    //   const res = await fetch("http://localhost:5000/api/extract", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ url: url }),
    //   });
    //   const data = await res.json();
    //   console.log("downloaded ", data.url);

    setSongUrl(url);
    setIsPlaying(true);
    
    // songUrl ? setIsPlaying(true) : "";
  }
  return (
    // When the card is clicked, send the video URL to the backend to retrieve the playable song URL
    <div
      className="country-card"
      role="button"
      onClick={getSong}
      style={{ cursor: "pointer" }}
    >
      <img src={`/`} alt={``} />
      <div className="card-text">
        <h3 className="card-title">{name}</h3>
        <p>{/* <b>{title}</b> */}</p>
        <p>
          <b>{name}</b>
        </p>
        {/* <p>
          <b>{`${views} views`}</b>
        </p> */}
      </div>
    </div>
  );
};
export default DownloadCard;
