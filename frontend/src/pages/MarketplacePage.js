import React, { useState, useEffect } from 'react';
import marketplaceService from '../services/marketplaceService';
import './MarketplacePage.css';

// YENİ: Backend'deki DayOfWeek enum'u ile eşleşen sabit
// (Büyük/küçük harf duyarlılığı için backend'deki gibi BÜYÜK harf kullanıyoruz)
const DAYS_OF_WEEK = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY"
];

function MarketplacePage() {
  const [marketplaces, setMarketplaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state'leri DEĞİŞTİ
  const [formName, setFormName] = useState('');
  const [formAddress, setFormAddress] = useState('');
  // DEĞİŞTİ: String yerine Set (küme) kullanarak seçili günleri tutacağız
  const [selectedDays, setSelectedDays] = useState(new Set());

  useEffect(() => {
    fetchMarketplaces();
  }, []);

  const fetchMarketplaces = () => {
    setIsLoading(true);
    marketplaceService.getMarketplaces()
      .then(response => {
        setMarketplaces(response.data);
        setIsLoading(false);
      })
      .catch(err => {
        setError('Pazaryerleri yüklenirken bir hata oluştu.');
        setIsLoading(false);
        console.error(err);
      });
  };

  // YENİ: Checkbox değişimlerini yöneten fonksiyon
  const handleDayChange = (event) => {
    const { value, checked } = event.target;

    // Set state'ini kopyalayarak güncelle (immutable pattern)
    const newSelectedDays = new Set(selectedDays);
    if (checked) {
      newSelectedDays.add(value); // İşaretlendiyse ekle
    } else {
      newSelectedDays.delete(value); // İşaret kaldırıldıysa çıkar
    }
    setSelectedDays(newSelectedDays);
  };

  // Formu gönderme (Submit) fonksiyonu GÜNCELLENDİ
  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);

    // DEĞİŞTİ: String'i split() yapmak yerine Set'i Array'e çevir
    const openDaysArray = Array.from(selectedDays);

    if (openDaysArray.length === 0) {
      setError("Lütfen en az bir açık gün seçin.");
      return;
    }

    const newMarketplace = {
      name: formName,
      address: formAddress,
      openDays: openDaysArray
    };

    marketplaceService.createMarketplace(newMarketplace)
      .then(() => {
        fetchMarketplaces(); 
        // Formu temizle
        setFormName('');
        setFormAddress('');
        setSelectedDays(new Set()); // DEĞİŞTİ: Set'i sıfırla
      })
      .catch(err => {
        setError('Pazaryeri eklenirken bir hata oluştu.');
        console.error(err);
      });
  };

  // Helper: Günü Türkçeleştirmek için (isteğe bağlı)
  const a = (day) => {
      const map = {
          "MONDAY": "Pazartesi", "TUESDAY": "Salı", "WEDNESDAY": "Çarşamba",
          "THURSDAY": "Perşembe", "FRIDAY": "Cuma", "SATURDAY": "Cumartesi", "SUNDAY": "Pazar"
      };
      return map[day] || day;
  }

  return (
    <div className="page-container">
      <h2>Pazaryerleri Yönetimi</h2>

      {error && <div className="error-message">{error}</div>}

      {/* Yeni Pazar Ekleme Formu GÜNCELLENDİ */}
      <div className="card">
        <h3>Yeni Pazaryeri Ekle</h3>
        <form onSubmit={handleSubmit} className="marketplace-form">
          <div className="form-group">
            <label>Pazar Adı:</label>
            <input 
              type="text" 
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>Adres:</label>
            <input 
              type="text" 
              value={formAddress}
              onChange={(e) => setFormAddress(e.target.value)}
              required 
            />
          </div>

          {/* --- DEĞİŞİKLİK: Text input yerine Checkbox grubu --- */}
          <div className="form-group full-width">
            <label>Açık Günler:</label>
            <div className="checkbox-group">
              {DAYS_OF_WEEK.map(day => (
                <label key={day} className="checkbox-item">
                  <input
                    type="checkbox"
                    value={day}
                    checked={selectedDays.has(day)}
                    onChange={handleDayChange}
                  />
                  {/* Backend BÜYÜK harf beklediği için değeri `day`, görüneni `translate(day)` yaptık */}
                  {a(day)}
                </label>
              ))}
            </div>
          </div>
          {/* --- DEĞİŞİKLİK SONU --- */}

          <button type="submit" className="submit-button">Ekle</button>
        </form>
      </div>

      {/* Mevcut Pazaryerleri Listesi (Görünüm GÜNCELLENDİ) */}
      <div className="card">
        <h3>Mevcut Pazaryerleri</h3>
        {isLoading ? (
          <p>Yükleniyor...</p>
        ) : (
          <ul className="marketplace-list">
            {marketplaces.map(market => (
              <li key={market.id}>
                <strong>{market.name}</strong> ({market.address})
                <small>
                  Açık Günler: {market.openDays?.map(a).join(', ') || 'Belirtilmemiş'}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MarketplacePage;