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

const getAllRentals = () => {
  return axios.get(`${API_URL}/all`);
};

const createBatchRental = (batchData) => {
  return axios.post(`${API_URL}/batch`, batchData);
};

const deleteRental = (rentalId) => {
  return axios.get(`${API_URL}/${rentalId}`);
}

const rentalService = {
  createRental,
  getAllRentals,
  createBatchRental,
  deleteRental,
};

export default rentalService;