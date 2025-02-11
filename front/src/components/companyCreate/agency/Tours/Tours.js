import React, { useState, useMemo, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import TourForm from './components/TourForm';
import TourHeader from './components/TourHeader';
import TourTable from './components/TourTable';
import { DAYS } from './components/form_inputs/DaySelector';
import { INITIAL_TOUR_STATE } from './hooks/constants';
import { useTourData } from './hooks/useTourData';
import { useTourState } from './hooks/useTourState';
import { useTourOperations } from './hooks/useTourOperations';
import { saveAllTours, getAllTours, deleteTour } from '../../../../services/api';
import RegionFilter from './components/form_inputs/RegionFilter';

const Tours = () => {
  const {
    tourData,
    setTourData,
    createdTours,
    setCreatedTours,
    editingIndex,
    setEditingIndex,
    isCollapsed,
    setIsCollapsed,
    searchQuery,
    setSearchQuery,
    showActive,
    setShowActive
  } = useTourState();

  const {
    savedTours,
    savedRegions,
    savedAreas,
    savedCompanies,
    bolgeler
  } = useTourData();

  const {
    resetForm,
    handleEdit,
    handleSaveToDatabase,
    // ... diğer işlemler
  } = useTourOperations(
    tourData,
    setTourData,
    createdTours,
    setCreatedTours,
    editingIndex,
    setEditingIndex,
    setIsCollapsed,
    savedCompanies,
    bolgeler
  );

  const [selectedRegions, setSelectedRegions] = useState([]);

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
            tourGroup: tour.mainTour.tour_group || '',
            relatedData: {
              days: tour.days || [],
              pickupTimes: tour.pickupTimes || [],
              options: tour.options || []
            }
          }));
          console.log('Loaded Tours - formattedTours:', formattedTours);
          setCreatedTours(formattedTours);
        }
      } catch (error) {
        console.error('Turlar yüklenirken hata:', error);
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
    const { name, value, tourGroup } = e.target;
    setTourData(prev => ({
      ...prev,
      [name]: value,
      ...(tourGroup && { tourGroup })
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tourData.tourName || !tourData.operator) {
      alert('Lütfen gerekli alanları doldurunuz!');
      return;
    }

    console.log('Form Submit - tourData:', tourData);

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

    console.log('Form Submit - mainTourData:', mainTourData);

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

  const handleCopy = (tourToCopy) => {
    const copiedTour = {
      ...tourToCopy,
      id: null,
      tourName: `${tourToCopy.tourName} (Kopya)`,
      relatedData: {
        ...tourToCopy.relatedData,
        pickupTimes: tourToCopy.relatedData.pickupTimes.map(time => ({
          ...time,
          id: null
        })),
        options: tourToCopy.relatedData.options.map(option => ({
          ...option,
          id: null
        }))
      }
    };
    setCreatedTours(prev => [...prev, copiedTour]);
  };

  const handleDelete = (tourToDelete) => {
    setCreatedTours(prev => prev.filter(tour => 
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
          isMainTour: true,
          mainTourName: tour.name
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
        const matchesSearch = searchQuery === '' ||
          tour.tourName.toLowerCase().includes(searchLower) ||
          tour.operator.toLowerCase().includes(searchLower);

        const matchesActive = showActive === 'all' ? true :
          showActive === 'active' ? tour.isActive : !tour.isActive;

        const matchesRegion = selectedRegions.length === 0 ||
          selectedRegions.some(regionId => 
            tour.bolgeler?.includes(
              bolgeler.find(b => b.id === regionId)?.name
            )
          );

        return matchesSearch && matchesActive && matchesRegion;
      })
      .sort((a, b) => {
        const priorityA = parseInt(a.priority) || 0;
        const priorityB = parseInt(b.priority) || 0;
        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }
        return a.tourName.toLowerCase().localeCompare(b.tourName.toLowerCase());
      });
  }, [createdTours, searchQuery, showActive, selectedRegions, bolgeler]);

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
      
      if (!Array.isArray(tour.relatedData?.days)) {
        tour.relatedData = {
          ...tour.relatedData,
          days: []
        };
      }

      const days = [...tour.relatedData.days];
      
      const dayIndex = days.indexOf(dayId);
      if (dayIndex !== -1) {
        days.splice(dayIndex, 1);
      } else {
        days.push(dayId);
      }

      days.sort((a, b) => a - b);

      tour.relatedData = {
        ...tour.relatedData,
        days
      };
      
      newTours[tourIndex] = tour;
      return newTours;
    });
  };

  useEffect(() => {
    return () => {
      localStorage.removeItem('currentTourData');
      localStorage.removeItem('createdTours');
      localStorage.removeItem('tourList');
      localStorage.removeItem('bolgeList');
      localStorage.removeItem('regionList');
    };
  }, []);

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
          <div className="d-flex flex-column gap-3">
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
            <div className="d-flex justify-content-end">
            <RegionFilter
              selectedRegions={selectedRegions}
              setSelectedRegions={setSelectedRegions}
              bolgeler={bolgeler}
            />
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
