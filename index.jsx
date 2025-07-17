import React from "react";
import ReactDOM, { createRoot } from "react-dom/client";
import App from "./App.jsx";
import SongUrlContextComponent from "./SongUrlContext.jsx";
const root = createRoot(document.querySelector("#root"));
root.render(
  <SongUrlContextComponent>
    <App />
  </SongUrlContextComponent>
);
