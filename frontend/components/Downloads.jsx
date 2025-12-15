import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useAuth } from "../AuthContext";
import DownloadCard from "./DownloadCard";

export default function Donwloads({ setSongUrl, setIsPlaying, isPlaying }) {
  const [downloads, setDownloads] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function getDownloads() {
      setIsLoading(true);
      setError(null);

      // Only fetch downloads if user is logged in
      if (!user) {
        setDownloads([]);
        setIsLoading(false);
        return;
      }

      try {
        const userId = user.id;
        // List files in the user-specific folder: public/{userId}/
        const userFolder = `public/${userId}/Downloads`;

        let { data, error: listError } = await supabase.storage
          .from("songs")
          .list(userFolder, {
            limit: 100,
            offset: 0,
            sortBy: { column: "name", order: "desc" }, // Most recent first
          });

        if (listError) {
          // If user folder doesn't exist yet, they have no downloads
          if (
            listError.message?.includes("not found") ||
            listError.statusCode === "404"
          ) {
            setDownloads([]);
            setIsLoading(false);
            return;
          }
          throw new Error(listError.message || "Failed to fetch downloads");
        }

        if (!data || data.length === 0) {
          setDownloads([]);
          setIsLoading(false);
          return;
        }

        const getSongUrl = (fileName) => {
          const { data: urlData } = supabase.storage
            .from("songs")
            .getPublicUrl(`${userFolder}/${fileName}`);
          return urlData.publicUrl;
        };

        // Transform songs data to include URLs and clean up filenames
        const songsWithUrls = data
          .filter((song) => song.name && !song.name.endsWith(".part")) // Filter out incomplete downloads
          .map((song) => {
            // Extract original filename (remove timestamp prefix)
            const originalName = song.name
              .replace(/^\d+-/, "")
              .replace(/\.mp3$/, "");
            return {
              ...song,
              name: originalName,
              url: getSongUrl(song.name),
            };
          });

        setDownloads(songsWithUrls);
        setError(null);
      } catch (err) {
        console.error("Error fetching downloads:", err);
        setError(
          err.message ||
            "Failed to load downloads. Please check your Supabase configuration."
        );
        setDownloads([]);
      } finally {
        setIsLoading(false);
      }
    }
    getDownloads();
  }, [user]);

  return (
    <>
      <main className="card-container">
        <h1>
          <i className="fas fa-download"></i>
          Downloads
        </h1>
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading downloads...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            <p>{error}</p>
            <p className="error-hint">
              Make sure the "songs" bucket exists in your Supabase storage and
              has proper permissions.
            </p>
          </div>
        ) : !user ? (
          <div className="empty-state">
            <i className="fas fa-sign-in-alt"></i>
            <p>Please login to view your downloads</p>
          </div>
        ) : downloads.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-folder-open"></i>
            <p>No downloads yet. Start downloading your favorite songs!</p>
          </div>
        ) : (
          <div className="cards-grid">
            {downloads.map((item, id) => {
              const reqData = {
                name: item.name,
                url: item.url,
              };
              return (
                <DownloadCard
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
    </>
  );
}
