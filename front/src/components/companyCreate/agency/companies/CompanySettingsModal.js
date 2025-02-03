import React, { useState, useEffect } from 'react'
import { NumberInput, PaxInput } from './SettingFormComponents'
import { saveProviderData } from '../../../../services/api'

const CompanySettingsModal = ({ company, onClose, onSave, initialSettings }) => {
  const [settings, setSettings] = useState({
    earnings: initialSettings?.earnings || '',
    promotionRate: initialSettings?.promotionRate || '',
    revenue: initialSettings?.revenue || '',
    currency: initialSettings?.currency || 'EUR',
    pax: {
      adult: initialSettings?.pax?.adult || '',
      child: initialSettings?.pax?.child || '',
      free: initialSettings?.pax?.free || ''
    }
  })

  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialSettings) {
      setSettings({
        earnings: initialSettings.earnings || '',
        promotionRate: initialSettings.promotionRate || '',
        revenue: initialSettings.revenue || '',
        currency: initialSettings.currency || 'EUR',
        pax: {
          adult: initialSettings.pax?.adult || '',
          child: initialSettings.pax?.child || '',
          free: initialSettings.pax?.free || ''
        }
      })
    }
  }, [initialSettings])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('pax.')) {
      const paxField = name.split('.')[1]
      setSettings(prev => ({
        ...prev,
        pax: {
          ...prev.pax,
          [paxField]: value
        }
      }))
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')

    try {
      await onSave(settings)
      onClose()
    } catch (err) {
      setError('Ayarlar kaydedilirken bir hata oluştu: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-gear-fill me-2"></i>
              {company.companyName} - Şirket Ayarları
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}
              <div className="row mb-3">
                <NumberInput
                    label="Şirket Ciro €"
                  name="revenue"
                  value={settings.revenue}
                  onChange={handleChange}
                  placeholder="0.00 £"
                  step="0.01"
                />
                <NumberInput
                  label="Şirket Hak Edişi Oranı"
                  name="promotionRate"
                  value={settings.promotionRate}
                  onChange={handleChange}
                  placeholder="0 %  "
                  min="0"
                  max="100"
                  suffix="%"
                />
              </div>
              
              <div className="row mb-3">
                  <NumberInput
                    label="Şirket Hak Edişi"
                    name="earnings"
                    value={settings.earnings}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                  />
                   <div className="col-md-6">
                  <label className="form-label">Para Birimi</label>
                  <select 
                    className="form-select w-100"
                    name="currency"
                    value={settings.currency}
                    onChange={handleChange}
                  >
                    <option value="EUR">€ (EUR)</option>
                    <option value="USD">$ (USD)</option>
                    <option value="TRY">₺ (TRY)</option>
                  </select>
                </div>
              </div>

             

              <div className="row">
                
                <PaxInput
                  label="Pax Yetişkin"
                  name="pax.adult"
                  value={settings.pax.adult}
                  onChange={handleChange}
                />
                <PaxInput
                  label="Pax Yetişkin "
                  name="pax.child"
                  value={settings.pax.child}
                  onChange={handleChange}
                />
                <PaxInput
                  label="Free"
                  name="pax.free"
                  value={settings.pax.free}
                  onChange={handleChange}
                />
              </div>
    
            </div>
   
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onClose}
                disabled={isSaving}
              >
                İptal
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <i className="bi bi-save me-2"></i>
                    Kaydet
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CompanySettingsModal 