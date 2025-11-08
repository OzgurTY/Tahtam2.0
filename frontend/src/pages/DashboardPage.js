import React, { useState, useEffect } from 'react';
import marketplaceService from '../services/marketplaceService';
import dashboardService from '../services/dashboardService';
import './DashboardPage.css'; // Stil dosyamız

function DashboardPage() {
  // State'ler
  const [marketplaces, setMarketplaces] = useState([]); // Tüm pazarlar (dropdown için)
  const [selectedMarketId, setSelectedMarketId] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [openDays, setOpenDays] = useState([]); // Seçili pazarın açık günleri

  const [summary, setSummary] = useState(null); // Özet verisi
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
    setSelectedDay(''); // Günü temizle

    if (marketId) {
      // Seçilen pazarın açık günlerini state'e al
      const market = marketplaces.find(m => m.id === marketId);
      setOpenDays(market.openDays || []);
    } else {
      setOpenDays([]);
    }
  };

  // Gün seçimi değişince
  const handleDayChange = (e) => {
    const day = e.target.value;
    setSelectedDay(day);

    if (selectedMarketId && day) {
      // Pazar ve Gün seçiliyse, özet verisini çek
      fetchSummary(selectedMarketId, day);
    } else {
      setSummary(null); // Seçimler eksikse özeti temizle
    }
  };

  // Özet verisini çeken fonksiyon
  const fetchSummary = (marketId, day) => {
    setIsLoading(true);
    setError(null);
    dashboardService.getMarketDaySummary(marketId, day)
      .then(response => {
        setSummary(response.data);
        setIsLoading(false);
      })
      .catch(err => {
        setError('Özet verisi çekilirken hata oluştu.');
        setIsLoading(false);
        console.error(err);
      });
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
        <div className="form-group">
          <label>Gün Seçin:</label>
          <select 
            className="marketplace-select" 
            value={selectedDay} 
            onChange={handleDayChange}
            disabled={!selectedMarketId} // Pazar seçilmeden günü seçemez
          >
            <option value="">-- Gün Seçin --</option>
            {openDays.map(day => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Yükleniyor... göstergesi */}
      {isLoading && <div className="card"><p>Yükleniyor...</p></div>}

      {/* Özet Kartları (Faz 5) */}
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

          {/* Boşta Olan Tahtalar Listesi (Faz 5) */}
          <div className="card">
            <h3>Boşta Olan Tahtalar ({selectedDay})</h3>
            <ul className="stall-list">
              {summary.availableStalls.length > 0 ? summary.availableStalls.map(stall => (
                <li key={stall.id}>
                  <strong>{stall.stallNumber}</strong>
                  <small>Ürün Tipleri: {stall.productTypes?.join(', ') || 'Belirtilmemiş'}</small>
                  {/* FAZ 4 İÇİN HAZIRLIK: Buraya "Kirala" butonu gelecek */}
                </li>
              )) : (
                <p>Bu pazar ve gün için tüm tahtalar dolu veya hiç tahta yok.</p>
              )}
            </ul>
          </div>
        </>
      )}

    </div>
  );
}

export default DashboardPage;