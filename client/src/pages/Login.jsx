import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import useAuthStore from '../stores/authStore';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.username || !formData.password) {
            setError('Username dan password harus diisi');
            return;
        }

        try {
            setLoading(true);
            const response = await authAPI.login(formData);

            if (response.data.success) {
                setAuth(response.data.user, response.data.token);
                navigate('/');
            }
        } catch (err) {
            setError(err.message || 'Login gagal. Periksa username dan password Anda.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="container">
                <div className="auth-container">
                    <div className="auth-card">
                        {/* Header */}
                        <div className="auth-header">
                            <div className="auth-logo">🍜</div>
                            <h1>Selamat Datang Kembali!</h1>
                            <p>Login untuk melanjutkan belanja Anda</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="alert alert-error">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="username" className="form-label">
                                    Username atau Email
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Masukkan username atau email"
                                    autoComplete="username"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password" className="form-label">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Masukkan password"
                                    autoComplete="current-password"
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                style={{ width: '100%' }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                                        <span>Memproses...</span>
                                    </>
                                ) : (
                                    'Login'
                                )}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="auth-footer">
                            <p>
                                Belum punya akun?{' '}
                                <Link to="/register" className="auth-link">
                                    Daftar Sekarang
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Side Image */}
                    <div className="auth-side">
                        <div className="auth-side-content">
                            <h2>Nikmati Kelezatan Mie Ayam & Bakso</h2>
                            <p>100% Daging Sapi Pilihan</p>
                            <div className="auth-features">
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Gratis Ongkir min. Rp 150.000</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Promo Spesial Setiap Hari</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Pengiriman Cepat & Aman</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
