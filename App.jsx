import React, { useContext, useState } from "react";
import Header from "./components/Header";
import SideContent from "./components/SideContent";
import CardContainer from "./components/CardContainer";
import PlayPause from "./components/PlayPause";
import SongUrlContextComponent, { SongUrlContext } from "./SongUrlContext";

function App() {
  const [query, setQuery] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [songUrl, setSongUrl] = useContext(SongUrlContext);
  return (
    <>
      <Header setQuery={setQuery} />
      <main className="main-content">
        <SideContent />
        <CardContainer
          query={query}
          setSongUrl={setSongUrl}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
        />
      </main>
      {songUrl !== "" && (
        <PlayPause
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          songUrl={songUrl}
        />
      )}
    </>
  );
}

export default App;
