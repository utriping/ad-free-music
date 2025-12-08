import React, { useEffect, useState } from "react";

export default function SideContent() {
  return (
    <div className="side-content">
      <h4 className="side-content-title">
        <i className="fas fa-music"></i> Playlists
      </h4>
      <div className="playlist-placeholder">
        <i className="fas fa-folder-plus"></i>
        <p>Create your first playlist</p>
      </div>
    </div>
  );
}
