import React, { useState, useEffect } from 'react';
import tenantService from '../services/tenantService';
import rentalService from '../services/rentalService';
import './BookingModal.css';

// Günü (TUESDAY) ve Ayı (Kasım) almak için yardımcı
const getDayAndMonthFromDate = (dateString) => {
    const date = new Date(dateString + "T00:00:00");
    const day = date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase(); // "TUESDAY"
    const monthName = date.toLocaleDateString('tr-TR', { month: 'long' }); // "Kasım"
    const year = date.getFullYear(); // 2025
    const month = date.getMonth() + 1; // 11 (Kasım için 1-12 arası)
    return { day, monthName, year, month };
};

const translateDay = (day) => {
  const map = {
    "MONDAY": "Pazartesi",
    "TUESDAY": "Salı",
    "WEDNESDAY": "Çarşamba",
    "THURSDAY": "Perşembe",
    "FRIDAY": "Cuma",
    "SATURDAY": "Cumartesi",
    "SUNDAY": "Pazar"
  };
  return map[day] || day;
};

function BookingModal({ show, onClose, stall, rentalDate, marketId, onBookingSuccess }) {

  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- YENİ KİRALAMA TİPİ STATE'İ ---
  const [rentalType, setRentalType] = useState('single'); // 'single' veya 'monthly'

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

  // --- SUBMIT FONKSİYONU GÜNCELLENDİ (Toplu/Tekil) ---
  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    let apiCall;
    const { day, month, year } = getDayAndMonthFromDate(rentalDate);

    if (rentalType === 'monthly') {
      // --- TOPLU (AYLIK) İSTEK ---
      const batchData = {
        stallId: stall.id,
        tenantId: selectedTenant,
        marketplaceId: marketId,
        price: parseFloat(price),
        year: year,
        month: month,
        dayOfWeek: day
      };
      apiCall = rentalService.createBatchRental(batchData);
    } else {
      // --- TEKİL (GÜNLÜK) İSTEK (Eski kod) ---
      const rentalData = {
        stallId: stall.id,
        tenantId: selectedTenant,
        marketplaceId: marketId,
        rentalDate: rentalDate,
        price: parseFloat(price)
      };
      apiCall = rentalService.createRental(rentalData);
    }

    apiCall.then(() => {
        setIsLoading(false);
        onBookingSuccess();
        handleClose();
      })
      .catch(err => {
        setIsLoading(false);
        if (err.response && (err.response.status === 409 || err.response.status === 500)) {
          setError(err.response.data); // Backend'den gelen "Zaten dolu" mesajını göster
        } else {
          setError("Kiralama yapılamadı.");
        }
        console.error(err);
      });
  };

  if (!show) {
    return null;
  }

  // Tarih bilgilerini hesapla
  const { day: dayName, monthName } = getDayAndMonthFromDate(rentalDate);

  const translatedDayName = translateDay(dayName);

  const handleClose = () => {
    setSelectedTenant('');
    setPrice('');
    setError(null);
    setIsLoading(false);
    setRentalType('single'); // YENİ: Modalı kapatırken tipi sıfırla
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content card">
        <h2>Tahta Kirala</h2>
        <p><strong>Tahta:</strong> {stall.stallNumber} | <strong>Seçilen Tarih:</strong> {rentalDate}</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>

          {/* --- YENİ KİRALAMA TİPİ SEÇENEĞİ --- */}
          <div className="form-group">
            <label>Kiralama Tipi:</label>
            <div className="rental-type-options">
              <label className="radio-item">
                <input 
                  type="radio" 
                  value="single"
                  checked={rentalType === 'single'} 
                  onChange={(e) => setRentalType(e.target.value)}
                />
                Sadece bugün ({rentalDate})
              </label>
              <label className="radio-item">
                <input 
                  type="radio" 
                  value="monthly"
                  checked={rentalType === 'monthly'} 
                  onChange={(e) => setRentalType(e.target.value)}
                />
                Tüm {monthName} ayı {translatedDayName} günleri
              </label>
            </div>
          </div>

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