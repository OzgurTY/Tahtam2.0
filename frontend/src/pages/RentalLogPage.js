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

  // --- SİLME MODALI STATE'LERİ ---
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [rentalToDelete, setRentalToDelete] = useState(null); // Tekil silme için

  // --- YENİ TOPLU SEÇİM STATE'İ ---
  const [selectedRentals, setSelectedRentals] = useState(new Set());

  const stallMap = useMemo(() => 
    new Map(stalls.map(s => [s.id, s.stallNumber])), [stalls]);

  const tenantMap = useMemo(() => 
    new Map(tenants.map(t => [t.id, t.name])), [tenants]);

  const fetchAllData = async () => {
    // ... (Bu fonksiyon değişmedi, sadece setIsLoading(true) en başa alındı) ...
    setIsLoading(true);
    setError(null);
    try {
      const [rentalsRes, stallsRes, tenantsRes] = await Promise.all([
        rentalService.getAllRentals(),
        stallService.getAllStalls(),
        tenantService.getTenants()
      ]);
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

  // --- SİLME FONKSİYONLARI (GÜNCELLENDİ) ---
  const handleDeleteClick = (rental) => {
    setRentalToDelete(rental); // Tekil silme için ayarla
    setIsConfirmModalOpen(true);
  };

  // YENİ: Toplu silme modalını açan fonksiyon
  const handleBatchDeleteClick = () => {
    setRentalToDelete(null); // Tekil silmeyi temizle
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setError(null);

    let deletePromise;

    if (rentalToDelete) {
      // --- Tekil Silme ---
      deletePromise = rentalService.deleteRental(rentalToDelete.id);
    } else if (selectedRentals.size > 0) {
      // --- Toplu Silme ---
      const idsToDelete = Array.from(selectedRentals);
      deletePromise = rentalService.deleteBatchRentals(idsToDelete);
    } else {
      closeConfirmModal();
      return;
    }

    deletePromise
      .then(() => {
        fetchAllData(); 
        closeConfirmModal();
        setSelectedRentals(new Set()); // Seçimleri sıfırla
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

  const handleMarkAsPaid = (rentalId) => {
    // ... (Bu fonksiyon değişmedi)
    setError(null);
    rentalService.updateRentalStatus(rentalId, "PAID")
      .then(() => {
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

  // --- YENİ SEÇİM FONKSİYONLARI ---
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      // Hepsini seç
      const allIds = new Set(rentals.map(r => r.id));
      setSelectedRentals(allIds);
    } else {
      // Hepsini bırak
      setSelectedRentals(new Set());
    }
  };

  const handleSelectOne = (event, rentalId) => {
    const newSelection = new Set(selectedRentals);
    if (event.target.checked) {
      newSelection.add(rentalId);
    } else {
      newSelection.delete(rentalId);
    }
    setSelectedRentals(newSelection);
  };

  // Hepsini seç checkbox'ının durumunu belirle
  const isAllSelected = rentals.length > 0 && selectedRentals.size === rentals.length;

  return (
    <div className="page-container">
      <h2>Kiralama Kayıtları (Loglar)</h2>

      {error && <div className="error-message">{error}</div>}

      {/* --- YENİ TOPLU İŞLEM ALANI --- */}
      {selectedRentals.size > 0 && (
        <div className="batch-actions card">
          <p>{selectedRentals.size} kayıt seçildi.</p>
          <button 
            className="delete-button"
            onClick={handleBatchDeleteClick}
          >
            Seçilenleri Sil
          </button>
        </div>
      )}

      <div className="card">
        {isLoading ? (
          <p>Yükleniyor...</p>
        ) : (
          <table className="log-table">
            <thead>
              <tr>
                {/* --- YENİ CHECKBOX SÜTUNU --- */}
                <th className="checkbox-cell">
                  <input 
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    title="Tümünü Seç"
                  />
                </th>
                <th>Tarih</th>
                <th>Tahta No</th>
                <th>Kiracı</th>
                <th>Durum</th>
                <th>Fiyat</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {rentals.length > 0 ? rentals.map(rental => (
                <tr key={rental.id} className={selectedRentals.has(rental.id) ? 'selected-row' : ''}>
                  {/* --- YENİ CHECKBOX SÜTUNU --- */}
                  <td className="checkbox-cell">
                    <input 
                      type="checkbox"
                      checked={selectedRentals.has(rental.id)}
                      onChange={(e) => handleSelectOne(e, rental.id)}
                    />
                  </td>
                  <td>{rental.rentalDate}</td>
                  <td>{stallMap.get(rental.stallId) || '...'}</td>
                  <td>{tenantMap.get(rental.tenantId) || '...'}</td>
                  <td>
                    <span className={`status-badge status-${rental.status}`}>
                      {rental.status === 'PAID' ? 'Ödendi' : 'Bekleniyor'}
                    </span>
                  </td>
                  <td>{rental.price.toFixed(2)} ₺</td>
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
                  <td colSpan="7">Henüz kiralama kaydı bulunamadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmationModal
        show={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={handleConfirmDelete}
        // --- YENİ: Dinamik Mesaj ---
        title={rentalToDelete ? "Kiralama Kaydını Sil" : "Seçilen Kayıtları Sil"}
        message={
          rentalToDelete 
            ? `${rentalToDelete.rentalDate} tarihli, ${stallMap.get(rentalToDelete.stallId)} nolu kaydı silmek istediğinizden emin misiniz?`
            : `${selectedRentals.size} adet kiralama kaydını topluca silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`
        }
      />
    </div>
  );
}

export default RentalLogPage;