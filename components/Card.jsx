import React from "react";

const CountryCard = ({ data, setSongUrl, isPlaying, setIsPlaying }) => {
  const { title, thumbnail, channel, url } = data;
  async function fetchSong() {
    try {
      const res = await fetch("http://localhost:5000/api/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url }),
      });
      const data = await res.json();
      console.log("downloaded ", data.url);
      setSongUrl(data.url);
      setIsPlaying(true);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    // When the card is clicked, send the video URL to the backend to retrieve the playable song URL
    <div
      className="country-card"
      role="button"
      onClick={fetchSong}
      style={{ cursor: "pointer" }}
    >
      <img src={thumbnail} alt={title} />
      <div className="card-text">
        <h3 className="card-title">{title}</h3>
        <p>{/* <b>{title}</b> */}</p>
        <p>
          <b>{channel}</b>
        </p>
        {/* <p>
          <b>{`${views} views`}</b>
        </p> */}
      </div>
    </div>
  );
};
export default CountryCard;
