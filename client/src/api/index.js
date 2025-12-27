import apiClient from './client';

// Auth API
export const authAPI = {
    register: (data) => apiClient.post('/auth/register', data),
    login: (data) => apiClient.post('/auth/login', data),
    logout: () => apiClient.post('/auth/logout'),
    getMe: () => apiClient.get('/auth/me'),
    updatePassword: (data) => apiClient.put('/auth/updatepassword', data),
};

// Product API
export const productAPI = {
    getAll: (params) => apiClient.get('/products', { params }),
    getById: (id) => apiClient.get(`/products/${id}`),
    getBySKU: (sku) => apiClient.get(`/products/sku/${sku}`),
    getBestDeal: () => apiClient.get('/products/best-deal'),
    getRelated: (id) => apiClient.get(`/products/${id}/related`),
    create: (data) => apiClient.post('/products', data),
    update: (id, data) => apiClient.put(`/products/${id}`, data),
    delete: (id) => apiClient.delete(`/products/${id}`),
};

// Category API
export const categoryAPI = {
    getAll: () => apiClient.get('/categories'),
    getById: (id) => apiClient.get(`/categories/${id}`),
    create: (data) => apiClient.post('/categories', data),
    update: (id, data) => apiClient.put(`/categories/${id}`, data),
    delete: (id) => apiClient.delete(`/categories/${id}`),
};

// Order API
export const orderAPI = {
    getAll: (params) => apiClient.get('/orders', { params }),
    getById: (id) => apiClient.get(`/orders/${id}`),
    create: (data) => apiClient.post('/orders', data),
    updateStatus: (id, status) => apiClient.put(`/orders/${id}/status`, { status }),
};

// Payment API
export const paymentAPI = {
    getAll: (params) => apiClient.get('/payments', { params }),
    getByOrder: (orderId) => apiClient.get(`/payments/order/${orderId}`),
    upload: (formData) => apiClient.post('/payments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    confirm: (id) => apiClient.put(`/payments/${id}/confirm`),
    reject: (id) => apiClient.put(`/payments/${id}/reject`),
};

// Coupon API
export const couponAPI = {
    getAll: () => apiClient.get('/coupons'),
    validate: (code) => apiClient.post('/coupons/validate', { code }),
    create: (data) => apiClient.post('/coupons', data),
    update: (id, data) => apiClient.put(`/coupons/${id}`, data),
    delete: (id) => apiClient.delete(`/coupons/${id}`),
};

// Customer API
export const customerAPI = {
    getProfile: () => apiClient.get('/customers/profile'),
    updateProfile: (formData) => apiClient.put('/customers/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getAll: (params) => apiClient.get('/customers', { params }),
};

// Review API
export const reviewAPI = {
    getAll: (params) => apiClient.get('/reviews', { params }),
    create: (data) => apiClient.post('/reviews', data),
    update: (id, data) => apiClient.put(`/reviews/${id}`, data),
    delete: (id) => apiClient.delete(`/reviews/${id}`),
};

// Contact API
export const contactAPI = {
    getAll: (params) => apiClient.get('/contacts', { params }),
    getById: (id) => apiClient.get(`/contacts/${id}`),
    send: (data) => apiClient.post('/contacts', data),
    reply: (id, message) => apiClient.post(`/contacts/${id}/reply`, { message }),
};
