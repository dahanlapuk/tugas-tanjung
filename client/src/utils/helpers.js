// Format currency to Rupiah
export const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

// Format date
export const formatDate = (date) => {
    return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date));
};

// Format datetime
export const formatDateTime = (date) => {
    return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
};

// Get image URL
export const getImageURL = (filename) => {
    const UPLOAD_URL = import.meta.env.VITE_UPLOAD_URL || 'http://localhost:5000/uploads';
    return filename ? `${UPLOAD_URL}/${filename}` : '/placeholder.jpg';
};

// Truncate text
export const truncate = (text, length = 100) => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
};

// Get order status label
export const getOrderStatusLabel = (status) => {
    const labels = {
        pending: 'Menunggu Pembayaran',
        confirmed: 'Dikonfirmasi',
        processing: 'Diproses',
        shipped: 'Dikirim',
        delivered: 'Selesai',
    };
    return labels[status] || status;
};

// Get order status color
export const getOrderStatusColor = (status) => {
    const colors = {
        pending: '#f59e0b',
        confirmed: '#3b82f6',
        processing: '#8b5cf6',
        shipped: '#06b6d4',
        delivered: '#10b981',
    };
    return colors[status] || '#6b7280';
};

// Get payment status label
export const getPaymentStatusLabel = (status) => {
    const labels = {
        pending: 'Menunggu Verifikasi',
        confirmed: 'Terkonfirmasi',
        rejected: 'Ditolak',
    };
    return labels[status] || status;
};

// Validate email
export const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// Validate phone number (Indonesia)
export const isValidPhone = (phone) => {
    const re = /^(\+62|62|0)[0-9]{9,12}$/;
    return re.test(phone);
};
