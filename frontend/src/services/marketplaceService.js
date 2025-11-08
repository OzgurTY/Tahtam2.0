import axios from 'axios';

const API_URL = 'http://localhost:2000/api/marketplaces';

const getMarketplaces = () => {
  return axios.get(API_URL);
};

const createMarketplace = (marketplaceData) => {
  return axios.post(API_URL, marketplaceData);
};

/**
 * Bir pazaryerini günceller.
 * PUT /api/marketplaces/{id}
 */
const updateMarketplace = (marketplaceId, marketplaceData) => {
  return axios.put(`${API_URL}/${marketplaceId}`, marketplaceData);
};

/**
 * Bir pazaryerini ID ile siler.
 * DELETE /api/marketplaces/{id}
 */
const deleteMarketplace = (marketplaceId) => {
  return axios.delete(`${API_URL}/${marketplaceId}`);
};

const marketplaceService = {
  getMarketplaces,
  createMarketplace,
  updateMarketplace,
  deleteMarketplace,
};

export default marketplaceService;