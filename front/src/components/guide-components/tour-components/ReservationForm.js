import React, { useEffect } from 'react';

const ReservationForm = ({
  isLoading,
  error,
  selectedTour,
  availableTours = [],
  tourPrice,
  currency,
  customerInfo,
  regions,
  areas,
  countryCodes,
  onTourSelect,
  onTourPriceChange,
  onCurrencyChange,
  onCustomerInfoChange,
  onSubmit,
  editingReservation,
  onUpdate
}) => {
  // Seçili tur değiştiğinde bölge ve alanları güncelle
  const selectedTourData = availableTours.find(t => t.id === parseInt(selectedTour));

  // Haftanın günleri
  const weekDays = [
    { id: 1, name: 'Pazartesi' },
    { id: 2, name: 'Salı' },
    { id: 3, name: 'Çarşamba' },
    { id: 4, name: 'Perşembe' },
    { id: 5, name: 'Cuma' },
    { id: 6, name: 'Cumartesi' },
    { id: 7, name: 'Pazar' }
  ];

  // Saat seçimi - seçilen bölge ve alana göre otomatik doldur
  useEffect(() => {
    if (selectedTourData && customerInfo.pickupRegion && customerInfo.pickupArea) {
      const pickupDetail = selectedTourData.pickupTimes?.find(
        pickup => pickup.region === customerInfo.pickupRegion && 
                  pickup.area === customerInfo.pickupArea &&
                  pickup.periodActive === 1
      );
      
      if (pickupDetail) {
        onCustomerInfoChange({
          ...customerInfo, // Mevcut state'i koru
          pickupTime: {
            hour: pickupDetail.hour || '',
            minute: pickupDetail.minute || ''
          }
        });
      }
    }
  }, [selectedTourData, customerInfo.pickupRegion, customerInfo.pickupArea]); // onCustomerInfoChange'i dependency'den çıkaralım

  // Debug loglarını kaldıralım
  // console.log('Select disabled status:', !customerInfo.pickupRegion);
  // console.log('Current pickupRegion:', customerInfo.pickupRegion);

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Yeni Rezervasyon</h5>
      </div>
      <div className="card-body">
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
          <div className="row g-3">
            {/* Tur Seçimi */}
            <div className="col-md-6">
              <label className="form-label">Tur Seçimi</label>
              {isLoading ? (
                <div className="d-flex align-items-center">
                  <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                    <span className="visually-hidden">Yükleniyor...</span>
                  </div>
                  <span className="text-muted">Turlar yükleniyor...</span>
                </div>
              ) : error ? (
                <div className="text-danger">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              ) : (
                <select 
                  className="form-select"
                  value={selectedTour}
                  onChange={onTourSelect}
                >
                  <option value="">Tur Seçiniz</option>
                  {Array.isArray(availableTours) && availableTours.map(tour => {
                    console.log('Tour option:', tour);
                    return (
                      <option key={tour.id} value={tour.id}>
                        {tour.tour_name || tour.name || tour.tourName || 'İsimsiz Tur'}
                      </option>
                    );
                  })}
                </select>
              )}
            </div>

            {/* Fiyat ve Para Birimi */}
            <div className="col-md-4">
              <label className="form-label">Fiyat</label>
              <input
                type="number"
                className="form-control"
                value={tourPrice}
                onChange={onTourPriceChange}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Para Birimi</label>
              <select
                className="form-select"
                value={currency}
                onChange={onCurrencyChange}
              >
                <option value="GBP">£ GBP</option>
                <option value="EUR">€ EUR</option>
                <option value="USD">$ USD</option>
                <option value="TRY">₺ TRY</option>
              </select>
            </div>

            {/* Müşteri Bilgileri */}
            <div className="col-md-6">
              <label className="form-label">Müşteri Adı</label>
              <input
                type="text"
                className="form-control"
                value={customerInfo.name}
                onChange={(e) => onCustomerInfoChange({ name: e.target.value })}
              />
            </div>

            {/* Telefon */}
            <div className="col-md-2">
              <label className="form-label">Kod</label>
              <select
                className="form-select"
                value={customerInfo.phoneCode}
                onChange={(e) => onCustomerInfoChange({ phoneCode: e.target.value })}
              >
                {countryCodes.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.code} ({country.country})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Telefon</label>
              <input
                type="tel"
                className="form-control"
                value={customerInfo.phone}
                onChange={(e) => onCustomerInfoChange({ phone: e.target.value })}
              />
            </div>

            {/* Alınış Bilgileri */}
            <div className="col-md-6">
              <label className="form-label">Alınış Bölge</label>
              <select
                className="form-select"
                value={customerInfo.pickupRegion}
                onChange={(e) => {
                  const selectedRegion = e.target.value;
                  onCustomerInfoChange({
                    pickupRegion: selectedRegion,
                    pickupArea: '' // Bölge değiştiğinde alanı sıfırla
                  });
                }}
              >
                <option value="">Bölge Seçiniz</option>
                {selectedTourData?.pickupTimes && 
                  [...new Set(selectedTourData.pickupTimes.map(pickup => pickup.region))]
                    .map((region, index) => (
                      <option key={`${region}-${index}`} value={region}>
                        {region}
                      </option>
                    ))
                }
              </select>
            </div>

            {/* Alınış Alan */}
            <div className="col-md-6">
              <label className="form-label">Alınış Alan</label>
              <select
                className="form-select"
                value={customerInfo.pickupArea || ''}
                onChange={(e) => {
                  const selectedArea = e.target.value;
                  if (selectedArea !== customerInfo.pickupArea) { // Sadece değişiklik varsa güncelle
                    onCustomerInfoChange({
                      ...customerInfo,
                      pickupArea: selectedArea,
                      pickupTime: { hour: '', minute: '' },
                      period: ''
                    });
                  }
                }}
                disabled={!customerInfo.pickupRegion}
              >
                <option value="">Alan Seçiniz</option>
                {React.useMemo(() => (
                  [...new Set(selectedTourData?.pickupTimes
                    ?.filter(pickup => 
                      pickup.region === customerInfo.pickupRegion && 
                      pickup.periodActive === 1
                    )
                    ?.map(pickup => pickup.area))]
                    .sort()
                    .map((area, index) => (
                      <option key={`${area}-${index}`} value={area}>
                        {area}
                      </option>
                    ))
                ), [selectedTourData, customerInfo.pickupRegion])}
              </select>
            </div>

            {/* Saat ve Fiyat Bilgileri */}
            <div className="col-md-12">
              <div className="row">
                {/* Transfer Saati */}
                <div className="col-md-4">
                  <label className="form-label">Transfer Saati</label>
                  <select
                    className="form-select"
                    value={customerInfo.pickupTime.hour && customerInfo.pickupTime.minute ? 
                      `${customerInfo.pickupTime.hour}:${customerInfo.pickupTime.minute}` : ''}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      const currentValue = `${customerInfo.pickupTime.hour}:${customerInfo.pickupTime.minute}`;
                      
                      if (newValue !== currentValue) {
                        if (!newValue) {
                          onCustomerInfoChange({
                            ...customerInfo,
                            pickupTime: { hour: '', minute: '' }
                          });
                          return;
                        }

                        const [hour, minute] = newValue.split(':');
                        const selectedTime = selectedTourData?.pickupTimes?.find(
                          pickup => 
                            pickup.region === customerInfo.pickupRegion && 
                            pickup.area === customerInfo.pickupArea &&
                            pickup.hour === hour &&
                            pickup.minute === minute &&
                            pickup.periodActive === 1
                        );

                        onCustomerInfoChange({
                          ...customerInfo,
                          pickupTime: { hour, minute },
                          period: selectedTime?.period?.toString() || ''
                        });
                      }
                    }}
                    disabled={!customerInfo.pickupArea}
                  >
                    <option value="">Saat Seçiniz</option>
                    {React.useMemo(() => (
                      selectedTourData?.pickupTimes
                        ?.filter(pickup => 
                          pickup.region === customerInfo.pickupRegion && 
                          pickup.area === customerInfo.pickupArea &&
                          pickup.periodActive === 1
                        )
                        ?.sort((a, b) => {
                          const timeA = parseInt(a.hour) * 60 + parseInt(a.minute);
                          const timeB = parseInt(b.hour) * 60 + parseInt(b.minute);
                          return timeA - timeB;
                        })
                        ?.map((pickup, index) => (
                          <option 
                            key={`${pickup.hour}:${pickup.minute}-${pickup.period}-${index}`} 
                            value={`${pickup.hour}:${pickup.minute}`}
                          >
                            {`${pickup.hour.padStart(2, '0')}:${pickup.minute.padStart(2, '0')}`}
                            {pickup.period ? ` (${pickup.period}. Periyod)` : ''}
                          </option>
                        ))
                    ), [selectedTourData, customerInfo.pickupRegion, customerInfo.pickupArea])}
                  </select>
                </div>

                {/* Rehber Yetişkin Fiyatı */}
              

                {/* Rehber Çocuk Fiyatı */}
            
              </div>
            </div>

            {/* Otel */}
            <div className="col-md-12">
              <label className="form-label">Otel</label>
              <input
                type="text"
                className="form-control"
                value={customerInfo.pickupHotel}
                onChange={(e) => onCustomerInfoChange({ pickupHotel: e.target.value })}
              />
            </div>

            {/* Tur günleri seçimi - Tarih inputundan önce ekleyelim */}
            <div className="col-md-12 mb-3">
              <label className="form-label">Tur Günleri</label>
              <div className="d-flex gap-2 flex-wrap">
                {weekDays.map(day => {
                  const isAvailable = selectedTourData?.tourDays?.includes(day.id);
                  return (
                    <button
                      key={day.id}
                      type="button"
                      className={`btn ${
                        customerInfo.selectedDay === day.id
                          ? 'btn-primary'
                          : isAvailable
                          ? 'btn-outline-primary'
                          : 'btn-outline-secondary'
                      }`}
                      disabled={!isAvailable}
                      onClick={() => onCustomerInfoChange({ selectedDay: day.id })}
                    >
                      {day.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tarih seçimi */}
            <div className="col-md-4">
              <label className="form-label">Tarih</label>
              <input
                type="date"
                className="form-control"
                value={customerInfo.pickupDate}
                onChange={(e) => {
                  // Seçilen tarihin hangi güne denk geldiğini bul
                  const selectedDate = new Date(e.target.value);
                  const dayOfWeek = selectedDate.getDay() || 7; // 0-6 -> 1-7

                  // Eğer seçilen gün tur günlerinden biri değilse uyarı ver
                  if (selectedTourData?.tourDays && !selectedTourData.tourDays.includes(dayOfWeek)) {
                    alert('Seçilen tarih için tur bulunmamaktadır. Lütfen tur günlerinden birini seçin.');
                    return;
                  }

                  onCustomerInfoChange({ 
                    pickupDate: e.target.value,
                    selectedDay: dayOfWeek
                  });
                }}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Saat</label>
              <input
                type="number"
                className="form-control"
                value={customerInfo.pickupTime.hour}
                min="0"
                max="23"
                placeholder="0-23"
                onChange={(e) => onCustomerInfoChange({
                  pickupTime: { 
                    ...customerInfo.pickupTime, 
                    hour: e.target.value
                  }
                })}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Dakika</label>
              <input
                type="number"
                className="form-control"
                value={customerInfo.pickupTime.minute}
                min="0"
                max="59"
                placeholder="0-59"
                onChange={(e) => onCustomerInfoChange({
                  pickupTime: { 
                    ...customerInfo.pickupTime, 
                    minute: e.target.value
                  }
                })}
              />
            </div>

            {/* Kişi Sayıları */}
           

            <div className="col-md-4">
              <label className="form-label">Çocuk</label>
              <input
                type="number"
                className="form-control"
                value={customerInfo.pax.child}
                onChange={(e) => onCustomerInfoChange({
                  pax: { ...customerInfo.pax, child: e.target.value }
                })}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Ücretsiz</label>
              <input
                type="number"
                className="form-control"
                value={customerInfo.pax.free}
                onChange={(e) => onCustomerInfoChange({
                  pax: { ...customerInfo.pax, free: e.target.value }
                })}
              />
            </div>


            <div className="col-md-4">
              <label className="form-label">Yetişkin</label>
              <input
                type="number"
                className="form-control"
                value={customerInfo.pax.adult}
                onChange={(e) => onCustomerInfoChange({
                  pax: { ...customerInfo.pax, adult: e.target.value }
                })}
              />
            </div>


            {/* Ödeme Tipi */}
            <div className="col-md-12">
              <label className="form-label d-block">Ödeme Tipi</label>
              <div className="btn-group" role="group">
                <input
                  type="radio"
                  className="btn-check"
                  name="paymentType"
                  id="cash"
                  value="cash"
                  checked={customerInfo.paymentType === 'cash'}
                  onChange={(e) => onCustomerInfoChange({ paymentType: e.target.value })}
                />
                <label className="btn btn-outline-primary" htmlFor="cash">
                  <i className="bi bi-cash me-2"></i>
                  Nakit
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="paymentType"
                  id="card"
                  value="card"
                  checked={customerInfo.paymentType === 'card'}
                  onChange={(e) => onCustomerInfoChange({ paymentType: e.target.value })}
                />
                <label className="btn btn-outline-primary" htmlFor="card">
                  <i className="bi bi-credit-card me-2"></i>
                  Kart
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="col-12 mt-3">
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  Sepete Ekle
                </button>
                {editingReservation && (
                  <button 
                    type="button" 
                    className="btn btn-success"
                    onClick={onUpdate}
                  >
                    Güncelle
                  </button>
                )}
              </div>
                <div className="col-md-8 d-flex justify-content-end">
                  <div className='col-md-4'>
                    <label className="form-label">{selectedTourData?.guideAdultPrice}</label>
                  </div>
                  <div className='col-md-4'>
                      <label className="form-label">{selectedTourData?.guideChildPrice}</label>
                  </div>
                  
                </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationForm; 