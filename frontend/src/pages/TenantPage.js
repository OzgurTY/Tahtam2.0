import React, { useState, useEffect } from 'react';
import tenantService from '../services/tenantService';
import './TenantPage.css'; // Stil dosyamız

function TenantPage() {
  // State'ler
  const [tenants, setTenants] = useState([]); // Kiracı listesi
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state'leri
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formProduct, setFormProduct] = useState('');

  // Sayfa ilk yüklendiğinde kiracıları çek
  useEffect(() => {
    fetchTenants();
  }, []);

  // Kiracıları backend'den çeken fonksiyon
  const fetchTenants = () => {
    setIsLoading(true);
    tenantService.getTenants()
      .then(response => {
        setTenants(response.data);
        setIsLoading(false);
      })
      .catch(err => {
        setError('Kiracılar yüklenirken bir hata oluştu.');
        setIsLoading(false);
        console.error(err);
      });
  };

  // Formu gönderme (Submit) fonksiyonu
  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);

    const newTenant = {
      name: formName,
      phoneNumber: formPhone,
      productSold: formProduct,
    };

    tenantService.createTenant(newTenant)
      .then(() => {
        fetchTenants(); // Listeyi güncelle
        // Formu temizle
        setFormName('');
        setFormPhone('');
        setFormProduct('');
      })
      .catch(err => {
        setError('Kiracı eklenirken bir hata oluştu.');
        console.error(err);
      });
  };

  return (
    <div className="page-container">
      <h2>Kiracı Yönetimi</h2>

      {error && <div className="error-message">{error}</div>}

      {/* Yeni Kiracı Ekleme Formu */}
      <div className="card">
        <h3>Yeni Kiracı Ekle</h3>
        <form onSubmit={handleSubmit} className="tenant-form">
          <div className="form-group">
            <label>Ad Soyad:</label>
            <input 
              type="text" 
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>Telefon Numarası:</label>
            <input 
              type="text" 
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              placeholder="Örn: 0555 123 45 67"
              required 
            />
          </div>
          <div className="form-group">
            <label>Sattığı Ürün:</label>
            <input 
              type="text" 
              value={formProduct}
              onChange={(e) => setFormProduct(e.target.value)}
              placeholder="Örn: Zeytin, Peynir"
              required 
            />
          </div>
          <button type="submit" className="submit-button">Ekle</button>
        </form>
      </div>

      {/* Mevcut Kiracılar Listesi */}
      <div className="card">
        <h3>Kiracılar</h3>
        {isLoading ? (
          <p>Yükleniyor...</p>
        ) : (
          <ul className="tenant-list">
            {tenants.map(tenant => (
              <li key={tenant.id}>
                <strong>{tenant.name}</strong>
                <small>Telefon: {tenant.phoneNumber}</small>
                <small>Ürün: {tenant.productSold}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TenantPage;