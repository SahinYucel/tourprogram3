import { useCallback } from 'react';
import { INITIAL_TOUR_STATE } from './constants';
import { saveAllTours, getAllTours, deleteTour } from '../../../../../services/api';

export const useTourOperations = (
  tourData,
  setTourData,
  createdTours,
  setCreatedTours,
  editingIndex,
  setEditingIndex,
  setIsCollapsed,
  savedCompanies,
  bolgeler
) => {
  const resetForm = useCallback(() => {
    setTourData({
      ...INITIAL_TOUR_STATE,
      pickupTimes: [{
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
  }, [setTourData, setEditingIndex, setIsCollapsed]);

  const handleEdit = useCallback((tour) => {
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
  }, [createdTours, savedCompanies, bolgeler, setTourData, setEditingIndex, setIsCollapsed]);

  const handleSaveToDatabase = useCallback(async () => {
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

      const toursToSave = createdTours.map(tour => {
        const tourName = tour.tourName.trim();
        let mainTourName = tourName;

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
      alert('Değişiklikler kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  }, [createdTours, setCreatedTours]);

  return {
    resetForm,
    handleEdit,
    handleSaveToDatabase
  };
}; 