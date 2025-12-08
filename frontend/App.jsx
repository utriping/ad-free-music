import React, { useContext, useState } from "react";
import Header from "./components/Header";
import SideContent from "./components/SideContent";
import CardContainer from "./components/CardContainer";
import PlayPause from "./components/PlayPause";
import { SongUrlContext } from "./SongUrlContext";
import { useAuth } from "./AuthContext";
import LoadingPage from "./components/LoadingPage";

function App() {
  const [query, setQuery] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [songUrl, setSongUrl] = useContext(SongUrlContext);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading-state" style={{ minHeight: "100vh" }}>
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
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
      <PlayPause
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        songUrl={songUrl}
      />
    </div>
  );
}

export default App;
