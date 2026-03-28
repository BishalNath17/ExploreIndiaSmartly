const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

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
  const response = await fetch(`${API_URL}/admin/data/${category}`, {
    headers: getAuthHeaders()
  });
  return response.json();
};

export const addItem = async (category, formData) => {
  const response = await fetch(`${API_URL}/admin/data/${category}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData // using FormData because we need to upload images
  });
  return response.json();
};

export const updateItem = async (category, id, formData) => {
  const response = await fetch(`${API_URL}/admin/data/${category}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: formData
  });
  return response.json();
};

export const deleteItem = async (category, id) => {
  const response = await fetch(`${API_URL}/admin/data/${category}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return response.json();
};
