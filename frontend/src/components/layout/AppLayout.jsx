import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logoutUser } from "../../api/auth";
import "./AppLayout.css";

export function AppLayout() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logoutUser();
    navigate("/", { replace: true });
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="app-shell">
      <header className="app-header">
        <NavLink className="brand" to="/dashboard">
          <span className="brand-mark" aria-hidden="true">T</span>
          <span>TaskFlow</span>
        </NavLink>
        <button
          className={`mobile-menu-button ${menuOpen ? "is-open" : ""}`}
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav
          id="primary-navigation"
          className={`primary-nav ${menuOpen ? "is-open" : ""}`}
          aria-label="Main navigation"
        >
          <NavLink to="/dashboard" onClick={closeMenu}>Dashboard</NavLink>
          <NavLink to="/tasks" onClick={closeMenu}>Tasks</NavLink>
          <NavLink to="/spaces" onClick={closeMenu}>Spaces</NavLink>
          <NavLink to="/profile" onClick={closeMenu}>Profile</NavLink>
        </nav>
        <button className="button button-quiet logout-button" onClick={handleLogout}>
          Log out
        </button>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
