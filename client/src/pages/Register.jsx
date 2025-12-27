import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import './Login.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        address: ''
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

        // Validation
        if (!formData.name || !formData.email || !formData.username || !formData.password) {
            setError('Semua field wajib diisi');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password minimal 6 karakter');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Password tidak cocok');
            return;
        }

        try {
            setLoading(true);
            const response = await authAPI.register({
                name: formData.name,
                email: formData.email,
                username: formData.username,
                password: formData.password,
                phoneNumber: formData.phoneNumber,
                address: formData.address
            });

            if (response.data.success) {
                alert('Registrasi berhasil! Silakan login.');
                navigate('/login');
            }
        } catch (err) {
            setError(err.message || 'Registrasi gagal. Silakan coba lagi.');
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
                            <h1>Daftar Akun Baru</h1>
                            <p>Bergabung dan nikmati promo spesial</p>
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

                        {/* Register Form */}
                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">Nama Lengkap *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Masukkan nama lengkap"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Email *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="nama@email.com"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="username" className="form-label">Username *</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Pilih username"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phoneNumber" className="form-label">No. Telepon</label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="08xxxxxxxxxx"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="address" className="form-label">Alamat</label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="form-textarea"
                                    placeholder="Alamat lengkap untuk pengiriman"
                                    rows="3"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password" className="form-label">Password *</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Minimal 6 karakter"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword" className="form-label">Konfirmasi Password *</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Ulangi password"
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
                                    'Daftar Sekarang'
                                )}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="auth-footer">
                            <p>
                                Sudah punya akun?{' '}
                                <Link to="/login" className="auth-link">
                                    Login Disini
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Side Image */}
                    <div className="auth-side">
                        <div className="auth-side-content">
                            <h2>Bergabung dengan Bakso Raden</h2>
                            <p>Dapatkan berbagai keuntungan</p>
                            <div className="auth-features">
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Promo Eksklusif Member</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Gratis Ongkir Pertama</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Poin Reward Setiap Belanja</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Tracking Pesanan Real-time</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
