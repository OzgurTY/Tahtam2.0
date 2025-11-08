import axios from 'axios';

const API_URL = 'http://localhost:2000/api/stalls';

/**
 * Belirli bir pazaryerine ait tahtaları getirir.
 * GET /api/stalls?marketplaceId=...
 */
const getStallsByMarketplace = (marketplaceId) => {
  return axios.get(API_URL, {
    params: { marketplaceId } 
  });
};

/**
 * Yeni bir tahta oluşturur.
 * POST /api/stalls
 * @param {object} stallData (örn: { stallNumber: "3B/114", marketplaceId: "...", productTypes: ["Gıda"] })
 */
const createStall = (stallData) => {
  return axios.post(API_URL, stallData);
};

/**
 * Bir tahtayı günceller.
 * PUT /api/stalls/{id}
 */
const updateStall = (stallId, stallData) => {
  return axios.put(`${API_URL}/${stallId}`, stallData);
};

/**
 * Bir tahtayı ID ile siler.
 * DELETE /api/stalls/{id}
 */
const deleteStall = (stallId) => {
  return axios.delete(`${API_URL}/${stallId}`);
};

const getAllStalls = () => {
  return axios.get(`${API_URL}/all`);
};

const stallService = {
  getStallsByMarketplace,
  createStall,
  updateStall,
  deleteStall,
  getAllStalls,
};

export default stallService;