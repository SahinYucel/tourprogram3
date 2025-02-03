import React, { useState, useEffect } from 'react';
import { getTourData, saveGuides, getGuides } from '../../../../services/api';
import GuideForm from './components/GuideForm';
import GuideTable from './components/GuideTable';

export default function Guides() {
  const defaultLanguages = {
    almanca: false,
    rusca: false,
    ingilizce: false,
    fransizca: false,
    arapca: false,
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const emptyFormData = {
    name: '',
    surname: '',
    isActive: true,
    region: [],
    guideGroup: '',
    nickname: 'Guide',
    languages: defaultLanguages,
    otherLanguages: '',
    phone: '',
    code: generateCode(),
  };

  const [guides, setGuides] = useState([]);
  const [formData, setFormData] = useState(emptyFormData);
  const [editingId, setEditingId] = useState(null);
  const [bolgeler, setBolgeler] = useState([]);
  const [companyId, setCompanyId] = useState(null);

  useEffect(() => {
    const fetchBolgeler = async () => {
      try {
        const agencyUser = JSON.parse(localStorage.getItem('agencyUser'));
        if (!agencyUser?.companyId) {
          console.warn('Şirket ID bulunamadı');
          return;
        }

        const data = await getTourData(agencyUser.companyId);
        if (data?.bolgeler) {
          setBolgeler(data.bolgeler);
        }
      } catch (error) {
        console.error('Bölgeler yüklenirken hata:', error);
      }
    };

    fetchBolgeler();
  }, []);

  useEffect(() => {
    const agencyUser = JSON.parse(localStorage.getItem('agencyUser'));
    if (agencyUser?.companyId) {
      setCompanyId(agencyUser.companyId);
    }
  }, []);

  useEffect(() => {
    const loadGuides = async () => {
      if (!companyId) return;
      
      try {
        const loadedGuides = await getGuides(companyId);
        console.log('Yüklenen rehberler:', loadedGuides);
        if (Array.isArray(loadedGuides)) {
          setGuides(loadedGuides);
        } else {
          console.error('Geçersiz rehber verisi:', loadedGuides);
        }
      } catch (error) {
        console.error('Rehberler yüklenirken hata:', error);
        alert('Rehberler yüklenirken bir hata oluştu');
      }
    };

    loadGuides();
  }, [companyId]);

  useEffect(() => {
    if (!companyId) return;

    try {
      localStorage.setItem(`guides_${companyId}`, JSON.stringify(guides));
    } catch (error) {
      console.error('Rehberler kaydedilirken hata:', error);
    }
  }, [guides, companyId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'region') {
      const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
      setFormData(prev => ({
        ...prev,
        [name]: selectedOptions
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleLanguageChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      languages: {
        ...prev.languages,
        [name]: checked,
      },
    }));
  };

  const handleSwitchChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      isActive: e.target.checked,
    }));
  };

  const formatLanguages = (languages, otherLanguages) => {
    const selectedLanguages = Object.entries(languages)
      .filter(([_, isSelected]) => isSelected)
      .map(([lang]) => {
        const capitalizedLang = lang.charAt(0).toUpperCase() + lang.slice(1);
        return capitalizedLang;
      });
    
    if (otherLanguages) {
      selectedLanguages.push(otherLanguages);
    }
    
    return selectedLanguages.join(', ');
  };

  const handleEdit = (guide) => {
    setEditingId(guide.id);
    setFormData({
      ...guide,
      languages: guide.languages || defaultLanguages,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      ...emptyFormData,
      code: generateCode(),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedGuide = {
      ...formData,
      id: editingId || Date.now(),
      languagesDisplay: formatLanguages(formData.languages, formData.otherLanguages),
      code: formData.code || generateCode(),
    };

    if (editingId) {
      setGuides(prev => prev.map(guide => guide.id === editingId ? formattedGuide : guide));
      setEditingId(null);
    } else {
      setGuides(prev => [...prev, formattedGuide]);
    }
    
    setFormData({
      ...emptyFormData,
      code: generateCode(),
    });
  };

  const handleSettingsSave = (guideId, settings) => {
    console.log('Guides - ayarlar kaydediliyor:', { guideId, settings });
    setGuides(prev => prev.map(guide => 
      guide.id === guideId 
        ? { 
            ...guide, 
            earnings: parseFloat(settings.earnings) || 0,
            promotionRate: parseFloat(settings.promotionRate) || 0,
            revenue: parseFloat(settings.revenue) || 0,
            pax: {
              adult: parseInt(settings.pax?.adult) || 0,
              child: parseInt(settings.pax?.child) || 0,
              free: parseInt(settings.pax?.free) || 0
            }
          }
        : guide
    ));
  };

  const handleSaveToDatabase = async () => {
    try {
      console.log('Veritabanına kaydedilecek rehberler:', guides);
      
      // Rehberleri ve ayarlarını birlikte gönder
      const guidesWithSettings = guides.map(guide => ({
        ...guide,
        earnings: parseFloat(guide.earnings) || 0,
        promotionRate: parseFloat(guide.promotionRate) || 0,
        revenue: parseFloat(guide.revenue) || 0,
        pax: {
          adult: parseInt(guide.pax?.adult) || 0,
          child: parseInt(guide.pax?.child) || 0,
          free: parseInt(guide.pax?.free) || 0
        }
      }));

      await saveGuides(companyId, guidesWithSettings);
      alert('Rehberler başarıyla kaydedildi');
    } catch (error) {
      console.error('Veri tabanına kaydedilirken hata:', error);
      alert('Veri tabanına kaydedilirken bir hata oluştu: ' + error.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-12">
          <h5 className="mb-4">Rehber Yönetimi</h5>
          
          <GuideForm 
            formData={formData}
            editingId={editingId}
            bolgeler={bolgeler}
            onSubmit={handleSubmit}
            onChange={handleInputChange}
            onLanguageChange={handleLanguageChange}
            onSwitchChange={handleSwitchChange}
            onCancel={handleCancel}
          />

          <GuideTable 
            guides={guides}
            onEdit={handleEdit}
            onDelete={(id) => setGuides(prev => prev.filter(g => g.id !== id))}
            onSettingsSave={handleSettingsSave}
          />

          <div className="text-center mt-4 mb-5">
            <button 
              className="btn btn-primary"
              onClick={handleSaveToDatabase}
            >
              Veri Tabanına Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
