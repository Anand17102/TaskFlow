import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { ErrorMessage } from "../components/common/Feedback";
import "./AuthPages.css";

export function LoginPage() {
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
      await loginUser(email, password);
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      console.error("Login failed:", requestError);
      setError(
        requestError.response?.data?.detail ||
          "Login failed. Please check your email and password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link className="brand auth-brand" to="/">
          TaskFlow
        </Link>
        <h1>Welcome back</h1>
        <p className="auth-description">
          Log in to continue organizing your work.
        </p>
        <form className="auth-form" onSubmit={handleSubmit}>
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
              required
            />
          </label>
          <ErrorMessage>{error}</ErrorMessage>
          <button
            className="button button-primary auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
        <p className="auth-footer">
          Not signed up yet? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}
