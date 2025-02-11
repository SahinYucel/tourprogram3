import React, { useState, useMemo, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import TourForm from './components/TourForm';
import TourHeader from './components/TourHeader';
import TourTable from './components/TourTable';
import { DAYS } from './components/form_inputs/DaySelector';
import { INITIAL_TOUR_STATE } from './hooks/constants';
import { useTourData } from './hooks/useTourData';
import { saveAllTours, getAllTours, deleteTour } from '../../../../services/api';

const Tours = () => {
  const [tourData, setTourData] = useState(() => {
    const savedData = localStorage.getItem('currentTourData');
    return savedData ? JSON.parse(savedData) : INITIAL_TOUR_STATE;
  });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [createdTours, setCreatedTours] = useState(() => {
    const saved = localStorage.getItem('createdTours');
    return saved ? JSON.parse(saved) : [];
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showActive, setShowActive] = useState('all');

  const {
    savedTours,
    savedRegions,
    savedAreas,
    savedCompanies,
    bolgeler
  } = useTourData();

  useEffect(() => {
    localStorage.setItem('createdTours', JSON.stringify(createdTours));
  }, [createdTours]);

  useEffect(() => {
    localStorage.setItem('currentTourData', JSON.stringify(tourData));
  }, [tourData]);

  useEffect(() => {
    const loadExistingTours = async () => {
      try {
        const agencyUser = JSON.parse(localStorage.getItem('agencyUser'));
        if (!agencyUser?.companyId) {
          return;
        }

        const response = await getAllTours(agencyUser.companyId);
        if (response.success && Array.isArray(response.data)) {
          const formattedTours = response.data.map(tour => ({
            id: tour.mainTour.id,
            tourName: tour.mainTour.tour_name,
            operator: tour.mainTour.operator,
            operatorId: tour.mainTour.operator_id,
            adultPrice: tour.mainTour.adult_price,
            childPrice: tour.mainTour.child_price,
            guideAdultPrice: tour.mainTour.guide_adult_price,
            guideChildPrice: tour.mainTour.guide_child_price,
            isActive: tour.mainTour.is_active,
            priority: tour.mainTour.priority || '0',
            bolgeler: tour.mainTour.bolgeler || [],
            description: tour.mainTour.description || '',
            currency: tour.mainTour.currency || 'EUR',
            relatedData: {
              days: tour.days || [],
              pickupTimes: tour.pickupTimes || [],
              options: tour.options || []
            }
          }));

          setCreatedTours(formattedTours);
        }
      } catch (error) {
        // console.error('Turlar yüklenirken hata:', error);
      }
    };

    loadExistingTours();
  }, []);

  useEffect(() => {
  }, [
    tourData,
    createdTours,
    editingIndex,
    searchQuery,
    showActive,
    isCollapsed,
    savedTours,
    savedRegions,
    savedAreas,
    savedCompanies,
    bolgeler
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTourData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionChange = (index, field, value) => {
    setTourData(prev => {
      const newOptions = [...prev.options];
      newOptions[index] = { ...newOptions[index], [field]: value };
      return { ...prev, options: newOptions };
    });
  };

  const handleDaySelect = (day) => {
    setTourData(prev => {
      const selectedDays = prev.selectedDays.includes(day)
        ? prev.selectedDays.filter(d => d !== day)
        : [...prev.selectedDays, day];
      return { ...prev, selectedDays };
    });
  };

  const handleSelectAllDays = () => {
    setTourData(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.length === DAYS.length ? [] : DAYS.map(day => day.id)
    }));
  };

  const resetForm = () => {
    setTourData({
      ...INITIAL_TOUR_STATE,
      pickupTimes: [{  // Yeni form için boş bir kayıt
        hour: '',
        minute: '',
        region: '',
        area: '',
        period: '1',
        isActive: true
      }]
    });
    setEditingIndex(null);
    setIsCollapsed(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tourData.tourName || !tourData.operator) {
      alert('Lütfen gerekli alanları doldurunuz!');
      return;
    }

    const selectedCompany = savedCompanies.find(c => c.alphanumericId === tourData.operator);
    
    const mainTourData = {
      tourName: tourData.tourName,
      operator: selectedCompany ? selectedCompany.companyName : tourData.operator,
      operatorId: selectedCompany ? selectedCompany.alphanumericId : tourData.operator,
      adultPrice: tourData.adultPrice || 0,
      childPrice: tourData.childPrice || 0,
      guideAdultPrice: tourData.guideAdultPrice || 0,
      guideChildPrice: tourData.guideChildPrice || 0,
      currency: tourData.currency || 'EUR',
      isActive: true,
      priority: tourData.priority || '0',
      tourGroup: tourData.tourGroup,
      bolgeId: tourData.bolgeId || [],
      bolgeler: tourData.bolgeId ? tourData.bolgeId.map(id => 
        bolgeler.find(bolge => bolge.id === id)?.name || ''
      ) : [],
      description: tourData.description || ''
    };

    // Boş olmayan pickup zamanlarını filtrele
    const filteredPickupTimes = tourData.pickupTimes
      .filter(time => time.hour || time.minute || time.region || time.area)
      .map(time => ({
        ...time,
        hour: time.hour || '00',
        minute: time.minute || '00',
        region: time.region || '',
        area: time.area || '',
        period: time.period || '1',
        isActive: time.isActive === undefined ? true : time.isActive
      }));

    const days = Array.isArray(tourData.selectedDays) && tourData.selectedDays.length > 0 
      ? tourData.selectedDays 
      : [0];

    const relatedData = {
      days,
      pickupTimes: filteredPickupTimes,
      options: Array.isArray(tourData.options) ? 
        tourData.options.filter(opt => opt.name || opt.price) : []
    };

    if (editingIndex !== null) {
      setCreatedTours(prev => {
        const newTours = [...prev];
        newTours[editingIndex] = {
          ...mainTourData,
          relatedData
        };
        return newTours;
      });
    } else {
      setCreatedTours(prev => [...prev, {
        ...mainTourData,
        relatedData
      }]);
    }

    resetForm();
  };

  const handleEdit = (tour) => {
    const index = createdTours.findIndex(t => t === tour);
    if (index !== -1) {
      const operatorId = tour.operatorId || 
        (savedCompanies.find(c => c.companyName === tour.operator)?.alphanumericId || tour.operator);
      
      const selectedBolgeIds = bolgeler
        .filter(bolge => tour.bolgeler?.includes(bolge.name))
        .map(bolge => bolge.id);

      const editableTourData = {
        tourName: tour.tourName,
        operator: operatorId,
        adultPrice: tour.adultPrice || '',
        childPrice: tour.childPrice || '',
        guideAdultPrice: tour.guideAdultPrice || '',
        guideChildPrice: tour.guideChildPrice || '',
        selectedDays: tour.relatedData?.days || [],
        tourGroup: tour.tourGroup,
        bolgeId: selectedBolgeIds,
        pickupTimes: [
          ...(tour.relatedData?.pickupTimes?.map(time => ({
            hour: time.hour || '',
            minute: time.minute || '',
            region: time.region || '',
            area: time.area || '',
            isActive: time.isActive !== false,
            period: time.period || '1'
          })) || []),
          {
            hour: '',
            minute: '',
            region: '',
            area: '',
            isActive: true,
            period: '1'
          }
        ],
        options: tour.relatedData?.options?.map(opt => ({
          name: opt.option_name || opt.name || '',
          price: opt.price || ''
        })) || [],
        priority: tour.priority || '0',
        isActive: tour.isActive,
        description: tour.description || '',
        currency: tour.currency || 'EUR'
      };
      
      setTourData(editableTourData);
      setEditingIndex(index);
      setIsCollapsed(false);
    }
  };

  const handleCopy = (tourToCopy) => {
    const copiedTour = {
      ...tourToCopy,
      id: null,  // Yeni kopya için ID'yi null yapıyoruz
      tourName: `${tourToCopy.tourName} (Kopya)`, // Kopya olduğunu belirtmek için
      relatedData: {
        ...tourToCopy.relatedData,
        pickupTimes: tourToCopy.relatedData.pickupTimes.map(time => ({
          ...time,
          id: null // Pickup time ID'lerini de null yapıyoruz
        })),
        options: tourToCopy.relatedData.options.map(option => ({
          ...option,
          id: null // Option ID'lerini de null yapıyoruz
        }))
      }
    };
    setCreatedTours(prev => [...prev, copiedTour]);
  };

  const handleDelete = (tourToDelete) => {
    // Sadece state'den sil, veritabanı işlemi yapma
    setCreatedTours(prev => prev.filter(tour => 
      // ID'si varsa ID'ye göre, yoksa içerik karşılaştırması yap
      tour.id ? tour.id !== tourToDelete.id : 
      !(tour.tourName === tourToDelete.tourName && 
        tour.operator === tourToDelete.operator)
    ));
    
    if (editingIndex !== null) {
      resetForm();
    }
  };

  const handleTimeChange = (index, field, value) => {
    setTourData(prev => {
      const newTimes = [...(prev.pickupTimes || [])];
      if (!newTimes[index]) {
        newTimes[index] = {
          hour: '',
          minute: '',
          region: '',
          area: '',
          isActive: true,
          period: '1'
        };
      }
      
      // Bölge değiştiğinde, o bölgeye ait alanı sıfırla
      const updates = { [field]: value };
      if (field === 'region') {
        updates.area = '';
        updates.period = '1';
      }
      
      newTimes[index] = { 
        ...newTimes[index], 
        ...updates
      };
      
      return { ...prev, pickupTimes: newTimes };
    });
  };

  const addPickupTime = () => {
    setTourData(prev => ({
      ...prev,
      pickupTimes: [
        ...prev.pickupTimes,
        {
          hour: '',
          minute: '',
          region: '',
          area: '',
          period: '1',
          isActive: true
        }
      ]
    }));
  };

  const removePickupTime = (index) => {
    setTourData(prev => ({
      ...prev,
      pickupTimes: prev.pickupTimes.filter((_, i) => i !== index)
    }));
  };

  const formInputs = useMemo(() => [
    {
      label: 'Tur Adı',
      icon: 'bi-map',
      id: 'tourName',
      type: 'autocomplete',
      placeholder: 'Tur adı yazın veya seçin',
      options: savedTours.flatMap(tour => [
        {
          value: tour.name,
          label: `📁 ${tour.name}`,
          searchTerms: tour.name.toLowerCase(),
          isMainTour: true
        },
        ...(tour.subTours?.map(subTour => ({
          value: subTour.name,
          label: `  ↳ ${subTour.name}`,
          searchTerms: `${tour.name} ${subTour.name}`.toLowerCase(),
          mainTourName: tour.name
        })) || [])
      ])
    },
    {
      label: 'Operatör Seç',
      icon: 'bi-person-badge',
      id: 'operator',
      type: 'select',
      placeholder: 'Operatör seçiniz',
      options: savedCompanies.map(company => ({ 
        value: company.alphanumericId, 
        label: `${company.companyName} (${company.alphanumericId})` 
      }))
    },
    {
      label: 'Tur Önceliği',
      icon: 'bi-sort-numeric-down',
      id: 'priority',
      type: 'select',
      placeholder: 'Öncelik seçiniz',
      options: [
        { value: '1', label: '1 - En Yüksek' },
        { value: '2', label: '2 - Yüksek' },
        { value: '3', label: '3 - Normal' },
        { value: '4', label: '4 - Düşük' },
        { value: '5', label: '5 - En Düşük' }
      ]
    }
  ], [savedTours, savedCompanies]);

  const filteredAndSortedTours = useMemo(() => {
    return [...createdTours]
      .filter(tour => {
        const searchLower = searchQuery.toLowerCase();
        return (
          searchQuery === '' ||
          tour.tourName.toLowerCase().includes(searchLower) ||
          tour.operator.toLowerCase().includes(searchLower)
        );
      })
      .filter(tour => {
        if (showActive === 'all') return true;
        return showActive === 'active' ? tour.isActive : !tour.isActive;
      })
      .sort((a, b) => {
        // Önce önceliğe göre sırala
        const priorityA = parseInt(a.priority) || 0;
        const priorityB = parseInt(b.priority) || 0;
        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }
        // Aynı öncelikte olanları isme göre sırala
        const nameA = a.tourName.toLowerCase();
        const nameB = b.tourName.toLowerCase();
        return nameA.localeCompare(nameB);
      });
  }, [createdTours, searchQuery, showActive]);

  const handleStatusChange = (tourId) => {
    setCreatedTours(prev => prev.map(tour => {
      if (tour === tourId) {
        const updatedTour = { ...tour, isActive: !tour.isActive };
        return updatedTour;
      }
      return tour;
    }));
  };

  const handlePickupTimeStatusChange = (tourIndex, pickupTimeIndex) => {
    setCreatedTours(prev => {
      const newTours = [...prev];
      const tour = { ...newTours[tourIndex] };
      
      if (!tour?.relatedData?.pickupTimes?.[pickupTimeIndex]) {
        return prev;
      }

      const pickupTimes = [...tour.relatedData.pickupTimes];
      const currentTime = pickupTimes[pickupTimeIndex];

      // isActive değerinin varlığını kontrol edelim
      const newIsActive = currentTime.isActive === undefined ? false : !currentTime.isActive;

      pickupTimes[pickupTimeIndex] = {
        ...currentTime,
        isActive: newIsActive
      };
      
      tour.relatedData = {
        ...tour.relatedData,
        pickupTimes
      };
      
      newTours[tourIndex] = tour;
      return newTours;
    });
  };

  const handleDayStatusChange = (tourIndex, dayId) => {
    setCreatedTours(prev => {
      const newTours = [...prev];
      const tour = { ...newTours[tourIndex] };
      
      // Eğer days dizisi yoksa oluştur
      if (!Array.isArray(tour.relatedData?.days)) {
        tour.relatedData = {
          ...tour.relatedData,
          days: []
        };
      }

      // Günleri kopyala
      const days = [...tour.relatedData.days];
      
      // Gün zaten seçili mi kontrol et
      const dayIndex = days.indexOf(dayId);
      if (dayIndex !== -1) {
        // Gün seçili, kaldır
        days.splice(dayIndex, 1);
      } else {
        // Gün seçili değil, ekle
        days.push(dayId);
      }

      // Günleri sırala
      days.sort((a, b) => a - b);

      // Güncellenmiş tour nesnesini oluştur
      tour.relatedData = {
        ...tour.relatedData,
        days
      };
      
      newTours[tourIndex] = tour;
      return newTours;
    });
  };

  const handleSaveToDatabase = async () => {
    try {
      const agencyUser = JSON.parse(localStorage.getItem('agencyUser'));
      if (!agencyUser?.companyId) {
        alert('Şirket ID bulunamadı. Lütfen tekrar giriş yapın.');
        return;
      }

      // Mevcut veritabanındaki turları al
      const existingToursResponse = await getAllTours(agencyUser.companyId);
      const existingTours = existingToursResponse.success ? existingToursResponse.data : [];
      
      // Silinecek turları bul
      const toursToDelete = existingTours
        .filter(existingTour => 
          !createdTours.some(stateTour => 
            stateTour.id === existingTour.mainTour.id
          )
        )
        .map(tour => tour.mainTour.id);

      // Silinecek turlar varsa sil
      for (const tourId of toursToDelete) {
        await deleteTour(tourId);
      }

      // Debug için savedTours içeriğini kontrol et
      console.log('Mevcut savedTours:', savedTours);

      const toursToSave = createdTours.map(tour => {
        const tourName = tour.tourName.trim();
        let mainTourName = tourName;
        
        console.log('İşlenen tur:', {
          tourName,
          savedTours: savedTours.map(st => st.name),
          hasSubTours: savedTours.some(st => st.subTours?.length > 0)
        });

        // Ana tur bulma mantığı
        for (const savedTour of savedTours) {
          if (savedTour.name === tourName) {
            mainTourName = savedTour.name;
            console.log(`Ana tur eşleşmesi bulundu: ${tourName}`);
            break;
          }
          if (savedTour.subTours?.some(subTour => subTour.name === tourName)) {
            mainTourName = savedTour.name;
            console.log(`Alt tur için ana tur bulundu: ${tourName} -> ${savedTour.name}`);
            break;
          }
        }

        const tourData = {
          mainTour: {
            company_ref: agencyUser.companyId,
            tour_name: tourName,
            main_tour_name: mainTourName,
            operator: tour.operator,
            operator_id: tour.operatorId,
            adult_price: tour.adultPrice,
            child_price: tour.childPrice,
            guide_adult_price: tour.guideAdultPrice,
            guide_child_price: tour.guideChildPrice,
            is_active: Boolean(tour.isActive),
            bolge_id: tour.bolgeId || [],
            bolgeler: tour.bolgeler || [],
            priority: tour.priority || '0',
            description: tour.description || '',
            currency: tour.currency || 'EUR'
          },
          days: tour.relatedData.days,
          pickupTimes: tour.relatedData.pickupTimes,
          options: tour.relatedData.options
        };

        console.log('Kaydedilecek tur verisi:', tourData);
        return tourData;
      });

      const response = await saveAllTours(toursToSave);
      
      if (response.success) {
        // Başarılı kayıttan sonra güncel turları yükle
        const updatedToursResponse = await getAllTours(agencyUser.companyId);
        if (updatedToursResponse.success && Array.isArray(updatedToursResponse.data)) {
          const formattedTours = updatedToursResponse.data.map(tour => ({
            id: tour.mainTour.id,
            tourName: tour.mainTour.tour_name,
            operator: tour.mainTour.operator,
            operatorId: tour.mainTour.operator_id,
            adultPrice: tour.mainTour.adult_price,
            childPrice: tour.mainTour.child_price,
            guideAdultPrice: tour.mainTour.guide_adult_price,
            guideChildPrice: tour.mainTour.guide_child_price,
            isActive: tour.mainTour.is_active,
            priority: tour.mainTour.priority || '0',
            bolgeler: tour.mainTour.bolgeler || [],
            description: tour.mainTour.description || '',
            currency: tour.mainTour.currency || 'EUR',
            relatedData: {
              days: tour.days || [],
              pickupTimes: tour.pickupTimes || [],
              options: tour.options || []
            }
          }));
          setCreatedTours(formattedTours);
        }
        alert('Tüm değişiklikler başarıyla kaydedildi!');
      } else {
        alert('Kayıt sırasında bir hata oluştu: ' + response.message);
      }
    } catch (error) {
      // console.error('Kayıt hatası:', error);
      alert('Değişiklikler kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  // Bileşen unmount olduğunda localStorage'ı temizle
  useEffect(() => {
    // Cleanup function
    return () => {
      localStorage.removeItem('currentTourData');
      localStorage.removeItem('createdTours');
      localStorage.removeItem('tourList');
      localStorage.removeItem('bolgeList');
      localStorage.removeItem('regionList');
    };
  }, []); // Boş dependency array ile sadece unmount'ta çalışır

  return (
    <div className="container mt-4">
      <div className="card mb-4">
        <TourHeader
          isEditing={editingIndex !== null}
          isCollapsed={isCollapsed}
          onCollapse={() => setIsCollapsed(!isCollapsed)}
          onCancel={resetForm}
        />
        <div className={`card-body ${isCollapsed ? 'd-none' : ''}`}>
          <TourForm
            tourData={tourData}
            formInputs={formInputs}
            savedRegions={savedRegions} 
            savedAreas={savedAreas}
            onSubmit={handleSubmit}
            onChange={handleChange}
            onTimeChange={handleTimeChange}
            onAddTime={addPickupTime}
            onRemoveTime={removePickupTime}
            onOptionChange={handleOptionChange}
            onAddOption={() => setTourData(prev => ({
              ...prev,
              options: [...prev.options, { name: '', price: '' }]
            }))}
            onRemoveOption={(index) => setTourData(prev => ({
              ...prev,
              options: prev.options.filter((_, i) => i !== index)
            }))}
            onDaySelect={handleDaySelect}
            onSelectAllDays={handleSelectAllDays}
            bolgeler={bolgeler}
          />
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">
              <i className="bi bi-table me-2"></i>
              Oluşturulan Turlar
            </h4>
            <div className="d-flex gap-3 align-items-center">
              <div className="input-group" style={{ width: '300px' }}>
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tur veya operatör ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="form-select"
                value={showActive}
                onChange={(e) => setShowActive(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="all">Tümü</option>
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
              </select>
            </div>
          </div>
        </div>
        <div className="card-body">
          <TourTable 
            tours={filteredAndSortedTours}
            onEdit={handleEdit}
            onDelete={handleDelete}
            bolgeler={bolgeler}
            onCopy={handleCopy}
            onStatusChange={handleStatusChange}
            onPickupTimeStatusChange={handlePickupTimeStatusChange}
            onDayStatusChange={handleDayStatusChange}
            onSaveToDatabase={handleSaveToDatabase}
          />
        </div>
      </div>
    </div>
  );
};

export default Tours;
