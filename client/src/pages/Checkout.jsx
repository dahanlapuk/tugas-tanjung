import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../stores/cartStore';
import useAuthStore from '../stores/authStore';
import { orderAPI } from '../api';
import { formatRupiah } from '../utils/helpers';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { items, getTotal, clearCart } = useCartStore();
    const { user, isAuthenticated } = useAuthStore();

    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: '',
        address: '',
        notes: '',
        couponCode: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const shippingCost = getTotal() >= 150000 ? 0 : 25000;
    const subtotal = getTotal();
    const total = subtotal + shippingCost;

    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    if (items.length === 0) {
        navigate('/cart');
        return null;
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.phone || !formData.address) {
            setError('Mohon lengkapi semua field yang wajib diisi');
            return;
        }

        try {
            setLoading(true);

            const orderData = {
                items: items.map(item => ({
                    productId: item._id,
                    quantity: item.quantity
                })),
                deliveryData: {
                    name: formData.name,
                    phone: formData.phone,
                    address: formData.address,
                    notes: formData.notes
                },
                couponCode: formData.couponCode || null,
                paymentMethod: 1
            };

            const response = await orderAPI.create(orderData);

            if (response.data.success) {
                clearCart();
                alert('Pesanan berhasil dibuat! Silakan lakukan pembayaran.');
                navigate(`/orders/${response.data.data.id}`);
            }
        } catch (err) {
            setError(err.message || 'Gagal membuat pesanan. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page">
            <div className="container">
                <h1>Checkout</h1>

                <div className="checkout-content">
                    {/* Delivery Form */}
                    <div className="checkout-form">
                        <h2>Informasi Pengiriman</h2>

                        {error && (
                            <div className="alert alert-error">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">Nama Penerima *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone" className="form-label">No. Telepon *</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="08xxxxxxxxxx"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="address" className="form-label">Alamat Lengkap *</label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="form-textarea"
                                    rows="4"
                                    placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="notes" className="form-label">Catatan (Opsional)</label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    className="form-textarea"
                                    rows="3"
                                    placeholder="Catatan untuk kurir atau penjual"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="couponCode" className="form-label">Kode Kupon (Opsional)</label>
                                <input
                                    type="text"
                                    id="couponCode"
                                    name="couponCode"
                                    value={formData.couponCode}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Masukkan kode kupon"
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                style={{ width: '100%' }}
                                disabled={loading}
                            >
                                {loading ? 'Memproses...' : 'Buat Pesanan'}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="order-summary">
                        <h2>Ringkasan Pesanan</h2>

                        <div className="summary-items">
                            {items.map((item) => (
                                <div key={item._id} className="summary-item">
                                    <span>{item.name} x{item.quantity}</span>
                                    <span>{formatRupiah((item.price - (item.current_discount || 0)) * item.quantity)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>{formatRupiah(subtotal)}</span>
                        </div>

                        <div className="summary-row">
                            <span>Ongkos Kirim</span>
                            <span>{shippingCost === 0 ? 'GRATIS' : formatRupiah(shippingCost)}</span>
                        </div>

                        {subtotal < 150000 && (
                            <p className="free-shipping-note">
                                Belanja {formatRupiah(150000 - subtotal)} lagi untuk gratis ongkir!
                            </p>
                        )}

                        <div className="summary-divider"></div>

                        <div className="summary-total">
                            <span>Total</span>
                            <span className="total-amount">{formatRupiah(total)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
