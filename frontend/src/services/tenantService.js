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
 * @param {object} tenantData (örn: { name: "Ahmet Yılmaz", phoneNumber: "...", productSold: "..." })
 */
const createTenant = (tenantData) => {
  return axios.post(API_URL, tenantData);
};

const tenantService = {
  getTenants,
  createTenant,
};

export default tenantService;