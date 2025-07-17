import React, { createContext, useState } from "react";

export const SongUrlContext = createContext('');
export default function SongUrlContextComponent({ children }) {
  const [songUrl, setSongUrl] = useState("");
  return (
    <SongUrlContext.Provider value={[songUrl, setSongUrl]}>
      {children}
    </SongUrlContext.Provider>
  );
}
