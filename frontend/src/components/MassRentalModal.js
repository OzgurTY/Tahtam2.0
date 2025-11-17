import React, { useState, useEffect } from 'react';
import tenantService from '../services/tenantService';
import stallService from '../services/stallService';
import rentalService from '../services/rentalService';
import './BookingModal.css';

const DAYS_OF_WEEK = [
  { val: "MONDAY", label: "Pazartesi" }, { val: "TUESDAY", label: "Salı" },
  { val: "WEDNESDAY", label: "Çarşamba" }, { val: "THURSDAY", label: "Perşembe" },
  { val: "FRIDAY", label: "Cuma" }, { val: "SATURDAY", label: "Cumartesi" },
  { val: "SUNDAY", label: "Pazar" }
];

function MassRentalModal({ show, onClose, marketId, onSuccess }) {
  const [tenants, setTenants] = useState([]);
  const [stalls, setStalls] = useState([]);
  
  const [selectedTenant, setSelectedTenant] = useState('');
  const [selectedStallIds, setSelectedStallIds] = useState(new Set()); // Çoklu seçim
  const [selectedDays, setSelectedDays] = useState(new Set()); // Çoklu seçim
  const [monthDate, setMonthDate] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM formatı
  const [totalPrice, setTotalPrice] = useState('');
  
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show && marketId) {
      Promise.all([
        tenantService.getTenants(),
        stallService.getStallsByMarketplace(marketId)
      ]).then(([resTenants, resStalls]) => {
        setTenants(resTenants.data);
        setStalls(resStalls.data);
      }).catch(err => console.error(err));
    }
  }, [show, marketId]);

  const toggleSelection = (setFunc, currentSet, value) => {
    const newSet = new Set(currentSet);
    if (newSet.has(value)) newSet.delete(value);
    else newSet.add(value);
    setFunc(newSet);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (selectedStallIds.size === 0 || selectedDays.size === 0) {
      setError("Lütfen en az bir tahta ve bir gün seçin.");
      setIsLoading(false);
      return;
    }

    const [year, month] = monthDate.split('-');

    const batchData = {
      stallIds: Array.from(selectedStallIds),
      daysOfWeek: Array.from(selectedDays),   
      tenantId: selectedTenant,
      marketplaceId: marketId,
      price: parseFloat(totalPrice),
      year: parseInt(year),
      month: parseInt(month)
    };

    rentalService.createBatchRental(batchData)
      .then(() => {
        setIsLoading(false);
        onSuccess();
        handleClose();
      })
      .catch(err => {
        setIsLoading(false);
        if(err.response && err.response.data) setError(err.response.data);
        else setError("İşlem başarısız.");
      });
  };

  const handleClose = () => {
    setSelectedStallIds(new Set());
    setSelectedDays(new Set());
    setTotalPrice('');
    setError(null);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content card" style={{maxWidth: '600px'}}>
        <h2>Toplu Kiralama Sihirbazı</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* 1. AY SEÇİMİ */}
          <div className="form-group">
            <label>Hangi Ay İçin?</label>
            <input 
              type="month" 
              value={monthDate}
              onChange={(e) => setMonthDate(e.target.value)}
              required
              style={{width: '100%', padding: '8px'}}
            />
          </div>

          {/* 2. GÜN SEÇİMİ (Çoklu) */}
          <div className="form-group">
            <label>Günleri Seçin (Örn: Salı ve Cumartesi):</label>
            <div className="checkbox-group" style={{display:'flex', flexWrap:'wrap', gap:'10px'}}>
              {DAYS_OF_WEEK.map(d => (
                <label key={d.val} style={{fontSize:'13px', display:'flex', alignItems:'center', gap:'5px'}}>
                  <input 
                    type="checkbox"
                    checked={selectedDays.has(d.val)}
                    onChange={() => toggleSelection(setSelectedDays, selectedDays, d.val)}
                  /> {d.label}
                </label>
              ))}
            </div>
          </div>

          {/* 3. TAHTA SEÇİMİ (Çoklu) */}
          <div className="form-group">
            <label>Kiralanacak Tahtaları Seçin:</label>
            <div className="checkbox-group" style={{maxHeight:'150px', overflowY:'auto', border:'1px solid #ccc', padding:'10px'}}>
              {stalls.map(stall => (
                <label key={stall.id} style={{display:'block', marginBottom:'5px'}}>
                  <input 
                    type="checkbox" 
                    checked={selectedStallIds.has(stall.id)}
                    onChange={() => toggleSelection(setSelectedStallIds, selectedStallIds, stall.id)}
                  /> 
                  <span style={{marginLeft:'8px', fontWeight:'bold'}}>{stall.stallNumber}</span>
                  <span style={{fontSize:'12px', color:'#666'}}> ({stall.productTypes?.join(', ')})</span>
                </label>
              ))}
            </div>
          </div>

          {/* 4. KİRACI ve FİYAT */}
          <div style={{display:'flex', gap:'15px'}}>
             <div className="form-group" style={{flex:1}}>
                <label>Kiracı:</label>
                <select value={selectedTenant} onChange={(e) => setSelectedTenant(e.target.value)} required className="marketplace-select">
                    <option value="">-- Seçin --</option>
                    {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
             </div>
             <div className="form-group" style={{flex:1}}>
                <label>TOPLAM Paket Fiyatı:</label>
                <input type="number" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} required placeholder="Örn: 5000" />
             </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={handleClose}>İptal</button>
            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? "İşleniyor..." : "Toplu Kirala"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MassRentalModal;