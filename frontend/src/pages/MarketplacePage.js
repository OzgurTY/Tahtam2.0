import React, { useState, useEffect } from 'react';
import marketplaceService from '../services/marketplaceService';
import './MarketplacePage.css'; // Bu CSS dosyasını birazdan oluşturacağız

function MarketplacePage() {
  // Sayfanın "state" (durum) yönetimi
  const [marketplaces, setMarketplaces] = useState([]); // Pazaryeri listesi
  const [isLoading, setIsLoading] = useState(false); // Yükleniyor durumu
  const [error, setError] = useState(null); // Hata mesajı

  // Form state'leri
  const [formName, setFormName] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formDays, setFormDays] = useState('');

  // Sayfa ilk yüklendiğinde pazaryerlerini çekmek için `useEffect`
  useEffect(() => {
    fetchMarketplaces();
  }, []);

  // Pazaryerlerini backend'den çeken fonksiyon
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

  // Formu gönderme (Submit) fonksiyonu
  const handleSubmit = (event) => {
    event.preventDefault(); // Sayfanın yeniden yüklenmesini engelle
    setError(null);

    // Girdiğimiz günleri (örn: "TUESDAY, FRIDAY") virgülle ayırıp dizi yap
    const openDaysArray = formDays.split(',')
                                .map(day => day.trim().toUpperCase()) // Temizle ve BÜYÜK HARF yap
                                .filter(day => day); // Boş olanları filtrele

    const newMarketplace = {
      name: formName,
      address: formAddress,
      openDays: openDaysArray
    };

    marketplaceService.createMarketplace(newMarketplace)
      .then(() => {
        // Başarılı olursa:
        fetchMarketplaces(); // Listeyi güncelle
        // Formu temizle
        setFormName('');
        setFormAddress('');
        setFormDays('');
      })
      .catch(err => {
        setError('Pazaryeri eklenirken bir hata oluştu.');
        console.error(err);
      });
  };

  return (
    <div className="page-container">
      <h2>Pazaryerleri Yönetimi</h2>

      {/* Hata Mesajı Alanı */}
      {error && <div className="error-message">{error}</div>}

      {/* Yeni Pazar Ekleme Formu */}
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
          <div className="form-group">
            <label>Açık Günler (Virgülle ayırın):</label>
            <input 
              type="text" 
              value={formDays}
              onChange={(e) => setFormDays(e.target.value)}
              placeholder="Örn: TUESDAY, FRIDAY"
              required 
            />
          </div>
          <button type="submit" className="submit-button">Ekle</button>
        </form>
      </div>

      {/* Mevcut Pazaryerleri Listesi */}
      <div className="card">
        <h3>Mevcut Pazaryerleri</h3>
        {isLoading ? (
          <p>Yükleniyor...</p>
        ) : (
          <ul className="marketplace-list">
            {marketplaces.map(market => (
              <li key={market.id}>
                <strong>{market.name}</strong> ({market.address})
                <small>Açık Günler: {market.openDays?.join(', ') || 'Belirtilmemiş'}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MarketplacePage;