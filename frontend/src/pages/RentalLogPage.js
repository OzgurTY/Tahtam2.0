import React, { useState, useEffect, useMemo } from 'react';
import rentalService from '../services/rentalService';
import stallService from '../services/stallService';
import tenantService from '../services/tenantService';
import './RentalLogPage.css'; // Stil dosyamız

function RentalLogPage() {
  const [rentals, setRentals] = useState([]);
  const [stalls, setStalls] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Veri araması için (client-side join) Map'ler oluştur
  const stallMap = useMemo(() => 
    new Map(stalls.map(s => [s.id, s.stallNumber])), [stalls]);

  const tenantMap = useMemo(() => 
    new Map(tenants.map(t => [t.id, t.name])), [tenants]);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Tüm verileri paralel olarak çek
        const [rentalsRes, stallsRes, tenantsRes] = await Promise.all([
          rentalService.getAllRentals(),
          stallService.getAllStalls(),
          tenantService.getTenants()
        ]);

        setRentals(rentalsRes.data);
        setStalls(stallsRes.data);
        setTenants(tenantsRes.data);
      } catch (err) {
        setError("Kayıtlar yüklenirken bir hata oluştu.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, []);

  return (
    <div className="page-container">
      <h2>Kiralama Kayıtları (Loglar)</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="card">
        {isLoading ? (
          <p>Yükleniyor...</p>
        ) : (
          <table className="log-table">
            <thead>
              <tr>
                <th>Tarih</th>
                <th>Tahta No</th>
                <th>Kiracı</th>
                <th>Fiyat</th>
              </tr>
            </thead>
            <tbody>
              {rentals.length > 0 ? rentals.map(rental => (
                <tr key={rental.id}>
                  <td>{rental.rentalDate}</td>
                  <td>{stallMap.get(rental.stallId) || 'Bilinmeyen Tahta'}</td>
                  <td>{tenantMap.get(rental.tenantId) || 'Bilinmeyen Kiracı'}</td>
                  <td>{rental.price.toFixed(2)} ₺</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4">Henüz kiralama kaydı bulunamadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default RentalLogPage;