import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../api';
import ProductCard from '../components/product/ProductCard';
import './Home.css';

const Home = () => {
    const [bestDeal, setBestDeal] = useState(null);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHomeData();
    }, []);

    const fetchHomeData = async () => {
        try {
            setLoading(true);

            // Fetch best deal
            const bestDealRes = await productAPI.getBestDeal();
            setBestDeal(bestDealRes.data.data);

            // Fetch featured products
            const productsRes = await productAPI.getAll({ page: 1, limit: 8 });
            setFeaturedProducts(productsRes.data.data);
        } catch (error) {
            console.error('Error fetching home data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title animate-fade-in">
                            Mie Ayam & Bakso <br />
                            <span className="text-gradient">100% Daging Sapi</span>
                        </h1>
                        <p className="hero-description animate-fade-in">
                            Rasakan kelezatan mie ayam dan bakso dengan bahan pilihan terbaik.
                            Pesan sekarang dan nikmati di rumah Anda!
                        </p>
                        <div className="hero-actions animate-fade-in">
                            <Link to="/products" className="btn btn-primary btn-lg">
                                Lihat Menu
                            </Link>
                            <Link to="/cart" className="btn btn-outline btn-lg">
                                Keranjang Saya
                            </Link>
                        </div>
                    </div>
                    <div className="hero-image animate-slide-in">
                        <div className="hero-image-wrapper">
                            🍜
                        </div>
                    </div>
                </div>
            </section>

            {/* Best Deal Section */}
            {bestDeal && (
                <section className="best-deal">
                    <div className="container">
                        <div className="section-header">
                            <h2>🔥 Promo Spesial Hari Ini</h2>
                            <p>Jangan lewatkan penawaran terbaik kami!</p>
                        </div>
                        <div className="best-deal-card">
                            <ProductCard product={bestDeal} />
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Products */}
            <section className="featured-products">
                <div className="container">
                    <div className="section-header">
                        <h2>Menu Pilihan</h2>
                        <p>Produk terlaris dan favorit pelanggan</p>
                    </div>

                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Memuat produk...</p>
                        </div>
                    ) : (
                        <>
                            <div className="products-grid">
                                {featuredProducts.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                            <div className="section-footer">
                                <Link to="/products" className="btn btn-primary">
                                    Lihat Semua Menu
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="container">
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🥩</div>
                            <h3>100% Daging Sapi</h3>
                            <p>Hanya menggunakan daging sapi pilihan berkualitas tinggi</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🚚</div>
                            <h3>Pengiriman Cepat</h3>
                            <p>Diantar langsung ke rumah Anda dalam kondisi terbaik</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💯</div>
                            <h3>Higienis & Halal</h3>
                            <p>Diproses dengan standar kebersihan dan kehalalantinggi</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💰</div>
                            <h3>Harga Terjangkau</h3>
                            <p>Kualitas premium dengan harga yang ramah di kantong</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
