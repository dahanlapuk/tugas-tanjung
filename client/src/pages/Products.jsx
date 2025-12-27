import { useState, useEffect } from 'react';
import { productAPI, categoryAPI } from '../api';
import ProductCard from '../components/product/ProductCard';
import './Products.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: '',
        search: '',
        sort: '-createdAt',
        page: 1,
        limit: 12
    });
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const fetchCategories = async () => {
        try {
            const res = await categoryAPI.getAll();
            setCategories(res.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = {};
            if (filters.category) params.category = filters.category;
            if (filters.search) params.search = filters.search;
            params.sort = filters.sort;
            params.page = filters.page;
            params.limit = filters.limit;

            const res = await productAPI.getAll(params);
            setProducts(res.data.data);
            setPagination(res.data.pagination);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="products-page">
            <div className="container">
                {/* Page Header */}
                <div className="page-header">
                    <h1>Menu Kami</h1>
                    <p>Pilih menu favorit Anda dari berbagai pilihan yang tersedia</p>
                </div>

                {/* Filters */}
                <div className="filters-section">
                    {/* Search */}
                    <div className="search-box">
                        <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Cari produk..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="search-input"
                        />
                    </div>

                    {/* Category Filter */}
                    <select
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Semua Kategori</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    {/* Sort */}
                    <select
                        value={filters.sort}
                        onChange={(e) => handleFilterChange('sort', e.target.value)}
                        className="filter-select"
                    >
                        <option value="-createdAt">Terbaru</option>
                        <option value="price">Harga: Rendah ke Tinggi</option>
                        <option value="-price">Harga: Tinggi ke Rendah</option>
                        <option value="name">Nama: A-Z</option>
                        <option value="-name">Nama: Z-A</option>
                    </select>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Memuat produk...</p>
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <div className="products-grid">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.pages > 1 && (
                            <div className="pagination">
                                <button
                                    className="btn btn-outline"
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                >
                                    Sebelumnya
                                </button>
                                <span className="pagination-info">
                                    Halaman {pagination.page} dari {pagination.pages}
                                </span>
                                <button
                                    className="btn btn-outline"
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page === pagination.pages}
                                >
                                    Selanjutnya
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">🔍</div>
                        <h3>Produk Tidak Ditemukan</h3>
                        <p>Coba ubah filter atau kata kunci pencarian Anda</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
