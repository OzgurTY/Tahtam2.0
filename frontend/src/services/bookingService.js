import axios from 'axios';

const API_URL = 'http://localhost:2000/api/bookings';

/**
 * Yeni bir kiralama (booking) oluşturur.
 * POST /api/bookings
 * @param {object} bookingData 
 */
const createBooking = (bookingData) => {
  return axios.post(API_URL, bookingData);
};

const bookingService = {
  createBooking,
  // İleride buraya deleteBooking vb. eklenecek
};

export default bookingService;