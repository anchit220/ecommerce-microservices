// src/services/api.js
import axios from "axios";

const BASE_URL = "http://localhost"; // Replace with your ingress host if deployed

export const authAPI = axios.create({
    baseURL: `${BASE_URL}/auth`,
});

export const productAPI = axios.create({
    baseURL: `${BASE_URL}/products`,
});

export const cartAPI = axios.create({
    baseURL: `${BASE_URL}/cart`,
});

export const orderAPI = axios.create({
    baseURL: `${BASE_URL}/order`,
});
