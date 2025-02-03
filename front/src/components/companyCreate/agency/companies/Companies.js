import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { saveProviders, getProviders, saveProviderData, getProviderData } from '../../../../services/api'
import CompanyForm from './CompanyForm'
import CompanyTable from './CompanyTable'
import { generateAlphanumericId, formatPhoneNumber, capitalizeCompanyName } from './companyUtils'

export default function Companies() {
  const [formData, setFormData] = useState({ companyName: '', phoneNumber: '' })
  const [companies, setCompanies] = useState(() => {
    const savedCompanies = localStorage.getItem('companies')
    return savedCompanies ? JSON.parse(savedCompanies) : []
  })
  const [editingId, setEditingId] = useState(null)
  const [providerSettings, setProviderSettings] = useState({});

  const loadProviderData = async (providerId) => {
    try {
      const response = await getProviderData(providerId);
      if (response.data) {
        setCompanies(prev => prev.map(company => 
          company.alphanumericId === providerId 
            ? { 
                ...company, 
                ...response.data,
                pax: response.data.pax || { adult: '', child: '', free: '' }
              }
            : company
        ));
      }
    } catch (error) {
      console.error('Provider data yüklenirken hata:', error);
    }
  };

  const loadProviders = async () => {
    try {
      const agencyUser = JSON.parse(localStorage.getItem('agencyUser'));
      if (!agencyUser?.companyId) return;

      const response = await getProviders(agencyUser.companyId);
      if (response.data && Array.isArray(response.data)) {
        const formattedProviders = response.data.map(provider => ({
          id: Date.now() + Math.random(),
          alphanumericId: provider.companyRef,
          companyName: provider.company_name,
          phoneNumber: provider.phone_number,
          status: provider.status === 1
        }));
        
        setCompanies(formattedProviders);
        localStorage.setItem('companies', JSON.stringify(formattedProviders));
        
        // Her provider için ayarları yükle
        for (const provider of formattedProviders) {
          await loadProviderData(provider.alphanumericId);
        }
      }
    } catch (error) {
      console.error('Providers yüklenirken hata:', error);
    }
  };

  useEffect(() => {
    loadProviders()
  }, [])

  useEffect(() => {
    localStorage.setItem('companies', JSON.stringify(companies))
  }, [companies])

  // Provider ayarlarını yükle
  const loadProviderSettings = async (providerId) => {
    try {
      const response = await getProviderData(providerId);
      if (response.data) {
        setProviderSettings(prev => ({
          ...prev,
          [providerId]: response.data
        }));
      }
    } catch (error) {
      console.error('Provider settings yüklenirken hata:', error);
    }
  };

  // Tüm provider'ların ayarlarını yükle
  useEffect(() => {
    companies.forEach(company => {
      loadProviderSettings(company.alphanumericId);
    });
  }, [companies]);

  const handleInputChange = (e, id = null) => {
    const { name, value, id: inputId } = e.target
    const field = name || inputId
    const isPhone = field === 'phoneNumber'
    const isCompanyName = field === 'companyName'
    
    let formattedValue = value
    if (isPhone) {
      formattedValue = formatPhoneNumber(value)
    } else if (isCompanyName) {
      formattedValue = capitalizeCompanyName(value)
    }

    if (id) {
      setCompanies(prev => prev.map(company =>
        company.id === id ? { ...company, [field]: formattedValue } : company
      ))
    } else {
      setFormData(prev => ({ ...prev, [field]: formattedValue }))
    }
  }

  const handleSubmit = () => {
    if (!formData.companyName || !formData.phoneNumber) {
      alert('Lütfen tüm alanları doldurunuz!')
      return
    }

    const newCompany = {
      id: Date.now(),
      alphanumericId: generateAlphanumericId(),
      companyName: formData.companyName,
      phoneNumber: '+90 ' + formData.phoneNumber,
      status: false
    }
    setCompanies(prev => [...prev, newCompany])
    setFormData({ companyName: '', phoneNumber: '' })
  }

  const handleSave = (id) => {
    const company = companies.find(c => c.id === id)
    if (!company.companyName || !company.phoneNumber) {
      alert('Lütfen tüm alanları doldurunuz!')
      return
    }
    
    setCompanies(prev => prev.map(comp =>
      comp.id === id ? { ...comp, phoneNumber: '+90 ' + comp.phoneNumber.replace('+90 ', '') } : comp
    ))
    setEditingId(null)
  }

  const handleDelete = (id) => {
    if (window.confirm('Bu şirketi silmek istediğinizden emin misiniz?')) {
      setCompanies(prev => prev.filter(company => company.id !== id))
    }
  }

  const handleSendToDatabase = async () => {
    const agencyUser = JSON.parse(localStorage.getItem('agencyUser'))
    if (!agencyUser?.companyId) {
      alert('Şirket bilgisi bulunamadı! Lütfen tekrar giriş yapın.')
      return
    }

    try {
      // Şirketleri kaydet
      const providersData = companies.map(company => ({
        alphanumericId: company.alphanumericId,
        companyName: company.companyName,
        phoneNumber: company.phoneNumber.replace('+90', '').trim(),
        companyId: agencyUser.companyId,
        status: company.status ? 1 : 0
      }))

      // Önce providers'ı kaydet
      const response = await saveProviders(companies.length ? providersData : [])
      
      // Sonra her bir provider'ın ayarlarını kaydet
      if (response.data.success && companies.length) {
        for (const company of companies) {
          const settings = providerSettings[company.alphanumericId];
          if (settings) {
            await saveProviderData(company.alphanumericId, settings);
          }
        }
        alert('Şirketler ve ayarlar veri tabanında başarıyla güncellendi!');
      } else if (response.data.success) {
        alert('Tüm şirketler veri tabanından başarıyla silindi!');
      } else {
        alert('Hata: ' + (response.data.error || 'Bilinmeyen bir hata oluştu'));
      }
    } catch (error) {
      console.error('API Error:', error)
      alert('Bir hata oluştu. Lütfen tekrar deneyiniz.');
    }
  };

  // Provider ayarlarını güncelle
  const handleSettingsSave = async (companyId, settings) => {
    const company = companies.find(c => c.id === companyId);
    if (!company) return;

    // Local state'i güncelle
    setProviderSettings(prev => {
      const newSettings = {
        ...prev,
        [company.alphanumericId]: settings
      };
      
      // LocalStorage'a kaydet
      localStorage.setItem('providerSettings', JSON.stringify(newSettings));
      
      return newSettings;
    });
  };

  // Component ilk yüklendiğinde localStorage'dan provider ayarlarını yükle
  useEffect(() => {
    const savedSettings = localStorage.getItem('providerSettings');
    if (savedSettings) {
      setProviderSettings(JSON.parse(savedSettings));
    }
  }, []);

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="fw-bold text-primary">Şirket Ekle</h2>
          <hr className="my-4" />
        </div>
      </div>

      <CompanyForm 
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />

      {companies.length > 0 && (
        <CompanyTable 
          companies={companies}
          editingId={editingId}
          onEdit={setEditingId}
          onSave={handleSave}
          onDelete={handleDelete}
          onInputChange={handleInputChange}
          onSettingsSave={handleSettingsSave}
          providerSettings={providerSettings}
        />
      )}

      <div className="row mt-4">
        <div className="col-12">
          <div className="d-flex justify-content-end gap-3 mb-5">
            <button 
              className="btn btn-lg btn-success"
              onClick={handleSendToDatabase}
              style={{
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                minWidth: '250px'
              }}
            >
              <i className="bi bi-database-fill-up me-2"></i>
              Veri Tabanına Guncelle
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
