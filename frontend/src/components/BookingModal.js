import React, { useState, useEffect } from 'react';
import tenantService from '../services/tenantService';
import rentalService from '../services/rentalService'; // <-- DEĞİŞİKLİK: 'bookingService' 'rentalService' oldu
import './BookingModal.css';

/**
 * Kiralama yapmak için açılan modal (popup) bileşeni.
 * @param {object} props
 * @param {boolean} props.show
 * @param {function} props.onClose
 * @param {object} props.stall Kiralanacak tahta
 * @param {string} props.rentalDate Kiralanacak tarih (Örn: "2025-11-08")
 * @param {string} props.marketId
 * @param {function} props.onBookingSuccess
 */
function BookingModal({ show, onClose, stall, rentalDate, marketId, onBookingSuccess }) { // <-- DEĞİŞİKLİK: 'day' prop'u 'rentalDate' oldu

  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
  }, [show]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const rentalData = { // <-- Değişti
      stallId: stall.id,
      tenantId: selectedTenant,
      marketplaceId: marketId,
      rentalDate: rentalDate, // <-- DEĞİŞİKLİK: 'dayOfWeek' yerine 'rentalDate'
      price: parseFloat(price)
    };

    rentalService.createRental(rentalData) // <-- DEĞİŞİKLİK: 'rentalService' kullanılıyor
      .then(() => {
        setIsLoading(false);
        onBookingSuccess(); // Dashboard'u yenilemek için
        handleClose();
      })
      .catch(err => {
        setIsLoading(false);
        if (err.response && err.response.status === 409) {
          // Backend'den gelen "zaten dolu" mesajını göster
          setError(err.response.data);
        } else {
          setError("Kiralama yapılamadı.");
        }
        console.error(err);
      });
  };

  if (!show) {
    return null;
  }

  const handleClose = () => {
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
        {/* DEĞİŞİKLİK: 'day' yerine 'rentalDate' göster */}
        <p><strong>Tahta:</strong> {stall.stallNumber} | <strong>Tarih:</strong> {rentalDate}</p>

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