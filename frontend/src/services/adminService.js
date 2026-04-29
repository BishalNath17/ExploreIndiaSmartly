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
  return { 'Authorization': `Bearer ${token}` };
};

/**
 * Fetch data for any collection.
 * All collections now use MongoDB-backed endpoints.
 */
export const fetchData = async (category) => {
  const endpointMap = {
    destinations: '/admin/destinations',
    states: '/admin/states',
    'safety-tips': '/admin/safety-tips',
    'hero-images': '/admin/hero-images',
    blogs: '/admin/blogs',
    contact: '/admin/contact',
    leads: '/admin/leads',
  };
  const endpoint = endpointMap[category] || `/admin/${category}`;
  const response = await fetch(`${API_URL}${endpoint}`, { headers: getAuthHeaders() });
  return response.json();
};

export const addItem = async (category, formData) => {
  const endpointMap = {
    destinations: '/admin/destinations',
    states: '/admin/states',
    'safety-tips': '/admin/safety-tips',
    blogs: '/admin/blogs',
  };
  const endpoint = endpointMap[category] || `/admin/${category}`;
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData
  });
  return response.json();
};

export const updateItem = async (category, id, formData) => {
  const endpointMap = {
    destinations: `/admin/destinations/${id}`,
    states: `/admin/states/${id}`,
    heroImages: `/admin/hero-images/${id}`,

    'safety-tips': `/admin/safety-tips/${id}`,
    'hero-images': `/admin/hero-images/${id}`,
    blogs: `/admin/blogs/${id}`,
    contact: `/admin/contact/${id}/read`,
  };
  const endpoint = endpointMap[category] || `/admin/${category}/${id}`;
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: formData
  });
  return response.json();
};

export const deleteItem = async (category, id) => {
  const endpointMap = {
    destinations: `/admin/destinations/${id}`,
    states: `/admin/states/${id}`,

    'safety-tips': `/admin/safety-tips/${id}`,
    blogs: `/admin/blogs/${id}`,
    contact: `/admin/contact/${id}`,
  };
  const endpoint = endpointMap[category] || `/admin/${category}/${id}`;
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return response.json();
};

export const approveDestination = async (id) => {
  const response = await fetch(`${API_URL}/admin/destinations/${id}/approve`, {
    method: 'PUT',
    headers: getAuthHeaders()
  });
  return response.json();
};

export const rejectDestination = async (id) => {
  const response = await fetch(`${API_URL}/admin/destinations/${id}/reject`, {
    method: 'PUT',
    headers: getAuthHeaders()
  });
  return response.json();
};

export const bulkApproveDestinations = async (ids) => {
  const response = await fetch(`${API_URL}/admin/destinations/bulk-approve`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids })
  });
  return response.json();
};

export const bulkRejectDestinations = async (ids) => {
  const response = await fetch(`${API_URL}/admin/destinations/bulk-reject`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids })
  });
  return response.json();
};
