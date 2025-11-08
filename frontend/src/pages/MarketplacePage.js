import React, { useState, useEffect } from 'react';
import marketplaceService from '../services/marketplaceService';
import ConfirmationModal from '../components/ConfirmationModal';
import './MarketplacePage.css';

const DAYS_OF_WEEK = [
  "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"
];

function MarketplacePage() {
  const [marketplaces, setMarketplaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state'leri
  const [formName, setFormName] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [selectedDays, setSelectedDays] = useState(new Set());

  const [editingMarketplaceId, setEditingMarketplaceId] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [marketplaceToDelete, setMarketplaceToDelete] = useState(null);

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

  const resetForm = () => {
    setFormName('');
    setFormAddress('');
    setSelectedDays(new Set());
    setEditingMarketplaceId(null);
    setError(null);
  };

  const handleDayChange = (event) => {
    const { value, checked } = event.target;
    const newSelectedDays = new Set(selectedDays);
    if (checked) {
      newSelectedDays.add(value);
    } else {
      newSelectedDays.delete(value);
    }
    setSelectedDays(newSelectedDays);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);

    const openDaysArray = Array.from(selectedDays);
    if (openDaysArray.length === 0) {
      setError("Lütfen en az bir açık gün seçin.");
      return;
    }

    const marketplaceData = {
      name: formName,
      address: formAddress,
      openDays: openDaysArray
    };

    const apiCall = editingMarketplaceId
      ? marketplaceService.updateMarketplace(editingMarketplaceId, marketplaceData)
      : marketplaceService.createMarketplace(marketplaceData);

    apiCall
      .then(() => {
        fetchMarketplaces();
        resetForm();
      })
      .catch(err => {
        setError(editingMarketplaceId 
          ? 'Pazaryeri güncellenirken bir hata oluştu.'
          : 'Pazaryeri eklenirken bir hata oluştu.');
        console.error(err);
      });
  };

  const handleEditClick = (market) => {
    setFormName(market.name);
    setFormAddress(market.address);
    setSelectedDays(new Set(market.openDays || [])); 
    setEditingMarketplaceId(market.id);
    window.scrollTo(0, 0);
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleDeleteClick = (market) => {
    setMarketplaceToDelete(market);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!marketplaceToDelete) return;
    setError(null);
    marketplaceService.deleteMarketplace(marketplaceToDelete.id)
      .then(() => {
        fetchMarketplaces();
        closeConfirmModal();
      })
      .catch(err => {
        setError('Pazaryeri silinirken bir hata oluştu. (Not: Önce bağlı tahtaları silmeniz gerekebilir)');
        console.error(err);
        closeConfirmModal();
      });
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setMarketplaceToDelete(null);
  };

  const translateDay = (day) => {
      const map = {
          "MONDAY": "Pzt", "TUESDAY": "Salı", "WEDNESDAY": "Çrş",
          "THURSDAY": "Prş", "FRIDAY": "Cuma", "SATURDAY": "Cmt", "SUNDAY": "Paz"
      };
      return map[day] || day;
  };

  return (
    <div className="page-container">
      <h2>Pazaryerleri Yönetimi</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="card">
        <h3>{editingMarketplaceId ? "Pazaryerini Düzenle" : "Yeni Pazaryeri Ekle"}</h3>
        <form onSubmit={handleSubmit} className="marketplace-form">
          <div className="form-group">
            <label>Pazar Adı:</label>
            <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Adres:</label>
            <input type="text" value={formAddress} onChange={(e) => setFormAddress(e.target.value)} required />
          </div>
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
                  {translateDay(day)}
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              {editingMarketplaceId ? "Güncelle" : "Ekle"}
            </button>
            {editingMarketplaceId && (
              <button type="button" className="cancel-edit-button" onClick={handleCancelEdit}>
                İptal
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Mevcut Pazaryerleri</h3>
        {isLoading ? (
          <p>Yükleniyor...</p>
        ) : (
          <ul className="marketplace-list">
            {marketplaces.map(market => (
              <li key={market.id} className="marketplace-list-item">
                <div>
                  <strong>{market.name}</strong> ({market.address})
                  <small>
                    Açık Günler: {market.openDays?.map(translateDay).join(', ') || 'Belirtilmemiş'}
                  </small>
                </div>
                <div className="list-item-actions">
                  <button 
                    className="edit-button"
                    onClick={() => handleEditClick(market)}
                  >
                    Düzenle
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteClick(market)}
                  >
                    Sil
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* --- ONAYLAMA MODALI --- */}
      <ConfirmationModal
        show={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={handleConfirmDelete}
        title="Pazaryerini Sil"
        message={
          marketplaceToDelete 
            ? `'${marketplaceToDelete.name}' isimli pazaryerini silmek istediğinizden emin misiniz? Bu işlem, bu pazara ait tüm tahtaları ve kiralama kayıtlarını silecektir.`
            : "Bu pazaryerini silmek istediğinizden emin misiniz?"
        }
      />
    </div>
  );
}

export default MarketplacePage;