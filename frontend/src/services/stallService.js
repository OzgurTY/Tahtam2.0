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

const stallService = {
  getStallsByMarketplace,
  createStall,
};

export default stallService;