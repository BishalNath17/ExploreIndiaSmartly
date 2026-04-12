import { API_URL } from '../config/api';

export const adminLogin = async (username, password) => {
  const response = await fetch(`${API_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return response.json();
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Authorization': `Bearer ${token}`
  };
};

export const fetchData = async (category) => {
  const endpoint = category === 'destinations' 
    ? `${API_URL}/admin/destinations` 
    : `${API_URL}/admin/data/${category}`;

  const response = await fetch(endpoint, {
    headers: getAuthHeaders()
  });
  return response.json();
};

export const addItem = async (category, formData) => {
  const endpoint = category === 'destinations' 
    ? `${API_URL}/admin/destinations` 
    : `${API_URL}/admin/data/${category}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData // using FormData because we need to upload images
  });
  return response.json();
};

export const updateItem = async (category, id, formData) => {
  const endpoint = category === 'destinations' 
    ? `${API_URL}/admin/destinations/${id}` 
    : `${API_URL}/admin/data/${category}/${id}`;

  const response = await fetch(endpoint, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: formData
  });
  return response.json();
};

export const deleteItem = async (category, id) => {
  const endpoint = category === 'destinations' 
    ? `${API_URL}/admin/destinations/${id}` 
    : `${API_URL}/admin/data/${category}/${id}`;

  const response = await fetch(endpoint, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return response.json();
};
