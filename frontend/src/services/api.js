/**
 * api.js — Central API service for FlashLearn
 * All fetch calls go through this file.
 * Backend runs on http://localhost:5000
 */

// In development (localhost): uses http://localhost:5000/api
// In production (Vercel): automatically connects to Render backend without needing manual env variables!
const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const BASE_URL = import.meta.env.VITE_API_URL || (isLocal ? 'http://localhost:5000/api' : 'https://flashlearn-yuga.onrender.com/api');

// Helper: get JWT token from localStorage
function getToken() {
  return localStorage.getItem('flashlearn_token');
}

// Helper: build headers with optional JWT
function headers(includeAuth = true) {
  const h = { 'Content-Type': 'application/json' };
  if (includeAuth) {
    const token = getToken();
    if (token) h['Authorization'] = `Bearer ${token}`;
  }
  return h;
}

// Helper: handle API response and errors
async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `HTTP error ${res.status}`);
  }
  return data;
}

// ==================== AUTH ====================

export const authAPI = {
  // Register a new user
  register: (name, email, password) =>
    fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: headers(false),
      body: JSON.stringify({ name, email, password })
    }).then(handleResponse),

  // Login
  login: (email, password) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: headers(false),
      body: JSON.stringify({ email, password })
    }).then(handleResponse),

  // Get logged-in user profile
  getProfile: () =>
    fetch(`${BASE_URL}/auth/profile`, {
      headers: headers()
    }).then(handleResponse),

  // Update name
  updateProfile: (name) =>
    fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({ name })
    }).then(handleResponse),
};

// ==================== FLASHCARDS ====================

export const flashcardsAPI = {
  // Get all flashcards (explore) with optional filters
  getAll: (category = '', search = '') => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search)   params.append('search', search);
    return fetch(`${BASE_URL}/flashcards?${params}`, {
      headers: headers(false)
    }).then(handleResponse);
  },

  // Get only my flashcards
  getMy: () =>
    fetch(`${BASE_URL}/flashcards/my`, {
      headers: headers()
    }).then(handleResponse),

  // Get a single flashcard
  getOne: (id) =>
    fetch(`${BASE_URL}/flashcards/${id}`, {
      headers: headers(false)
    }).then(handleResponse),

  // Create a flashcard
  create: (question, answer, category) =>
    fetch(`${BASE_URL}/flashcards`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ question, answer, category })
    }).then(handleResponse),

  // Update a flashcard
  update: (id, question, answer, category) =>
    fetch(`${BASE_URL}/flashcards/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({ question, answer, category })
    }).then(handleResponse),

  // Delete a flashcard
  delete: (id) =>
    fetch(`${BASE_URL}/flashcards/${id}`, {
      method: 'DELETE',
      headers: headers()
    }).then(handleResponse),
};

// ==================== DASHBOARD ====================

export const dashboardAPI = {
  get: () =>
    fetch(`${BASE_URL}/dashboard`, {
      headers: headers()
    }).then(handleResponse),
};

// ==================== PROGRESS ====================

export const progressAPI = {
  get: () =>
    fetch(`${BASE_URL}/progress`, {
      headers: headers()
    }).then(handleResponse),

  update: (flashcard_id, status) =>
    fetch(`${BASE_URL}/progress`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ flashcard_id, status })
    }).then(handleResponse),
};

// ==================== CATEGORIES ====================
export const CATEGORIES = [
  'Python', 'Java', 'C++', 'DBMS',
  'Web Development', 'Computer Networks', 'General'
];
