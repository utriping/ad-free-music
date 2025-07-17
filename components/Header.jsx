import React from "react";
import Search from "./Search";

export default function Header({ setQuery }) {
  //logo,{home button, search bar:{search icon, search input, browse(through downloaded)}}, list:{premium,support, download}, install app, {sign-up, login}
  return (
    <header className="header-container">
      <div>
        <h1>Sangeet</h1>
      </div>
      <div className="home-and-search">
        <div className="icon-background">
          <i className="fas fa-home"></i>
        </div>
        <Search setQuery={setQuery} />
      </div>
      <ul className="header-content">
        <li>Premium</li>
        <li>Support</li>
        <li>Download</li>
      </ul>
      <div>Install App</div>
      <div>Sign-up</div>
      <div>Login</div>
    </header>
  );
}
