import axios from 'axios';

// Backend'imizin ana adresi
const API_URL = 'http://localhost:2000/api/marketplaces';

/**
 * Tüm pazaryerlerini backend'den çeker.
 * GET /api/marketplaces
 */
const getMarketplaces = () => {
  return axios.get(API_URL);
};

/**
 * Yeni bir pazaryeri oluşturur.
 * POST /api/marketplaces
 * @param {object} marketplaceData (örn: { name: "Pazar Adı", address: "Adres", openDays: ["TUESDAY"] })
 */
const createMarketplace = (marketplaceData) => {
  return axios.post(API_URL, marketplaceData);
};

// Fonksiyonları dışa aktar
const marketplaceService = {
  getMarketplaces,
  createMarketplace,
  // İleride buraya deleteMarketplace, updateMarketplace vb. ekleyeceğiz
};

export default marketplaceService;