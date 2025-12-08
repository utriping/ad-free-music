import React, { useRef, useEffect, useState } from "react";

export default function PlayPause({ isPlaying, setIsPlaying, songUrl }) {
  const audioRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const setAudioRef = (el) => {
    console.log(el);
    audioRef.current = el;
    if (el && isPlaying) {
      el.play().catch(() => {});
    }
  };
  useEffect(() => {
    //for the first time, when we click a song the url is set and isPlaying is true but we cannot get the music playing because this useEffect runs before the audioref component is mounted and thus returns
    // how to fix this
    // you can pass a function as a ref
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (songUrl !== "") {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [songUrl]);

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  if (!isVisible) return null;

  return (
    <div className={`play-pause ${isVisible ? "play-pause-visible" : ""}`}>
      {songUrl && (
        <audio
          ref={setAudioRef}
          src={songUrl}
          onEnded={() => setIsPlaying(false)}
        />
      )}
      <div className="player-controls">
        <button
          className="play-pause-btn"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          <i className={`fas fa-${isPlaying ? "pause" : "play"}`}></i>
        </button>
        <div className="player-info">
          <span className="now-playing">Now Playing</span>
        </div>
      </div>
    </div>
  );
}
