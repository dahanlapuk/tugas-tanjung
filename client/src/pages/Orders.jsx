import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { orderAPI } from '../api';
import { formatRupiah, formatDate, getOrderStatusLabel, getOrderStatusColor } from '../utils/helpers';
import './Orders.css';

const Orders = () => {
    const { isAuthenticated } = useAuthStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated, filter]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const params = {};
            if (filter) params.status = filter;

            const response = await orderAPI.getAll(params);
            setOrders(response.data.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <h2>Silakan login untuk melihat pesanan</h2>
                <Link to="/login" className="btn btn-primary">Login</Link>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <div className="container">
                <div className="page-header">
                    <h1>Pesanan Saya</h1>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Semua Status</option>
                        <option value="pending">Menunggu Pembayaran</option>
                        <option value="confirmed">Dikonfirmasi</option>
                        <option value="processing">Diproses</option>
                        <option value="shipped">Dikirim</option>
                        <option value="delivered">Selesai</option>
                    </select>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Memuat pesanan...</p>
                    </div>
                ) : orders.length > 0 ? (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <Link
                                key={order.id}
                                to={`/orders/${order.id}`}
                                className="order-card"
                            >
                                <div className="order-header">
                                    <div>
                                        <h3>Order #{order.order_number}</h3>
                                        <p className="order-date">{formatDate(order.order_date)}</p>
                                    </div>
                                    <span
                                        className="order-status"
                                        style={{ backgroundColor: getOrderStatusColor(order.order_status) }}
                                    >
                                        {getOrderStatusLabel(order.order_status)}
                                    </span>
                                </div>

                                <div className="order-items">
                                    {order.items?.slice(0, 3).map((item, index) => (
                                        <div key={index} className="order-item">
                                            <span>{item.product?.name}</span>
                                            <span>x{item.order_qty}</span>
                                        </div>
                                    ))}
                                    {order.items?.length > 3 && (
                                        <p className="more-items">+{order.items.length - 3} item lainnya</p>
                                    )}
                                </div>

                                <div className="order-footer">
                                    <span>Total: {formatRupiah(order.total_price)}</span>
                                    <span className="view-detail">Lihat Detail →</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">📦</div>
                        <h3>Belum Ada Pesanan</h3>
                        <p>Anda belum memiliki pesanan. Yuk, mulai belanja!</p>
                        <Link to="/products" className="btn btn-primary">
                            Lihat Menu
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
