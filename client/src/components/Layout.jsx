import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <div className="header-brand">
            <Link to="/" className="logo">
              Inked
            </Link>
            <p className="tagline">Share your thoughts</p>
          </div>
          <nav className="header-nav">
            {user ? (
              <>
                <span className="nav-user">Hi, {user.name}</span>
                <button type="button" className="btn btn-nav" onClick={handleLogout}>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="btn btn-nav">
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-nav btn-nav-primary">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="container">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>Posts are stored in PostgreSQL and persist between sessions.</p>
        </div>
      </footer>
    </div>
  );
}
