import React, { createContext, useState } from "react";

export const DownloadingContext = createContext();
export default function DownloadContextComponent({ children }) {
  const [downloadState, setDownloadState] = useState({
    isDownloading: false,
    downloadingThis: null,
  });
  return (
    <DownloadingContext.Provider value={[downloadState, setDownloadState]}>
      {children}
    </DownloadingContext.Provider>
  );
}
