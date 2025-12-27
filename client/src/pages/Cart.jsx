import { Link } from 'react-router-dom';
import useCartStore from '../stores/cartStore';
import { formatRupiah, getImageURL } from '../utils/helpers';
import './Cart.css';

const Cart = () => {
    const { items, removeItem, updateQuantity, clearCart, getTotal, getTotalItems } = useCartStore();

    const shippingCost = getTotal() >= 150000 ? 0 : 25000;
    const finalTotal = getTotal() + shippingCost;

    if (items.length === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="empty-cart">
                        <div className="empty-icon">🛒</div>
                        <h2>Keranjang Belanja Kosong</h2>
                        <p>Belum ada produk di keranjang Anda. Yuk, mulai belanja!</p>
                        <Link to="/products" className="btn btn-primary btn-lg">
                            Lihat Menu
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <div className="page-header">
                    <h1>Keranjang Belanja</h1>
                    <p>{getTotalItems()} item dalam keranjang</p>
                </div>

                <div className="cart-content">
                    {/* Cart Items */}
                    <div className="cart-items">
                        {items.map((item) => {
                            const finalPrice = item.price - (item.currentDiscount || 0);

                            return (
                                <div key={item._id} className="cart-item">
                                    <div className="item-image">
                                        <img src={getImageURL(item.pictureName)} alt={item.name} />
                                    </div>

                                    <div className="item-details">
                                        <h3>{item.name}</h3>
                                        <p className="item-price">{formatRupiah(finalPrice)}</p>
                                    </div>

                                    <div className="item-quantity">
                                        <button
                                            className="qty-btn"
                                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                        >
                                            -
                                        </button>
                                        <span className="qty-value">{item.quantity}</span>
                                        <button
                                            className="qty-btn"
                                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="item-subtotal">
                                        <p>{formatRupiah(finalPrice * item.quantity)}</p>
                                    </div>

                                    <button
                                        className="item-remove"
                                        onClick={() => removeItem(item._id)}
                                        aria-label="Hapus item"
                                    >
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            );
                        })}

                        <div className="cart-actions">
                            <button onClick={clearCart} className="btn btn-outline">
                                Kosongkan Keranjang
                            </button>
                            <Link to="/products" className="btn btn-secondary">
                                Lanjut Belanja
                            </Link>
                        </div>
                    </div>

                    {/* Cart Summary */}
                    <div className="cart-summary">
                        <h3>Ringkasan Belanja</h3>

                        <div className="summary-row">
                            <span>Subtotal ({getTotalItems()} item)</span>
                            <span>{formatRupiah(getTotal())}</span>
                        </div>

                        <div className="summary-row">
                            <span>Ongkos Kirim</span>
                            <span>{shippingCost === 0 ? 'GRATIS' : formatRupiah(shippingCost)}</span>
                        </div>

                        {getTotal() < 150000 && (
                            <div className="free-shipping-info">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p>
                                    Belanja {formatRupiah(150000 - getTotal())} lagi untuk gratis ongkir!
                                </p>
                            </div>
                        )}

                        <div className="summary-divider"></div>

                        <div className="summary-total">
                            <span>Total</span>
                            <span className="total-amount">{formatRupiah(finalTotal)}</span>
                        </div>

                        <Link to="/checkout" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                            Checkout
                        </Link>

                        <div className="payment-methods">
                            <p>Metode Pembayaran:</p>
                            <div className="payment-icons">
                                <span>💳</span>
                                <span>🏦</span>
                                <span>📱</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
