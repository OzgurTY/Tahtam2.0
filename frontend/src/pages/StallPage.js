import React, { useState, useEffect } from 'react';
import marketplaceService from '../services/marketplaceService';
import stallService from '../services/stallService';
import './StallPage.css'; // Stil dosyamız

function StallPage() {
  // State'ler
  const [marketplaces, setMarketplaces] = useState([]); // Tüm pazarlar (dropdown için)
  const [selectedMarketplace, setSelectedMarketplace] = useState(''); // Seçili pazar ID'si
  const [stalls, setStalls] = useState([]); // Seçili pazara ait tahtalar
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state'leri
  const [formStallNumber, setFormStallNumber] = useState('');
  const [formProductTypes, setFormProductTypes] = useState('');

  // Sayfa yüklenince pazaryeri listesini çek
  useEffect(() => {
    marketplaceService.getMarketplaces()
      .then(response => {
        setMarketplaces(response.data);
      })
      .catch(err => console.error("Pazaryerleri yüklenemedi:", err));
  }, []);

  // Seçili pazaryeri değiştikçe o pazara ait tahtaları çeken fonksiyon
  const fetchStalls = (marketId) => {
    if (!marketId) {
      setStalls([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    stallService.getStallsByMarketplace(marketId)
      .then(response => {
        setStalls(response.data);
        setIsLoading(false);
      })
      .catch(err => {
        setError('Tahtalar yüklenirken bir hata oluştu.');
        setIsLoading(false);
        console.error(err);
      });
  };

  // Dropdown'dan pazar seçildiğinde
  const handleMarketplaceChange = (event) => {
    const marketId = event.target.value;
    setSelectedMarketplace(marketId);
    fetchStalls(marketId);
  };

  // Yeni tahta ekleme formu gönderildiğinde
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedMarketplace) {
      setError('Lütfen önce bir pazaryeri seçin.');
      return;
    }
    setError(null);

    // Ürün tiplerini virgülle ayırıp dizi yap
    const productTypesArray = formProductTypes.split(',')
                                  .map(type => type.trim())
                                  .filter(type => type);

    const newStall = {
      stallNumber: formStallNumber,
      marketplaceId: selectedMarketplace,
      productTypes: productTypesArray
    };

    stallService.createStall(newStall)
      .then(() => {
        fetchStalls(selectedMarketplace); // Listeyi güncelle
        // Formu temizle
        setFormStallNumber('');
        setFormProductTypes('');
      })
      .catch(err => {
        setError('Tahta eklenirken bir hata oluştu.');
        console.error(err);
      });
  };

  return (
    <div className="page-container">
      <h2>Tahta Yönetimi</h2>

      {/* Hata Mesajı Alanı */}
      {error && <div className="error-message">{error}</div>}

      {/* 1. Adım: Pazaryeri Seçimi */}
      <div className="card">
        <h3>Pazaryeri Seç</h3>
        <select 
          className="marketplace-select" 
          value={selectedMarketplace} 
          onChange={handleMarketplaceChange}
        >
          <option value="">-- Lütfen bir pazar seçin --</option>
          {marketplaces.map(market => (
            <option key={market.id} value={market.id}>
              {market.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sadece bir pazar yeri seçildiğinde 
        o pazara ait tahta ekleme ve listeleme kısımlarını göster
      */}
      {selectedMarketplace && (
        <>
          {/* 2. Adım: Yeni Tahta Ekleme Formu */}
          <div className="card">
            <h3>Yeni Tahta Ekle</h3>
            <form onSubmit={handleSubmit} className="stall-form">
              <div className="form-group">
                <label>Tahta No:</label>
                <input 
                  type="text" 
                  value={formStallNumber}
                  onChange={(e) => setFormStallNumber(e.target.value)}
                  placeholder="Örn: 3B/114"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Ürün Tipleri (Virgülle ayırın):</label>
                <input 
                  type="text" 
                  value={formProductTypes}
                  onChange={(e) => setFormProductTypes(e.target.value)}
                  placeholder="Örn: Gıda, Tekstil"
                  required 
                />
              </div>
              <button type="submit" className="submit-button">Ekle</button>
            </form>
          </div>

          {/* 3. Adım: Tahta Listesi */}
          <div className="card">
            <h3>Tahtalar</h3>
            {isLoading ? (
              <p>Yükleniyor...</p>
            ) : (
              <ul className="stall-list">
                {stalls.length > 0 ? stalls.map(stall => (
                  <li key={stall.id}>
                    <strong>{stall.stallNumber}</strong>
                    <small>Ürün Tipleri: {stall.productTypes?.join(', ') || 'Belirtilmemiş'}</small>
                  </li>
                )) : (
                  <p>Bu pazaryerine ait kayıtlı tahta bulunamadı.</p>
                )}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default StallPage;