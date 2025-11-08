import React, { useState, useEffect } from 'react';
import marketplaceService from '../services/marketplaceService';
import stallService from '../services/stallService';
import ConfirmationModal from '../components/ConfirmationModal'; // <-- YENİ
import './StallPage.css';

function StallPage() {
  // State'ler
  const [marketplaces, setMarketplaces] = useState([]);
  const [selectedMarketplace, setSelectedMarketplace] = useState('');
  const [stalls, setStalls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state'leri
  const [formStallNumber, setFormStallNumber] = useState('');
  const [formProductTypes, setFormProductTypes] = useState('');

  // --- YENİ DÜZENLEME VE SİLME STATE'LERİ ---
  const [editingStallId, setEditingStallId] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [stallToDelete, setStallToDelete] = useState(null);

  useEffect(() => {
    marketplaceService.getMarketplaces()
      .then(response => {
        setMarketplaces(response.data);
      })
      .catch(err => console.error("Pazaryerleri yüklenemedi:", err));
  }, []);

  const fetchStalls = (marketId) => {
    // ... (Bu fonksiyon değişmedi)
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

  // --- YENİ FORMU SIFIRLAMA FONKSİYONU ---
  const resetForm = () => {
    setFormStallNumber('');
    setFormProductTypes('');
    setEditingStallId(null);
    setError(null);
  };

  const handleMarketplaceChange = (event) => {
    // ... (Bu fonksiyon değişmedi)
    const marketId = event.target.value;
    setSelectedMarketplace(marketId);
    fetchStalls(marketId);
    resetForm(); // Pazar değişince formu sıfırla
  };

  // --- SUBMIT FONKSİYONU GÜNCELLENDİ (Ekle/Güncelle) ---
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedMarketplace) {
      setError('Lütfen önce bir pazaryeri seçin.');
      return;
    }
    setError(null);

    const productTypesArray = formProductTypes.split(',')
                                  .map(type => type.trim())
                                  .filter(type => type);

    const stallData = {
      stallNumber: formStallNumber,
      marketplaceId: selectedMarketplace,
      productTypes: productTypesArray
    };

    const apiCall = editingStallId
      ? stallService.updateStall(editingStallId, stallData)
      : stallService.createStall(stallData);

    apiCall
      .then(() => {
        fetchStalls(selectedMarketplace);
        resetForm();
      })
      .catch(err => {
        setError(editingStallId 
          ? 'Tahta güncellenirken bir hata oluştu.'
          : 'Tahta eklenirken bir hata oluştu.');
        console.error(err);
      });
  };

  // --- YENİ DÜZENLEME FONKSİYONLARI ---
  const handleEditClick = (stall) => {
    setFormStallNumber(stall.stallNumber);
    // productTypes dizisini virgüllü string'e çevir
    setFormProductTypes(stall.productTypes?.join(', ') || '');
    setEditingStallId(stall.id);
    window.scrollTo(0, 0); // Formun olduğu yere git
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  // --- YENİ SİLME FONKSİYONLARI ---
  const handleDeleteClick = (stall) => {
    setStallToDelete(stall);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!stallToDelete) return;
    setError(null);
    stallService.deleteStall(stallToDelete.id)
      .then(() => {
        fetchStalls(selectedMarketplace); // Listeyi yenile
        closeConfirmModal();
      })
      .catch(err => {
        setError('Tahta silinirken bir hata oluştu.');
        console.error(err);
        closeConfirmModal();
      });
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setStallToDelete(null);
  };

  return (
    <div className="page-container">
      <h2>Tahta Yönetimi</h2>

      {error && <div className="error-message">{error}</div>}

      {/* Pazar Seçimi (Değişiklik yok) */}
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

      {selectedMarketplace && (
        <>
          {/* Form GÜNCELLENDİ (Başlık ve Butonlar) */}
          <div className="card">
            <h3>{editingStallId ? "Tahtayı Düzenle" : "Yeni Tahta Ekle"}</h3>
            <form onSubmit={handleSubmit} className="stall-form">
              <div className="form-group">
                <label>Tahta No:</label>
                <input type="text" value={formStallNumber} onChange={(e) => setFormStallNumber(e.target.value)} placeholder="Örn: 3B/114" required />
              </div>
              <div className="form-group">
                <label>Ürün Tipleri (Virgülle ayırın):</label>
                <input type="text" value={formProductTypes} onChange={(e) => setFormProductTypes(e.target.value)} placeholder="Örn: Gıda, Tekstil" required />
              </div>

              {/* YENİ: Buton alanı değişti */}
              <div className="form-actions">
                <button type="submit" className="submit-button">
                  {editingStallId ? "Güncelle" : "Ekle"}
                </button>
                {editingStallId && (
                  <button type="button" className="cancel-edit-button" onClick={handleCancelEdit}>
                    İptal
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Liste GÜNCELLENDİ (Düzenle/Sil butonları eklendi) */}
          <div className="card">
            <h3>Tahtalar</h3>
            {isLoading ? (
              <p>Yükleniyor...</p>
            ) : (
              <ul className="stall-list">
                {stalls.length > 0 ? stalls.map(stall => (
                  <li key={stall.id} className="stall-list-item">
                    <div>
                      <strong>{stall.stallNumber}</strong>
                      <small>Ürün Tipleri: {stall.productTypes?.join(', ') || 'Belirtilmemiş'}</small>
                    </div>
                    <div className="list-item-actions">
                      <button 
                        className="edit-button"
                        onClick={() => handleEditClick(stall)}
                      >
                        Düzenle
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteClick(stall)}
                      >
                        Sil
                      </button>
                    </div>
                  </li>
                )) : (
                  <p>Bu pazaryerine ait kayıtlı tahta bulunamadı.</p>
                )}
              </ul>
            )}
          </div>
        </>
      )}

      {/* --- YENİ MODAL EKLEMESİ --- */}
      <ConfirmationModal
        show={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={handleConfirmDelete}
        title="Tahtayı Sil"
        message={
          stallToDelete 
            ? `'${stallToDelete.stallNumber}' numaralı tahtayı silmek istediğinizden emin misiniz? Bu işlem, bu tahtaya ait tüm kiralama kayıtlarını silecektir.`
            : "Bu tahtayı silmek istediğinizden emin misiniz?"
        }
      />
    </div>
  );
}

export default StallPage;