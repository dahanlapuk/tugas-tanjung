import { Link } from 'react-router-dom';
import { formatRupiah, getImageURL } from '../../utils/helpers';
import useCartStore from '../../stores/cartStore';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addItem } = useCartStore();

    const finalPrice = product.price - (product.currentDiscount || 0);
    const hasDiscount = product.currentDiscount > 0;

    const handleAddToCart = (e) => {
        e.preventDefault();
        addItem(product, 1);

        // Show toast notification (you can implement a toast library)
        alert(`${product.name} ditambahkan ke keranjang!`);
    };

    return (
        <Link to={`/products/${product._id}`} className="product-card">
            <div className="product-image-wrapper">
                <img
                    src={getImageURL(product.pictureName)}
                    alt={product.name}
                    className="product-image"
                    loading="lazy"
                />
                {hasDiscount && (
                    <div className="product-badge">
                        Diskon {formatRupiah(product.currentDiscount)}
                    </div>
                )}
                {!product.isAvailable && (
                    <div className="product-badge badge-sold-out">
                        Habis
                    </div>
                )}
            </div>

            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">
                    {product.description || 'Produk berkualitas dengan bahan pilihan'}
                </p>

                <div className="product-footer">
                    <div className="product-price">
                        {hasDiscount && (
                            <span className="price-original">{formatRupiah(product.price)}</span>
                        )}
                        <span className="price-final">{formatRupiah(finalPrice)}</span>
                    </div>

                    {product.isAvailable ? (
                        <button
                            className="btn-add-cart"
                            onClick={handleAddToCart}
                        >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </button>
                    ) : (
                        <button className="btn-add-cart" disabled>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
