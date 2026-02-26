import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './Navbar.scss';

const Navbar = () => {
    const { user, logout, isLoggedIn } = useAuth();
    const { showToast } = useToast();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    const handleLogout = () => {
        logout();
        showToast('You have been logged out', 'info');
        navigate('/');
    };

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/assignments', label: 'Assignments' },
    ];

    return (
        <>
            <nav className="navbar" role="navigation" aria-label="Main navigation">
                <div className="navbar__inner">
                    {/* Logo */}
                    <Link to="/" className="navbar__logo" aria-label="CipherSQLStudio Home">
                        <span className="navbar__logo-text">
                            Cipher<span>SQL</span>Studio
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="navbar__nav" aria-label="Primary navigation">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`navbar__link ${isActive(link.path) ? 'navbar__link--active' : ''}`}
                                aria-current={isActive(link.path) ? 'page' : undefined}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="navbar__actions">
                        {isLoggedIn ? (
                            <div className="navbar__user" onClick={handleLogout} title="Click to logout" role="button" tabIndex={0}>
                                <div className="navbar__user-avatar" aria-hidden="true">
                                    {user?.username?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <span>{user?.username}</span>
                                <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>↗</span>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn--ghost btn--sm">Login</Link>
                                <Link to="/register" className="btn btn--primary btn--sm">Sign Up</Link>
                            </>
                        )}

                        {/* Mobile hamburger */}
                        <button
                            className="navbar__mobile-toggle"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-expanded={mobileOpen}
                            aria-label="Toggle mobile menu"
                        >
                            {mobileOpen ? '✕' : '☰'}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="mobile-menu" role="menu">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`mobile-menu__link ${isActive(link.path) ? 'mobile-menu__link--active' : ''}`}
                            onClick={() => setMobileOpen(false)}
                            role="menuitem"
                        >
                            {link.label}
                        </Link>
                    ))}
                    {isLoggedIn && (
                        <button className="btn btn--ghost" onClick={handleLogout} style={{ alignSelf: 'flex-start' }}>
                            Logout
                        </button>
                    )}
                </div>
            )}
        </>
    );
};

export default Navbar;