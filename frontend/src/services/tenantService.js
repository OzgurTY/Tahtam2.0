import axios from 'axios';

const API_URL = 'http://localhost:2000/api/tenants';

/**
 * Tüm kiracıları backend'den çeker.
 * GET /api/tenants
 */
const getTenants = () => {
  return axios.get(API_URL);
};

/**
 * Yeni bir kiracı oluşturur.
 * POST /api/tenants
 * @param {object} tenantData
 */
const createTenant = (tenantData) => {
  return axios.post(API_URL, tenantData);
};

/**
 * Bir kiracıyı ID ile siler.
 * DELETE /api/tenants/{id}
 * @param {string} tenantId 
 */
const deleteTenant = (tenantId) => {
  return axios.delete(`${API_URL}/${tenantId}`);
};

/**
 * Bir kiracıyı günceller.
 * PUT /api/tenants/{id}
 * @param {string} tenantId 
 * @param {object} tenantData 
 */
const updateTenant = (tenantId, tenantData) => {
  return axios.put(`${API_URL}/${tenantId}`, tenantData);
};


const tenantService = {
  getTenants,
  createTenant,
  deleteTenant,
  updateTenant,
};

export default tenantService;