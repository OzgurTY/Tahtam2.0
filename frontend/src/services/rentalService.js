import axios from 'axios';

// API YOLU GÜNCELLENDİ
const API_URL = '/api/rentals';

/**
 * Yeni bir kiralama (rental) oluşturur.
 * POST /api/rentals
 * @param {object} rentalData
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
  return axios.delete(`${API_URL}/${rentalId}`);
}

const deleteBatchRentals = (rentalIds) => {
  return axios.delete(`${API_URL}/batch`, { data: rentalIds });
}

const updateRentalStatus = (rentalId, status) => {
  return axios.patch(`${API_URL}/${rentalId}/status`, { status });
};

const rentalService = {
  createRental,
  getAllRentals,
  createBatchRental,
  deleteRental,
  deleteBatchRentals,
  updateRentalStatus,
};

export default rentalService;