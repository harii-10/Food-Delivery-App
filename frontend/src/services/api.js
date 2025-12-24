import axios from 'axios';

const API_BASE = 'http://localhost:3001/api'; // auth
const RESTAURANT_API = 'http://localhost:3002/api';
const ORDER_API = 'http://localhost:3003/api';
const DELIVERY_API = 'http://localhost:3004/api';
const NOTIFICATION_API = 'http://localhost:3006/api';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const restaurantAPI = {
  createRestaurant: (data) => axios.post(`${RESTAURANT_API}/restaurants`, data, getAuthHeaders()),
  getRestaurants: () => axios.get(`${RESTAURANT_API}/restaurants`),
  getMenu: (id) => axios.get(`${RESTAURANT_API}/restaurants/${id}/menu`),
  updateMenu: (id, data) => axios.put(`${RESTAURANT_API}/restaurants/${id}/menu`, data, getAuthHeaders()),
};

export const orderAPI = {
  createOrder: (data) => axios.post(`${ORDER_API}/orders`, data, getAuthHeaders()),
  getOrders: () => axios.get(`${ORDER_API}/orders`, getAuthHeaders()),
  updateStatus: (id, data) => axios.put(`${ORDER_API}/orders/${id}/status`, data, getAuthHeaders()),
};

export const deliveryAPI = {
  assignDelivery: (data) => axios.post(`${DELIVERY_API}/deliveries`, data),
  getStatus: (orderId) => axios.get(`${DELIVERY_API}/deliveries/${orderId}`),
};

export const notificationAPI = {
  getNotifications: () => axios.get(`${NOTIFICATION_API}/notifications`, getAuthHeaders()),
};