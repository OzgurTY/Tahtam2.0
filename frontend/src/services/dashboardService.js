import axios from 'axios';

const API_URL = 'http://localhost:2000/api/dashboard';

/**
 * Belirli bir pazar ve TARİH için "boş tahta" özetini getirir.
 * GET /api/dashboard/market-summary
 * @param {string} marketplaceId 
 * @param {string} date (Örn: "2025-11-08")
 */
const getMarketDaySummary = (marketplaceId, date) => {
  return axios.get(`${API_URL}/market-summary`, {
    params: { marketplaceId, date } 
  });
};

const dashboardService = {
  getMarketDaySummary,
};

export default dashboardService;