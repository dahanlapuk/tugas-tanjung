import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productAPI } from '../api';
import { formatRupiah, getImageURL } from '../utils/helpers';
import useCartStore from '../stores/cartStore';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const { addItem } = useCartStore();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const [productRes, relatedRes] = await Promise.all([
                productAPI.getById(id),
                productAPI.getRelated(id)
            ]);

            setProduct(productRes.data.data);
            setRelatedProducts(relatedRes.data.data);
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (product) {
            addItem(product, quantity);
            alert(`${product.name} ditambahkan ke keranjang!`);
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <div className="spinner"></div>
                <p>Memuat produk...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <h2>Produk tidak ditemukan</h2>
                <Link to="/products" className="btn btn-primary">Kembali ke Menu</Link>
            </div>
        );
    }

    const finalPrice = product.price - (product.current_discount || 0);
    const hasDiscount = product.current_discount > 0;

    return (
        <div className="product-detail-page">
            <div className="container">
                {/* Breadcrumb */}
                <div className="breadcrumb">
                    <Link to="/">Home</Link>
                    <span>/</span>
                    <Link to="/products">Products</Link>
                    <span>/</span>
                    <span>{product.name}</span>
                </div>

                {/* Product Detail */}
                <div className="product-detail">
                    <div className="product-image-section">
                        <img src={getImageURL(product.picture_name)} alt={product.name} />
                        {hasDiscount && (
                            <div className="discount-badge">
                                Hemat {formatRupiah(product.current_discount)}
                            </div>
                        )}
                    </div>

                    <div className="product-info-section">
                        <h1>{product.name}</h1>
                        <p className="product-sku">SKU: {product.sku}</p>

                        <div className="product-price">
                            {hasDiscount && (
                                <span className="price-original">{formatRupiah(product.price)}</span>
                            )}
                            <span className="price-final">{formatRupiah(finalPrice)}</span>
                        </div>

                        <div className="product-stock">
                            {product.is_available && product.stock > 0 ? (
                                <span className="in-stock">✓ Stok tersedia ({product.stock} {product.product_unit})</span>
                            ) : (
                                <span className="out-of-stock">✗ Stok habis</span>
                            )}
                        </div>

                        <p className="product-description">{product.description}</p>

                        {product.is_available && product.stock > 0 && (
                            <div className="product-actions">
                                <div className="quantity-selector">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        min="1"
                                        max={product.stock}
                                    />
                                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
                                </div>

                                <button className="btn btn-primary btn-lg" onClick={handleAddToCart}>
                                    Tambah ke Keranjang
                                </button>
                            </div>
                        )}

                        <div className="product-meta">
                            <div className="meta-item">
                                <strong>Kategori:</strong>
                                <span>{product.category?.name || 'Uncategorized'}</span>
                            </div>
                            <div className="meta-item">
                                <strong>Unit:</strong>
                                <span>{product.product_unit}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="related-products">
                        <h2>Produk Terkait</h2>
                        <div className="products-grid">
                            {relatedProducts.map((relatedProduct) => (
                                <Link
                                    key={relatedProduct._id}
                                    to={`/products/${relatedProduct._id}`}
                                    className="related-product-card"
                                >
                                    <img src={getImageURL(relatedProduct.picture_name)} alt={relatedProduct.name} />
                                    <h3>{relatedProduct.name}</h3>
                                    <p className="price">{formatRupiah(relatedProduct.price - (relatedProduct.current_discount || 0))}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
