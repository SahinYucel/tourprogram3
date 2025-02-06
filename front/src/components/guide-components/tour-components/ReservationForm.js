import React from 'react';

const ReservationForm = ({
  isLoading,
  error,
  selectedTour,
  availableTours,
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
                  {availableTours.map(tour => (
                    <option key={tour.id} value={tour.id}>
                      {tour.tour_name} {tour.default_price && `(${tour.default_price} ${currency})`}
                    </option>
                  ))}
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
                <option value="TRY">₺ TRY</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
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
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Alınış Alan</label>
              <select
                className="form-select"
                value={customerInfo.pickupArea}
                onChange={(e) => onCustomerInfoChange({ pickupArea: e.target.value })}
                disabled={!customerInfo.pickupRegion}
              >
                <option value="">Alan Seçiniz</option>
                {customerInfo.pickupRegion && areas[customerInfo.pickupRegion]?.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
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

            {/* Tarih ve Saat */}
            <div className="col-md-4">
              <label className="form-label">Tarih</label>
              <input
                type="date"
                className="form-control"
                value={customerInfo.pickupDate}
                onChange={(e) => onCustomerInfoChange({ pickupDate: e.target.value })}
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
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationForm; 