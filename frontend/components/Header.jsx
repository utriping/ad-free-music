import React, { useState } from "react";
import Search from "./Search";
import { useAuth } from "../AuthContext";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

export default function Header({ setQuery }) {
  const { user, signOut } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <>
      <header className="header-container">
        <div className="logo-container">
          <h1 className="logo">Sangeet</h1>
        </div>
        <div className="home-and-search">
          <div className="icon-background home-icon" title="Home">
            <i className="fas fa-home"></i>
          </div>
          <Search setQuery={setQuery} />
        </div>
        <div className="header-actions">
          {user ? (
            <div className="user-menu">
              <div className="user-info">
                <i className="fas fa-user-circle"></i>
                <span className="user-email">{user.email}</span>
              </div>
              <button className="btn-logout" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          ) : (
            <>
              <button
                className="btn-signup"
                onClick={() => setShowSignup(true)}
              >
                Sign Up
              </button>
              <button className="btn-login" onClick={() => setShowLogin(true)}>
                Login
              </button>
            </>
          )}
        </div>
      </header>
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSwitchToSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
        />
      )}
      {showSignup && (
        <SignupModal
          onClose={() => setShowSignup(false)}
          onSwitchToLogin={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        />
      )}
    </>
  );
}
