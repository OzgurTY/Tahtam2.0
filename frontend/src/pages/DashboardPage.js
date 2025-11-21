import React, { useState, useEffect } from 'react';
import marketplaceService from '../services/marketplaceService';
import dashboardService from '../services/dashboardService';
import BookingModal from '../components/BookingModal';
import './DashboardPage.css';
import MassRentalModal from '../components/MassRentalModal'; 

// ... (getTodayString fonksiyonu aynı)
const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

function DashboardPage() {
  // ... (diğer state'ler aynı)
  const [marketplaces, setMarketplaces] = useState([]);
  const [selectedMarketId, setSelectedMarketId] = useState('');
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stallToBook, setStallToBook] = useState(null);
  const [isMassModalOpen, setIsMassModalOpen] = useState(false); 

  // --- YENİ RAPOR STATE'İ ---
  const [incomeReport, setIncomeReport] = useState(null); // Aylık gelir raporunu tutar

  // ... (useEffect - getMarketplaces aynı)
  useEffect(() => {
    marketplaceService.getMarketplaces()
      .then(response => {
        setMarketplaces(response.data);
      })
      .catch(err => console.error("Pazaryerleri yüklenemedi:", err));
  }, []);

  // ... (handleMarketplaceChange, handleDateChange aynı)
   const handleMarketplaceChange = (e) => {
    const marketId = e.target.value;
    setSelectedMarketId(marketId);
    setSummary(null);
    setIncomeReport(null); // YENİ: Raporu da temizle
    if (marketId && selectedDate) {
      fetchSummaryAndReport(marketId, selectedDate); // YENİ: İki veriyi de çek
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setSummary(null);
    setIncomeReport(null); // YENİ: Raporu da temizle
    if (selectedMarketId && date) {
      fetchSummaryAndReport(selectedMarketId, date); // YENİ: İki veriyi de çek
    }
  };

  // --- YENİ: İKİ API'Yİ BİRDEN ÇAĞIRAN FONKSİYON ---
  const fetchSummaryAndReport = (marketId, date) => {
    setIsLoading(true);
    setError(null);

    // 1. Günlük "Boş Tahta" Özeti API'si
    const summaryPromise = dashboardService.getMarketDaySummary(marketId, date);

    // 2. Aylık "Gelir" Raporu API'si
    // Seçilen tarihin ayının başını ve sonunu hesapla
    const selectedMonth = new Date(date + "T00:00:00"); // Saat dilimi sorunlarını önle
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth(); // 0-11
    const startDate = new Date(year, month, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0]; // Ayın son günü

    const reportPromise = dashboardService.getIncomeReport(startDate, endDate);

    // İki isteği de aynı anda yap
    Promise.all([summaryPromise, reportPromise])
      .then(([summaryRes, reportRes]) => {
        setSummary(summaryRes.data);
        setIncomeReport(reportRes.data); // YENİ: Rapor state'ini ayarla
        setIsLoading(false);
      })
      .catch(err => {
        if (err.response && err.response.data) {
          setError(err.response.data);
        } else {
          setError('Veriler çekilirken hata oluştu.');
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
    fetchSummaryAndReport(selectedMarketId, selectedDate); // YENİ: İki veriyi de yenile
  };

  return (
    <div className="page-container">
      <h2>Dashboard</h2>
      {error && <div className="error-message">{error}</div>}

      {/* Kontrol Paneli (Değişiklik yok) */}
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
          <label>Tarih Seçin:</label>
          <input 
            type="date"
            className="marketplace-select"
            value={selectedDate}
            onChange={handleDateChange}
            disabled={!selectedMarketId}
          />
        </div>
        <div className="form-group" style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}>
          <button 
            className="submit-button" 
            style={{height: '42px', width: '100%'}} // Tarih kutusuyla hizalamak için
            onClick={() => setIsMassModalOpen(true)}
            disabled={!selectedMarketId} // Pazar seçili değilse pasif olsun
          >
            Toplu Kiralama Yap
          </button>
        </div>
      </div>

      {isLoading && <div className="card"><p>Yükleniyor...</p></div>}

      {/* Özet Kartları GÜNCELLENDİ (Aylık Gelir eklendi) */}
      {summary && incomeReport && ( // <-- YENİ: İki veri de yüklendiğinde göster
        <div className="summary-cards">
          {/* --- YENİ KART: AYLIK GELİR --- */}
          <div className="summary-card income">
            <h4>Bu Ay Tahsil Edilen</h4>
            <span>{incomeReport.totalCollectedIncome.toFixed(2)} ₺</span>
            <small>Beklenen: {incomeReport.totalExpectedIncome.toFixed(2)} ₺</small>
          </div>
          <div className="summary-card available">
            <h4>Boş Tahta (Bugün)</h4>
            <span>{summary.availableStallsCount}</span>
            <small>Toplam {summary.totalStalls} tahta</small>
          </div>
          <div className="summary-card booked">
            <h4>Dolu Tahta (Bugün)</h4>
            <span>{summary.bookedStallsCount}</span>
            <small>&nbsp;</small> {/* Yüksekliği eşitlemek için */}
          </div>
        </div>
      )}

      {/* Boşta Olan Tahtalar Listesi (summary'ye bağlı) */}
      {summary && (
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
              <p>Bu pazar ve tarih için tüm tahtalar dolu veya pazar açık değil.</p>
            )}
          </ul>
        </div>
      )}

      {/* Kiralama Modalı (Değişiklik yok) */}
      <BookingModal 
        show={isModalOpen}
        onClose={handleCloseModal}
        stall={stallToBook}
        rentalDate={selectedDate}
        marketId={selectedMarketId}
        onBookingSuccess={handleBookingSuccess}
      />
      <MassRentalModal
          show={isMassModalOpen}
          onClose={() => setIsMassModalOpen(false)}
          marketId={selectedMarketId}
          onSuccess={() => fetchSummaryAndReport(selectedMarketId, selectedDate)}
      />
    </div>
  );
}

export default DashboardPage;