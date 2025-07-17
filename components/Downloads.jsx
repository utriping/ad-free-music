import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import DownloadCard from "./DownloadCard";

export default function Donwloads({ setSongUrl, setIsPlaying, isPlaying }) {
  const [downloads, setDownloads] = useState([]);
  useEffect(() => {
    async function getDownloads() {
      const { data, error } = await supabase.storage
        .from("songs") // your bucket name
        .list("public", {
          // '' = root directory; use 'folder-name' if needed
          limit: 100,
          offset: 0,
          sortBy: { column: "name", order: "asc" },
        });
      if (error) {
        console.error("Error fetching files:", error.message);
        return;
      }
      const getSongUrl = (fileName) => {
        const { data } = supabase.storage
          .from("songs")
          .getPublicUrl(`public/${fileName}`);
        return data.publicUrl;
      };

      // Transform your songs data to include URLs
      const songsWithUrls = data.map((song) => ({
        ...song,
        url: getSongUrl(song.name),
      }));
      setDownloads(songsWithUrls);
    }
    getDownloads();
  }, []);

  console.log(downloads);
  return (
    <>
      <main className="card-container">
        <h1>Downloads:</h1>
        {downloads.map((item, id) => {
          const reqData = {
            name: item.name,
            // thumbnail: item.snippet.thumbnails.medium.url,
            // channel: item.snippet.channelTitle,
            url: item.url,
          };
          // console.log(reqData.url);
          return (
            <DownloadCard
              data={reqData}
              key={id}
              setSongUrl={setSongUrl}
              setIsPlaying={setIsPlaying}
              isPlaying={isPlaying}
            />
          );
        })}
      </main>
    </>
  );
}
