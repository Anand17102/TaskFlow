import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="empty-state">
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link className="button button-primary" to="/dashboard">Go to dashboard</Link>
    </section>
  );
}
