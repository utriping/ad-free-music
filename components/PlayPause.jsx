import React, { useRef, useEffect } from "react";

export default function PlayPause({ isPlaying, setIsPlaying, songUrl }) {
  const audioRef = useRef(null);

  useEffect(() => {
    console.log(songUrl);
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, songUrl]);

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  return (
    <div className="play-pause">
      {songUrl !== "" && isPlaying && (
        <audio ref={audioRef} src={songUrl} autoPlay />
      )}
      <div role="button" style={{ cursor: "pointer" }} onClick={togglePlay}>
        <i className={`fa fa-${isPlaying ? "pause" : "play"}`}></i>
      </div>
    </div>
  );
}
