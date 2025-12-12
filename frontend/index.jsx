import React from "react";
import ReactDOM, { createRoot } from "react-dom/client";
import App from "./App.jsx";
import SongUrlContextComponent from "./SongUrlContext.jsx";
import { AuthProvider } from "./AuthContext.jsx";
import DownloadingContextComponent, {
  DownloadingContext,
} from "./DownloadingContext.jsx";

const root = createRoot(document.querySelector("#root"));
root.render(
  <DownloadingContextComponent>
    <AuthProvider>
      <SongUrlContextComponent>
        <App />
      </SongUrlContextComponent>
    </AuthProvider>
  </DownloadingContextComponent>
);
