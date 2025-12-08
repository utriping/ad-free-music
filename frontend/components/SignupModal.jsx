import React, { useState } from "react";
import { useAuth } from "../AuthContext";

export default function SignupModal({ onClose, onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
          <div className="success-message">
            <i className="fas fa-check-circle"></i>
            <h2>Account Created!</h2>
            <p>Please check your email to verify your account.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        <h2 className="modal-title">
          <i className="fas fa-user-plus"></i> Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="signup-email">
              <i className="fas fa-envelope"></i> Email
            </label>
            <input
              type="email"
              id="signup-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-password">
              <i className="fas fa-lock"></i> Password
            </label>
            <input
              type="password"
              id="signup-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="At least 6 characters"
              minLength={6}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">
              <i className="fas fa-lock"></i> Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
            />
          </div>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <>
                <div className="loading-spinner-small"></div> Creating
                account...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus"></i> Create Account
              </>
            )}
          </button>
          <p className="auth-switch">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="link-button"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
