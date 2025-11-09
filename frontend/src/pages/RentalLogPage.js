import React, { useState, useEffect, useMemo } from 'react';
import rentalService from '../services/rentalService';
import stallService from '../services/stallService';
import tenantService from '../services/tenantService';
import ConfirmationModal from '../components/ConfirmationModal'; // <-- YENİ İMPORT
import './RentalLogPage.css';

function RentalLogPage() {
  const [rentals, setRentals] = useState([]);
  const [stalls, setStalls] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- YENİ SİLME MODALI STATE'LERİ ---
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [rentalToDelete, setRentalToDelete] = useState(null);

  const stallMap = useMemo(() => 
    new Map(stalls.map(s => [s.id, s.stallNumber])), [stalls]);

  const tenantMap = useMemo(() => 
    new Map(tenants.map(t => [t.id, t.name])), [tenants]);

  const fetchAllData = async () => {
    // ... (Bu fonksiyon değişmedi)
    setIsLoading(true);
    setError(null);
    try {
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

  useEffect(() => {
    fetchAllData();
  }, []);

  // --- YENİ SİLME FONKSİYONLARI ---
  const handleDeleteClick = (rental) => {
    setRentalToDelete(rental);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!rentalToDelete) return;
    setError(null);
    rentalService.deleteRental(rentalToDelete.id)
      .then(() => {
        fetchAllData(); // Tüm listeyi yenile
        closeConfirmModal();
      })
      .catch(err => {
        setError('Kiralama kaydı silinirken bir hata oluştu.');
        console.error(err);
        closeConfirmModal();
      });
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setRentalToDelete(null);
  };

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
                <th>İşlemler</th> {/* <-- YENİ SÜTUN */}
              </tr>
            </thead>
            <tbody>
              {rentals.length > 0 ? rentals.map(rental => (
                <tr key={rental.id}>
                  <td>{rental.rentalDate}</td>
                  <td>{stallMap.get(rental.stallId) || 'Bilinmeyen Tahta'}</td>
                  <td>{tenantMap.get(rental.tenantId) || 'Bilinmeyen Kiracı'}</td>
                  <td>{rental.price.toFixed(2)} ₺</td>
                  <td>
                    {/* --- YENİ SİLME BUTONU --- */}
                    <button 
                      className="delete-button"
                      onClick={() => handleDeleteClick(rental)}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5">Henüz kiralama kaydı bulunamadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* --- YENİ MODAL EKLEMESİ --- */}
      <ConfirmationModal
        show={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={handleConfirmDelete}
        title="Kiralama Kaydını Sil"
        message={
          rentalToDelete 
            ? `${rentalToDelete.rentalDate} tarihli, ${stallMap.get(rentalToDelete.stallId)} nolu tahta için olan kiralama kaydını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`
            : "Bu kaydı silmek istediğinizden emin misiniz?"
        }
      />
    </div>
  );
}

export default RentalLogPage;