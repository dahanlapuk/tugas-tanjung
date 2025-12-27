import { useState, useEffect } from 'react';
import { customerAPI } from '../api';
import useAuthStore from '../stores/authStore';
import './Profile.css';

const Profile = () => {
    const { user, isAuthenticated, updateUser } = useAuthStore();
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            fetchProfile();
        }
    }, [isAuthenticated]);

    const fetchProfile = async () => {
        try {
            const response = await customerAPI.getProfile();
            const profile = response.data.data;
            setFormData({
                name: profile.name || '',
                phoneNumber: profile.phone_number || '',
                address: profile.address || ''
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            setLoading(true);
            const response = await customerAPI.updateProfile(formData);

            if (response.data.success) {
                updateUser({ name: formData.name });
                setMessage('Profile berhasil diupdate!');
            }
        } catch (error) {
            setMessage('Gagal update profile. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <h2>Silakan login untuk melihat profile</h2>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="container">
                <h1>Profile Saya</h1>

                <div className="profile-content">
                    <div className="profile-card">
                        <h2>Informasi Akun</h2>
                        <div className="info-row">
                            <strong>Email:</strong>
                            <span>{user?.email}</span>
                        </div>
                        <div className="info-row">
                            <strong>Username:</strong>
                            <span>{user?.username}</span>
                        </div>
                        <div className="info-row">
                            <strong>Role:</strong>
                            <span className="badge badge-primary">{user?.role}</span>
                        </div>
                    </div>

                    <div className="profile-card">
                        <h2>Update Profile</h2>

                        {message && (
                            <div className={`alert ${message.includes('berhasil') ? 'alert-success' : 'alert-error'}`}>
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">Nama Lengkap</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-input"
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
                                    rows="4"
                                    placeholder="Alamat lengkap"
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
