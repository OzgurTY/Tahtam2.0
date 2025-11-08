import React, { useState, useEffect } from 'react';
import tenantService from '../services/tenantService';
import bookingService from '../services/bookingService';
import './BookingModal.css'; // Stil dosyamız

/**
 * Kiralama yapmak için açılan modal (popup) bileşeni.
 * @param {object} props
 * @param {boolean} props.show Modalın görünür olup olmadığı
 * @param {function} props.onClose Modalı kapatma fonksiyonu
 * @param {object} props.stall Kiralanacak tahta
 * @param {string} props.day Kiralanacak gün (Örn: "TUESDAY")
 * @param {string} props.marketId Kiralamanın yapıldığı pazarın ID'si
 * @param {function} props.onBookingSuccess Başarılı kiralama sonrası çağrılacak fonksiyon
 */
function BookingModal({ show, onClose, stall, day, marketId, onBookingSuccess }) {
  const [tenants, setTenants] = useState([]); // Kiracı listesi
  const [selectedTenant, setSelectedTenant] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Modal her açıldığında kiracı listesini çek
  useEffect(() => {
    if (show) {
      tenantService.getTenants()
        .then(response => {
          setTenants(response.data);
        })
        .catch(err => {
          setError("Kiracı listesi yüklenemedi.");
          console.error(err);
        });
    }
  }, [show]); // Sadece 'show' true olduğunda çalışır

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const bookingData = {
      stallId: stall.id,
      tenantId: selectedTenant,
      marketplaceId: marketId,
      dayOfWeek: day,
      price: parseFloat(price)
    };

     bookingService.createBooking(bookingData)
      .then(() => {
        setIsLoading(false);
        onBookingSuccess(); // Dashboard'u yenilemek için
        handleClose();
      })
      .catch(err => {
        setIsLoading(false);
        if (err.response && err.response.status === 409) {
          setError("Bu tahta bu gün için zaten dolu.");
        } else {
          setError("Kiralama yapılamadı.");
        }
        console.error(err);
      });
    
  };

  // handleSubmit içindeki `bookingService.createBooking` kısmını DÜZELTELİM:
  // Kodu test etmek için `onBookingSuccess(bookingData);` satırını siliyoruz
  // ve yorum satırı olan `bookingService` kısmını açıyoruz.
  // Ayrıca `bookingService` import'unu dosyanın en üstüne ekliyoruz.

  if (!show) {
    return null;
  }

  const handleClose = () => {
    // Modal kapanırken form verilerini sıfırla
    setSelectedTenant('');
    setPrice('');
    setError(null);
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content card">
        <h2>Tahta Kirala</h2>
        <p><strong>Tahta:</strong> {stall.stallNumber} | <strong>Gün:</strong> {day}</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Kiracı Seç:</label>
            <select 
              value={selectedTenant}
              onChange={(e) => setSelectedTenant(e.target.value)}
              required
              className="marketplace-select"
            >
              <option value="">-- Kiracı Seçin --</option>
              {tenants.map(tenant => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name} ({tenant.productSold})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Kira Bedeli (Fiyat):</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              placeholder="Örn: 150.0"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={handleClose} disabled={isLoading}>
              İptal
            </button>
            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? "Kiralanıyor..." : "Kirala"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingModal;