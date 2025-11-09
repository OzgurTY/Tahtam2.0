import React, { useState, useEffect, useMemo } from 'react';
import rentalService from '../services/rentalService';
import stallService from '../services/stallService';
import tenantService from '../services/tenantService';
import ConfirmationModal from '../components/ConfirmationModal';
import './RentalLogPage.css';

function RentalLogPage() {
  const [rentals, setRentals] = useState([]);
  const [stalls, setStalls] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [rentalToDelete, setRentalToDelete] = useState(null);

  const stallMap = useMemo(() => 
    new Map(stalls.map(s => [s.id, s.stallNumber])), [stalls]);

  const tenantMap = useMemo(() => 
    new Map(tenants.map(t => [t.id, t.name])), [tenants]);

  // Verileri çeken ana fonksiyon
  const fetchAllData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [rentalsRes, stallsRes, tenantsRes] = await Promise.all([
        rentalService.getAllRentals(),
        stallService.getAllStalls(),
        tenantService.getTenants()
      ]);
      // YENİ: Kayıtları tarihe göre (en yeniden en eskiye) sırala
      const sortedRentals = rentalsRes.data.sort((a, b) => 
        new Date(b.rentalDate) - new Date(a.rentalDate)
      );
      setRentals(sortedRentals);
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

  // --- SİLME FONKSİYONLARI (Değişiklik yok) ---
  const handleDeleteClick = (rental) => {
    setRentalToDelete(rental);
    setIsConfirmModalOpen(true);
  };
  const handleConfirmDelete = () => {
    if (!rentalToDelete) return;
    setError(null);
    rentalService.deleteRental(rentalToDelete.id)
      .then(() => {
        fetchAllData(); 
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

  // --- YENİ "ÖDENDİ İŞARETLE" FONKSİYONU ---
  const handleMarkAsPaid = (rentalId) => {
    setError(null);
    rentalService.updateRentalStatus(rentalId, "PAID") // API'yi çağır
      .then(() => {
        // Başarılı olursa, listeyi tekrar çekmek yerine
        // frontend'deki listeyi manuel güncelleyelim (daha hızlı)
        setRentals(prevRentals => 
          prevRentals.map(r => 
            r.id === rentalId ? { ...r, status: "PAID" } : r
          )
        );
      })
      .catch(err => {
        setError('Ödeme durumu güncellenirken bir hata oluştu.');
        console.error(err);
      });
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
                <th>Durum</th> {/* <-- YENİ SÜTUN */}
                <th>Fiyat</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {rentals.length > 0 ? rentals.map(rental => (
                <tr key={rental.id}>
                  <td>{rental.rentalDate}</td>
                  <td>{stallMap.get(rental.stallId) || '...'}</td>
                  <td>{tenantMap.get(rental.tenantId) || '...'}</td>
                  {/* --- YENİ DURUM GÖSTERGESİ --- */}
                  <td>
                    <span className={`status-badge status-${rental.status}`}>
                      {rental.status === 'PAID' ? 'Ödendi' : 'Bekleniyor'}
                    </span>
                  </td>
                  <td>{rental.price.toFixed(2)} ₺</td>
                  {/* --- YENİ İŞLEM BUTONLARI --- */}
                  <td className="actions-cell">
                    {rental.status === 'PENDING' && (
                      <button 
                        className="pay-button"
                        onClick={() => handleMarkAsPaid(rental.id)}
                      >
                        Ödendi İşaretle
                      </button>
                    )}
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
                  <td colSpan="6">Henüz kiralama kaydı bulunamadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Silme Modalı (Değişiklik yok) */}
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