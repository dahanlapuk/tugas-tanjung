import { Link } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../../stores/authStore';
import useCartStore from '../../stores/cartStore';
import './Header.css';

const Header = () => {
    const { user, isAuthenticated, logout } = useAuthStore();
    const { getTotalItems } = useCartStore();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    {/* Logo */}
                    <Link to="/" className="logo">
                        <span className="logo-icon">🍜</span>
                        <span className="logo-text">Bakso Raden</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="nav-desktop">
                        <Link to="/" className="nav-link">Beranda</Link>
                        <Link to="/products" className="nav-link">Menu</Link>
                        {isAuthenticated && (
                            <Link to="/orders" className="nav-link">Pesanan Saya</Link>
                        )}
                    </nav>

                    {/* Actions */}
                    <div className="header-actions">
                        {/* Cart */}
                        <Link to="/cart" className="cart-button">
                            <svg className="cart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {getTotalItems() > 0 && (
                                <span className="cart-badge">{getTotalItems()}</span>
                            )}
                        </Link>

                        {/* User Menu */}
                        {isAuthenticated ? (
                            <div className="user-menu">
                                <Link to="/profile" className="btn btn-outline btn-sm">
                                    {user?.name || 'Profile'}
                                </Link>
                                <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="auth-buttons">
                                <Link to="/login" className="btn btn-outline btn-sm">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-primary btn-sm">
                                    Daftar
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            className="mobile-menu-toggle"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <nav className="nav-mobile">
                        <Link to="/" className="nav-link-mobile" onClick={() => setMobileMenuOpen(false)}>
                            Beranda
                        </Link>
                        <Link to="/products" className="nav-link-mobile" onClick={() => setMobileMenuOpen(false)}>
                            Menu
                        </Link>
                        {isAuthenticated && (
                            <Link to="/orders" className="nav-link-mobile" onClick={() => setMobileMenuOpen(false)}>
                                Pesanan Saya
                            </Link>
                        )}
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;
