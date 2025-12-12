import React, { useContext, useEffect, useState } from "react";
import Card from "./Card";
import sample from "../sample.json";
import { supabase } from "../supabase";
import Downloads from "./Downloads";
import Donwloads from "./Downloads";
import dotenv from "dotenv";
import { DownloadingContext } from "../DownloadingContext";
dotenv.config();
export default function CardContainer({
  query,
  setSongUrl,
  setIsPlaying,
  isPlaying,
}) {
  const [songsData, setSongsData] = useState([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // const apiKey = process.env.PARCEL_YOUTUBE_API_KEY;
  const apiKey = "AIzaSyCmBVAEHesCcl8xCYCtQIruse0UMUGHeD4";
  const maxResults = 20;
  useEffect(() => {
    async function getData() {
      if (query === "") {
        setIsLoading(false);
        setError(false);
        //downloads matlab storage ke buckets me se jitne bhi songs downloaded hai unko fetch karna hai and idhar dikhana hai
        // const { data, error } = await supabase.storage
        //   .from("songs") // your bucket name
        //   .list("", {
        //     // '' = root directory; use 'folder-name' if needed
        //     limit: 100,
        //     offset: 0,
        //     sortBy: { column: "name", order: "asc" },
        //   });
        // if (error) {
        //   console.error("Error fetching files:", error.message);
        //   return;
        // }
        // console.log(data);
      } else if (query === "eminem") {
        setIsLoading(false);
        setError(false);
        setSongsData(sample.items);
        return;
      } else {
        setIsLoading(true);
        setError(false);
        try {
          const res = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${apiKey}&maxResults=${maxResults}`
          );
          const data = await res.json();
          console.log(data);
          setSongsData(data.items || []);
          setIsLoading(false);
        } catch (err) {
          console.log(err);
          setError(true);
          setSongsData([]);
          setIsLoading(false);
        }
      }
    }
    getData();
  }, [query]);

  //when query==='' show all the downloaded songs until now
  //   else show the first 20 search results based on the query
  return (
    <>
      {query === "" ? (
        <Donwloads
          setSongUrl={setSongUrl}
          setIsPlaying={setIsPlaying}
          isPlaying={isPlaying}
        />
      ) : (
        <main className="card-container">
          <h1>
            <i className="fas fa-music"></i>
            {query ? `Songs for "${query}"` : "Discover Music"}
          </h1>
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              <p>Oops! Something went wrong. Please try again.</p>
            </div>
          )}
          {!error && isLoading && query && (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Searching for songs...</p>
            </div>
          )}
          {!error && !isLoading && songsData.length === 0 && query && (
            <div className="empty-state">
              <i className="fas fa-search"></i>
              <p>No songs found. Try a different search term.</p>
            </div>
          )}
          {!error && songsData.length > 0 && (
            <div className="cards-grid">
              {songsData.map((item, id) => {
                const reqData = {
                  title: item.snippet.title,
                  thumbnail: item.snippet.thumbnails.medium.url,
                  channel: item.snippet.channelTitle,
                  url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                };
                return (
                  <Card
                    data={reqData}
                    key={id}
                    index={id}
                    setSongUrl={setSongUrl}
                    setIsPlaying={setIsPlaying}
                    isPlaying={isPlaying}
                  />
                );
              })}
            </div>
          )}
        </main>
      )}
    </>
  );
}
