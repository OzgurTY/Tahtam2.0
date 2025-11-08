import axios from 'axios';

const API_URL = 'http://localhost:2000/api/dashboard';

/**
 * Belirli bir pazar ve gün için "boş tahta" özetini getirir.
 * GET /api/dashboard/market-summary
 * @param {string} marketplaceId 
 * @param {string} dayOfWeek (Örn: "TUESDAY")
 */
const getMarketDaySummary = (marketplaceId, dayOfWeek) => {
  return axios.get(`${API_URL}/market-summary`, {
    params: { marketplaceId, dayOfWeek }
  });
};

const dashboardService = {
  getMarketDaySummary,
};

export default dashboardService;