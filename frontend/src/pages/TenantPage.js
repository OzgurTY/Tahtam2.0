import React, { useState, useEffect } from 'react';
import tenantService from '../services/tenantService';
import ConfirmationModal from '../components/ConfirmationModal'; // <-- YENİ İMPORT
import './TenantPage.css';

function TenantPage() {
  // ... (diğer state'ler aynı)
  const [tenants, setTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formProduct, setFormProduct] = useState('');
  const [editingTenantId, setEditingTenantId] = useState(null);

  // --- YENİ SİLME MODALI STATE'LERİ ---
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState(null); // Silinecek kiracıyı tutar

  // ... (fetchTenants, resetForm, handleSubmit, handleEditClick, handleCancelEdit fonksiyonları aynı) ...
  useEffect(() => {
    fetchTenants();
  }, []);

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

  const resetForm = () => {
    setFormName('');
    setFormPhone('');
    setFormProduct('');
    setEditingTenantId(null);
    setError(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    const tenantData = {
      name: formName,
      phoneNumber: formPhone,
      productSold: formProduct,
    };
    if (editingTenantId) {
      tenantService.updateTenant(editingTenantId, tenantData)
        .then(() => {
          fetchTenants();
          resetForm();
        })
        .catch(err => {
          setError('Kiracı güncellenirken bir hata oluştu.');
          console.error(err);
        });
    } else {
      tenantService.createTenant(tenantData)
        .then(() => {
          fetchTenants();
          resetForm();
        })
        .catch(err => {
          setError('Kiracı eklenirken bir hata oluştu.');
          console.error(err);
        });
    }
  };

  const handleEditClick = (tenant) => {
    setFormName(tenant.name);
    setFormPhone(tenant.phoneNumber);
    setFormProduct(tenant.productSold);
    setEditingTenantId(tenant.id);
    window.scrollTo(0, 0);
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  // --- SİLME FONKSİYONU GÜNCELLENDİ (window.confirm KALDIRILDI) ---
  const handleDeleteClick = (tenant) => {
    // Silinecek kiracıyı state'e ayarla ve modalı aç
    setTenantToDelete(tenant);
    setIsConfirmModalOpen(true);
  };

  // --- YENİ: MODAL ONAY FONKSİYONU ---
  const handleConfirmDelete = () => {
    if (!tenantToDelete) return; // Güvenlik kontrolü

    setError(null);
    tenantService.deleteTenant(tenantToDelete.id)
      .then(() => {
        fetchTenants(); // Listeyi yenile
        closeConfirmModal(); // Modalı kapat
      })
      .catch(err => {
        setError('Kiracı silinirken bir hata oluştu.');
        console.error(err);
        closeConfirmModal(); // Hata olsa bile modalı kapat
      });
  };

  // --- YENİ: MODAL KAPATMA FONKSİYONU ---
  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setTenantToDelete(null);
  };

  return (
    <div className="page-container">
      <h2>Kiracı Yönetimi</h2>

      {error && <div className="error-message">{error}</div>}

      {/* Form (Değişiklik yok) */}
      <div className="card">
        <h3>{editingTenantId ? "Kiracıyı Düzenle" : "Yeni Kiracı Ekle"}</h3>
        <form onSubmit={handleSubmit} className="tenant-form">
          <div className="form-group">
            <label>Ad Soyad:</label>
            <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Telefon Numarası:</label>
            <input type="text" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder="Örn: 0555 123 45 67" required />
          </div>
          <div className="form-group">
            <label>Sattığı Ürün:</label>
            <input type="text" value={formProduct} onChange={(e) => setFormProduct(e.target.value)} placeholder="Örn: Zeytin, Peynir" required />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-button">
              {editingTenantId ? "Güncelle" : "Ekle"}
            </button>
            {editingTenantId && (
              <button type="button" className="cancel-edit-button" onClick={handleCancelEdit}>
                İptal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Liste (onclick GÜNCELLENDİ) */}
      <div className="card">
        <h3>Kiracılar</h3>
        {isLoading ? (
          <p>Yükleniyor...</p>
        ) : (
          <ul className="tenant-list">
            {tenants.map(tenant => (
              <li key={tenant.id} className="tenant-list-item">
                <div>
                  <strong>{tenant.name}</strong>
                  <small>Telefon: {tenant.phoneNumber}</small>
                  <small>Ürün: {tenant.productSold}</small>
                </div>
                <div className="list-item-actions">
                  <button 
                    className="edit-button"
                    onClick={() => handleEditClick(tenant)}
                  >
                    Düzenle
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteClick(tenant)} // <-- DEĞİŞTİ
                  >
                    Sil
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* --- YENİ MODAL EKLEMESİ --- */}
      <ConfirmationModal
        show={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={handleConfirmDelete}
        title="Kiracıyı Sil"
        message={
          tenantToDelete 
            ? `'${tenantToDelete.name}' isimli kiracıyı kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem, kiracının tüm kiralama geçmişini de silecektir.`
            : "Bu kiracıyı silmek istediğinizden emin misiniz?"
        }
      />
    </div>
  );
}

export default TenantPage;