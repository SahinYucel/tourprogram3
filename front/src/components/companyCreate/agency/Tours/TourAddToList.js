import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { saveTourData, getTourData } from '../../../../services/api';
import TourList from './components/tourList_sub/TourList';
import RegionList from './components/tourList_sub/RegionList';
import RegionAreaList from './components/tourList_sub/RegionAreaList';

const TourAddToList = () => {
  console.log('TourAddToList component rendered'); // Test için eklendi

  // Tour states
  const [tourName, setTourName] = useState('');
  const [tours, setTours] = useState([]);
  const [counter, setCounter] = useState(1);

  // Bolgelendirme states
  const [bolgelendir, setBolgelendir] = useState('');
  const [bolgeler, setBolgeler] = useState([]);
  const [bolgeCounter, setBolgeCounter] = useState(1);

  // Region and Area states
  const [regionName, setRegionName] = useState('');
  const [regions, setRegions] = useState([]);
  const [regionCounter, setRegionCounter] = useState(1);

  // Area states
  const [areaName, setAreaName] = useState('');
  const [selectedRegionId, setSelectedRegionId] = useState(null);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isRegionCollapsed, setIsRegionCollapsed] = useState(false);
  const [isAreaCollapsed, setIsAreaCollapsed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('tourList', JSON.stringify(tours));
    localStorage.setItem('tourCounter', counter.toString());
    localStorage.setItem('bolgeList', JSON.stringify(bolgeler));
    localStorage.setItem('bolgeCounter', bolgeCounter.toString());
    localStorage.setItem('regionList', JSON.stringify(regions));
    localStorage.setItem('regionCounter', regionCounter.toString());
  }, [tours, counter, bolgeler, bolgeCounter, regions, regionCounter]);

  // Clean up localStorage on unmount
  useEffect(() => {
    return () => {
      localStorage.removeItem('tourList');
      localStorage.removeItem('bolgeList');
      localStorage.removeItem('regionList');
      localStorage.removeItem('tourCounter');
      localStorage.removeItem('bolgeCounter');
      localStorage.removeItem('regionCounter');
    };
  }, []);

  // Verileri veritabanından çekme
  useEffect(() => {
    const fetchTourData = async () => {
      try {
        const agencyUser = JSON.parse(localStorage.getItem('agencyUser'));
        
        if (!agencyUser?.companyId) {
          console.warn('Şirket ID bulunamadı');
          return;
        }

        const data = await getTourData(agencyUser.companyId);
        
        if (data) {
          // Verileri state'lere set et
          if (data.tours) {
            // Ensure each tour has a subTours array
            const toursWithSubTours = data.tours.map(tour => ({
              ...tour,
              subTours: tour.subTours || []
            }));
            setTours(toursWithSubTours);
            // En yüksek tour ID'sini bul ve counter'ı güncelle
            const maxTourId = Math.max(...data.tours.map(t => t.id), 0);
            setCounter(maxTourId + 1);
          }
          
          if (data.bolgeler) {
            setBolgeler(data.bolgeler);
            const maxBolgeId = Math.max(...data.bolgeler.map(b => b.id), 0);
            setBolgeCounter(maxBolgeId + 1);
          }
          
          if (data.regions) {
            setRegions(data.regions);
            const maxRegionId = Math.max(...data.regions.map(r => r.id), 0);
            setRegionCounter(maxRegionId + 1);
          }
        }
      } catch (error) {
        console.error('Veri çekme hatası:', error);
      }
    };

    fetchTourData();
  }, []);

  // Remove handleGroupDelete and modify handleDelete
  const handleDelete = useCallback((id, type, parentId) => {
    if (window.confirm(`Bu ${type}yi silmek istediğinizden emin misiniz?`)) {
      switch(type) {
        case 'tur':
          setTours(prev => prev.filter(item => item.id !== id));
          break;
        case 'alt-tur':
          setTours(prev => prev.map(tour => 
            tour.id === parentId ? {
              ...tour,
              subTours: tour.subTours.filter(subTour => subTour.id !== id)
            } : tour
          ));
          break;
        case 'bölge':
          setBolgeler(prev => prev.filter(item => item.id !== id));
          break;
        case 'region':
          setRegions(prev => prev.filter(item => item.id !== id));
          break;
        case 'alan':
          setRegions(prev => prev.map(region => 
            region.id === parentId
              ? { ...region, areas: region.areas.filter(area => area.id !== id) }
              : region
          ));
          break;
      }
    }
  }, []);

  // Tour handlers
  const handleTourSubmit = useCallback((e) => {
    e.preventDefault();
    if (!tourName.trim()) return;

    const newTour = {
      id: counter,
      name: tourName.trim(),
      subTours: [] // Initialize empty subTours array
    };

    setTours(prev => [...prev, newTour]);
    setCounter(prev => prev + 1);
    setTourName('');
  }, [tourName, counter]);

  // Bolgelendirme handlers
  const handleBolgelendirSubmit = useCallback((e) => {
    e.preventDefault();
    if (!bolgelendir.trim()) return;

    // Yeni bölge objesi oluştur
    const newBolge = {
      id: bolgeCounter,
      name: bolgelendir.trim().toUpperCase()
    };

    // bolgeler state'ini güncelle
    setBolgeler(prev => [...prev, newBolge]);
    setBolgeCounter(prev => prev + 1);
    setBolgelendir('');

    // LocalStorage'ı güncelle
    const updatedBolgeler = [...bolgeler, newBolge];
    localStorage.setItem('bolgeList', JSON.stringify(updatedBolgeler));

    console.log('Güncel bolgeler:', updatedBolgeler); // Debug için
  }, [bolgelendir, bolgeCounter, bolgeler]);

  // Region handlers
  const handleRegionSubmit = useCallback((e) => {
    e.preventDefault();
    if (!regionName.trim()) return;

    const newRegion = {
      id: regionCounter,
      name: regionName.trim(),
      areas: []
    };

    setRegions(prev => [...prev, newRegion]);
    setRegionCounter(prev => prev + 1);
    setRegionName('');
  }, [regionName, regionCounter]);

  // Area handlers
  const handleAreaSubmit = useCallback((e) => {
    e.preventDefault();
    if (!areaName.trim() || !selectedRegionId) return;

    const newArea = {
      id: Date.now(),
      name: areaName.trim()
    };

    setRegions(prev => prev.map(region => 
      region.id === selectedRegionId
        ? { ...region, areas: [...region.areas, newArea] }
        : region
    ));
    setAreaName('');
  }, [areaName, selectedRegionId]);

  // Update handlers
  const handleTourUpdate = useCallback((id, newName, isSubTour = false, parentId = null) => {
    if (isSubTour) {
      setTours(prev => prev.map(tour => 
        tour.id === parentId ? {
          ...tour,
          subTours: tour.subTours.map(subTour =>
            subTour.id === id ? { ...subTour, name: newName } : subTour
          )
        } : tour
      ));
    } else {
      setTours(prev => prev.map(tour => 
        tour.id === id ? { ...tour, name: newName } : tour
      ));
    }
  }, []);

  const handleBolgeUpdate = useCallback((id, newName) => {
    setBolgeler(prev => prev.map(bolge => 
      bolge.id === id ? { ...bolge, name: newName } : bolge
    ));
  }, []);

  const handleRegionUpdate = useCallback((id, newName) => {
          setRegions(prev => prev.map(region => 
      region.id === id ? { ...region, name: newName } : region
          ));
  }, []);

  const handleAreaUpdate = useCallback((regionId, areaId, newName) => {
    setRegions(prev => prev.map(region => 
      region.id === regionId ? {
        ...region,
        areas: region.areas.map(area => 
          area.id === areaId ? { ...area, name: newName } : area
        )
      } : region
    ));
  }, []);

  // Update handleSaveToDatabase
  const handleSaveToDatabase = async () => {
    try {
      setIsSaving(true);
      const agencyUser = JSON.parse(localStorage.getItem('agencyUser'));
      
      if (!agencyUser?.companyId) {
        alert('Şirket bilgisi bulunamadı. Lütfen tekrar giriş yapın.');
        return;
      }

      // Prepare tours data with subTours
      const toursWithSubTours = tours.map(tour => ({
        id: tour.id,
        name: tour.name,
        subTours: tour.subTours || [] // Ensure subTours exists
      }));

      const data = {
        tours: toursWithSubTours,
        bolgeler,
        regions
      };

      const savedData = await saveTourData(agencyUser.companyId, data);
      console.log('Veritabanına kaydedilen veriler:', savedData);

      // Verileri yeniden çek
      const updatedData = await getTourData(agencyUser.companyId);
      console.log('Veritabanından çekilen güncel veriler:', updatedData);
      
      if (updatedData) {
        if (updatedData.tours) setTours(updatedData.tours);
        if (updatedData.bolgeler) setBolgeler(updatedData.bolgeler);
        if (updatedData.regions) setRegions(updatedData.regions);
      }
      
      alert('Veriler başarıyla kaydedildi!');
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      alert('Veriler kaydedilirken bir hata oluştu: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubTourSubmit = useCallback(async (tourId, name) => {
    try {
      // Yeni alt tur objesi oluştur
      const newSubTour = {
        id: Date.now(), // Geçici unique ID
        name: name.toUpperCase(),
        tourId
      };

      // Tours state'ini güncelle
      setTours(prev => prev.map(tour => 
        tour.id === tourId ? {
          ...tour,
          subTours: [...(tour.subTours || []), newSubTour]
        } : tour
      ));

      // LocalStorage'ı güncelle
      const updatedTours = tours.map(tour => 
        tour.id === tourId ? {
          ...tour,
          subTours: [...(tour.subTours || []), newSubTour]
        } : tour
      );
      localStorage.setItem('tourList', JSON.stringify(updatedTours));

    } catch (error) {
      console.error('Alt tur ekleme hatası:', error);
    }
  }, [tours]);

  // formInputs tanımlamasını güncelleyelim
  const formInputs = [
    {
      id: 'tourName',
      label: 'Operatör',
      type: 'autocomplete',
      icon: 'bi-signpost-split',
      placeholder: 'Operatör seçin',
      options: tours.map(tour => ({ 
        value: tour.id.toString(),
        label: tour.name 
      }))
    },
    {
      id: 'tourGroup',
      label: 'Alt Tur',
      type: 'select',
      icon: 'bi-layers',
      placeholder: 'Alt tur seçin',
      options: tours.reduce((acc, tour) => {
        const subTours = tour.subTours || [];
        return [...acc, ...subTours.map(subTour => ({
          value: subTour.id.toString(),
          label: `${tour.name} - ${subTour.name}`
        }))];
      }, [])
    }
  ];

  return (
    <div className="container mt-4">
      <TourList 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        tourName={tourName}
        setTourName={setTourName}
        handleTourSubmit={handleTourSubmit}
        tours={tours}
        handleDelete={handleDelete}
        onUpdate={handleTourUpdate}
        onSubTourSubmit={handleSubTourSubmit}
      />

      <RegionList 
        isRegionCollapsed={isRegionCollapsed}
        setIsRegionCollapsed={setIsRegionCollapsed}
        bolgelendir={bolgelendir}
        setBolgelendir={setBolgelendir}
        handleBolgelendirSubmit={handleBolgelendirSubmit}
        bolgeler={bolgeler}
        handleDelete={handleDelete}
        onUpdate={handleBolgeUpdate}
      />

      <RegionAreaList 
        isAreaCollapsed={isAreaCollapsed}
        setIsAreaCollapsed={setIsAreaCollapsed}
        regionName={regionName}
        setRegionName={setRegionName}
        handleRegionSubmit={handleRegionSubmit}
        areaName={areaName}
        setAreaName={setAreaName}
        selectedRegionId={selectedRegionId}
        setSelectedRegionId={setSelectedRegionId}
        handleAreaSubmit={handleAreaSubmit}
        regions={regions}
        onRegionUpdate={handleRegionUpdate}
        onAreaUpdate={handleAreaUpdate}
        handleDelete={handleDelete}
      />

      {/* Save to Database Button */}
      <div className="d-grid gap-2 mb-4">
        <button 
          className="btn btn-success btn-lg"
          onClick={handleSaveToDatabase}
          disabled={isSaving || (tours.length === 0 && bolgeler.length === 0 && regions.length === 0)}
        >
          {isSaving ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Kaydediliyor...
            </>
          ) : (
            <>
              <i className="bi bi-cloud-upload me-2"></i>
              Veri Tabanına Kaydet
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TourAddToList; 