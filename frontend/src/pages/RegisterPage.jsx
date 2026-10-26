import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RegisterUser } from "../api/auth";
import { ErrorMessage } from "../components/common/Feedback";
import "./AuthPages.css";

export function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await RegisterUser(username, email, password);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Registration failed:", err);
      setError(
        err.response?.data?.detail ||
          "Registration failed. Please check your email and password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link className="brand auth-brand" to="/">TaskFlow</Link>
        <h1>Create your account</h1>
        <p className="auth-description">Start planning and tracking your work.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="form-field" htmlFor="username">
            Username
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter username..."
              required
            />
          </label>
          <label className="form-field" htmlFor="email">
            Email
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              required
            />
          </label>
          <label className="form-field" htmlFor="password">
            Password
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              minLength={8}
              required
            />
          </label>
          <ErrorMessage>{error}</ErrorMessage>
          <button
            className="button button-primary auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Create account"}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/">Log in</Link>
        </p>
      </section>
    </main>
  );
}
