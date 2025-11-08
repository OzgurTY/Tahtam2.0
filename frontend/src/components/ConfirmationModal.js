import React from 'react';
import './ConfirmationModal.css'; // Bu dosyayı bir sonraki adımda oluşturacağız

/**
 * Genel amaçlı onay (Silme vb.) modalı.
 * @param {object} props
 * @param {boolean} props.show Modalın görünür olup olmadığı
 * @param {function} props.onClose Modalı kapatma (İptal) fonksiyonu
 * @param {function} props.onConfirm Onaylama (Sil) fonksiyonu
 * @param {string} props.title Modal başlığı (Örn: "Kiracıyı Sil")
 * @param {string} props.message Modal içindeki uyarı mesajı
 */
function ConfirmationModal({ show, onClose, onConfirm, title, message }) {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content card">
        <h2>{title}</h2>
        <p>{message}</p>

        {/* Buton alanı */}
        <div className="modal-actions">
          <button type="button" className="cancel-button" onClick={onClose}>
            İptal
          </button>
          <button type="button" className="confirm-delete-button" onClick={onConfirm}>
            Evet, Onayla
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;