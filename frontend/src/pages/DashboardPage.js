import React, { useState, useEffect } from 'react';
import marketplaceService from '../services/marketplaceService';
import dashboardService from '../services/dashboardService';
import BookingModal from '../components/BookingModal';
import './DashboardPage.css';

// YENİ: Bugünün tarihini YYYY-MM-DD formatında almak için yardımcı fonksiyon
const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

function DashboardPage() {
  // State'ler
  const [marketplaces, setMarketplaces] = useState([]);
  const [selectedMarketId, setSelectedMarketId] = useState('');

  // --- DEĞİŞİKLİK: 'selectedDay' ve 'openDays' state'leri kaldırıldı ---
  // const [selectedDay, setSelectedDay] = useState('');
  // const [openDays, setOpenDays] = useState([]); 
  const [selectedDate, setSelectedDate] = useState(getTodayString()); // YENİ: Tarih state'i eklendi

  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal state'leri
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stallToBook, setStallToBook] = useState(null);

  // Sayfa yüklenince pazaryeri listesini çek
  useEffect(() => {
    marketplaceService.getMarketplaces()
      .then(response => {
        setMarketplaces(response.data);
      })
      .catch(err => console.error("Pazaryerleri yüklenemedi:", err));
  }, []);

  // Pazaryeri seçimi değişince
  const handleMarketplaceChange = (e) => {
    const marketId = e.target.value;
    setSelectedMarketId(marketId);
    setSummary(null); // Özeti temizle
    // openDays state'leri kaldırıldı

    // Pazar ve tarih seçiliyse veriyi çek
    if (marketId && selectedDate) {
      fetchSummary(marketId, selectedDate);
    }
  };

  // --- YENİ: Tarih seçimi değişince ---
  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setSummary(null); // Özeti temizle

    if (selectedMarketId && date) {
      fetchSummary(selectedMarketId, date);
    }
  };

  // Özet verisini çeken fonksiyon (parametre değişti)
  const fetchSummary = (marketId, date) => {
    setIsLoading(true);
    setError(null);
    dashboardService.getMarketDaySummary(marketId, date)
      .then(response => {
        setSummary(response.data);
        setIsLoading(false);
      })
      .catch(err => {
        // Backend'den gelen "Pazar açık değil" hatasını göster
        if (err.response && err.response.data) {
          setError(err.response.data);
        } else {
          setError('Özet verisi çekilirken hata oluştu.');
        }
        setIsLoading(false);
        console.error(err);
      });
  };

  // Modal fonksiyonları
  const handleOpenModal = (stall) => {
    setStallToBook(stall);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setStallToBook(null);
  };
  const handleBookingSuccess = () => {
    handleCloseModal();
    fetchSummary(selectedMarketId, selectedDate); // Özeti güncel tarihle yenile
  };

  return (
    <div className="page-container">
      <h2>Dashboard</h2>
      {error && <div className="error-message">{error}</div>}

      {/* Kontrol Paneli */}
      <div className="card dashboard-controls">
        <div className="form-group">
          <label>Pazaryeri Seçin:</label>
          <select className="marketplace-select" value={selectedMarketId} onChange={handleMarketplaceChange}>
            <option value="">-- Pazar Seçin --</option>
            {marketplaces.map(market => (
              <option key={market.id} value={market.id}>
                {market.name}
              </option>
            ))}
          </select>
        </div>

        {/* --- DEĞİŞİKLİK: Gün dropdown'ı yerine Tarih seçici --- */}
        <div className="form-group">
          <label>Tarih Seçin:</label>
          <input 
            type="date"
            className="marketplace-select" // Aynı stili kullansın
            value={selectedDate}
            onChange={handleDateChange}
            disabled={!selectedMarketId} // Pazar seçilmeden tarih seçemez
          />
        </div>
      </div>

      {/* Yükleniyor... göstergesi */}
      {isLoading && <div className="card"><p>Yükleniyor...</p></div>}

      {/* Özet Kartları */}
      {summary && (
        <>
          <div className="summary-cards">
            <div className="summary-card">
              <h4>Toplam Tahta</h4>
              <span>{summary.totalStalls}</span>
            </div>
            <div className="summary-card available">
              <h4>Boş Tahta</h4>
              <span>{summary.availableStallsCount}</span>
            </div>
            <div className="summary-card booked">
              <h4>Dolu Tahta</h4>
              <span>{summary.bookedStallsCount}</span>
            </div>
          </div>

          {/* Boşta Olan Tahtalar Listesi */}
          <div className="card">
            <h3>Boşta Olan Tahtalar ({selectedDate})</h3>
            <ul className="stall-list">
              {summary.availableStalls.length > 0 ? summary.availableStalls.map(stall => (
                <li key={stall.id} className="stall-list-item">
                  <div>
                    <strong>{stall.stallNumber}</strong>
                    <small>Ürün Tipleri: {stall.productTypes?.join(', ') || 'Belirtilmemiş'}</small>
                  </div>
                  <button className="book-button" onClick={() => handleOpenModal(stall)}>
                    Kirala
                  </button>
                </li>
              )) : (
                <p>Bu pazar ve tarih için tüm tahtalar dolu veya hiç tahta yok.</p>
              )}
            </ul>
          </div>
        </>
      )}

      <BookingModal 
        show={isModalOpen}
        onClose={handleCloseModal}
        stall={stallToBook}
        rentalDate={selectedDate}
        marketId={selectedMarketId}
        onBookingSuccess={handleBookingSuccess}
      />
    </div>
  );
}

export default DashboardPage;