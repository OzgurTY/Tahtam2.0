import axios from 'axios';

// API YOLU GÜNCELLENDİ
const API_URL = 'http://localhost:2000/api/rentals';

/**
 * Yeni bir kiralama (rental) oluşturur.
 * POST /api/rentals
 * @param {object} rentalData (Artık rentalDate içeriyor)
 */
const createRental = (rentalData) => {
  return axios.post(API_URL, rentalData);
};

const rentalService = {
  createRental,
};

export default rentalService;