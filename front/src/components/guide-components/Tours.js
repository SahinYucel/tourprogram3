import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/guide-dashboard-style.css';

export default function Tours() {
  const [cart, setCart] = useState([]);
  const [selectedTour, setSelectedTour] = useState('');
  const [tourPrice, setTourPrice] = useState('');
  const [currency, setCurrency] = useState('TRY');

  // Bugünün tarihini YYYY-MM-DD formatında alalım
  const today = new Date().toISOString().split('T')[0];

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phoneCode: '+44',
    phone: '',
    pickupArea: '',
    pickupRegion: '',
    pickupHotel: '',
    pickupDate: today,
    pickupTime: {
      hour: '',
      minute: ''
    },
    pax: {
      adult: 0,
      child: 0,
      free: 0
    }
  });

  // Para birimleri ve sembolleri
  const currencies = {
    TRY: '₺',
    USD: '$',
    EUR: '€',
    GBP: '£'
  };

  // Örnek tur listesi (API'den gelecek)
  const availableTours = [
    { id: 1, name: 'Günlük Şehir Turu' },
    { id: 2, name: 'Kapadokya Turu' },
    { id: 3, name: 'Pamukkale Turu' }
  ];

  // Alan kodları listesi
  const countryCodes = [
    { code: '+44', country: 'İngiltere' },
    { code: '+90', country: 'Türkiye' },
    { code: '+49', country: 'Almanya' },
    { code: '+31', country: 'Hollanda' },
    { code: '+7', country: 'Rusya' },
    { code: '+380', country: 'Ukrayna' },
    { code: '+48', country: 'Polonya' },
    { code: '+33', country: 'Fransa' },
    { code: '+39', country: 'İtalya' },
    { code: '+34', country: 'İspanya' }
  ];

  // Tamamlanan rezervasyonlar için yeni state
  const [completedReservations, setCompletedReservations] = useState([]);
  // Düzenleme modu için state
  const [editingReservation, setEditingReservation] = useState(null);

  // Tarihi Türkçe formatına çeviren fonksiyon
  const formatDate = (dateString) => {
    const options = { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  // Saat formatı için yardımcı fonksiyon
  const formatTime = (time) => {
    return `${time.hour}:${time.minute}`;
  };

  const handleAddToCart = () => {
    if (!selectedTour || !customerInfo.name || !customerInfo.phone || !tourPrice) {
      alert('Lütfen gerekli alanları doldurunuz');
      return;
    }

    const tour = availableTours.find(t => t.id === parseInt(selectedTour));
    const cartItem = {
      ...customerInfo,
      tourId: selectedTour,
      tourName: tour.name,
      tourPrice: parseFloat(tourPrice),
      currency: currency,
      currencySymbol: currencies[currency],
      totalPrice: calculateTotalPrice(parseFloat(tourPrice))
    };

    setCart([...cart, cartItem]);
    resetForm();
  };

  const calculateTotalPrice = (basePrice) => {
    return (basePrice * customerInfo.pax.adult) + 
           (basePrice * 0.5 * customerInfo.pax.child);
  };

  const resetForm = () => {
    setSelectedTour('');
    setTourPrice('');
    setCurrency('TRY');
    setCustomerInfo({
      name: '',
      phoneCode: '+44',
      phone: '',
      pickupArea: '',
      pickupRegion: '',
      pickupHotel: '',
      pickupDate: today,
      pickupTime: {
        hour: '',
        minute: ''
      },
      pax: { adult: 0, child: 0, free: 0 }
    });
  };

  const handlePaxChange = (type, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      pax: {
        ...prev.pax,
        [type]: parseInt(value) || 0
      }
    }));
  };

  const handleRemoveFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  // Rezervasyonu tamamlama fonksiyonu
  const handleCompleteReservation = () => {
    // Sepetteki tüm öğeleri tamamlanan rezervasyonlara ekle
    setCompletedReservations([...completedReservations, ...cart]);
    // Sepeti temizle
    setCart([]);
  };

  // Sepetteki öğeyi düzenleme fonksiyonu
  const handleEditCartItem = (item, index) => {
    setEditingReservation({ ...item, cartIndex: index }); // cartIndex ekledik
    // Form alanlarını doldur
    setSelectedTour(item.tourId);
    setTourPrice(item.tourPrice.toString());
    setCurrency(item.currency);
    setCustomerInfo({
      name: item.name,
      phoneCode: item.phoneCode,
      phone: item.phone,
      pickupArea: item.pickupArea,
      pickupRegion: item.pickupRegion,
      pickupHotel: item.pickupHotel,
      pickupDate: item.pickupDate,
      pickupTime: item.pickupTime,
      pax: { ...item.pax }
    });
    // Sayfanın üstüne kaydır
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Düzenlemeyi kaydetme fonksiyonunu güncelleyelim
  const handleUpdateReservation = () => {
    if (!editingReservation) return;

    const tour = availableTours.find(t => t.id === parseInt(selectedTour));
    const updatedItem = {
      ...customerInfo,
      tourId: selectedTour,
      tourName: tour.name,
      tourPrice: parseFloat(tourPrice),
      currency: currency,
      currencySymbol: currencies[currency],
      totalPrice: calculateTotalPrice(parseFloat(tourPrice))
    };

    if ('cartIndex' in editingReservation) {
      // Sepetteki öğeyi güncelle
      const updatedCart = [...cart];
      updatedCart[editingReservation.cartIndex] = updatedItem;
      setCart(updatedCart);
    } else {
      // Tamamlanan rezervasyonları güncelle
      const updatedReservations = [...completedReservations];
      updatedReservations[editingReservation.index] = updatedItem;
      setCompletedReservations(updatedReservations);
    }

    setEditingReservation(null);
    resetForm();
  };

  // Rezervasyon silme fonksiyonu
  const handleDeleteReservation = (index) => {
    if (window.confirm('Bu rezervasyonu silmek istediğinize emin misiniz?')) {
      const updatedReservations = completedReservations.filter((_, i) => i !== index);
      setCompletedReservations(updatedReservations);
    }
  };

  // Rezervasyonları gönderme fonksiyonu
  const handleSendReservations = () => {
    if (completedReservations.length === 0) {
      alert('Gönderilecek rezervasyon bulunmamaktadır.');
      return;
    }

    // Burada API'ye gönderme işlemi yapılacak
    alert('Rezervasyonlar başarıyla gönderildi!');
    // Başarılı gönderimden sonra listeyi temizle
    setCompletedReservations([]);
  };

  // Saat seçenekleri için yardımcı fonksiyon
  const generateHourOptions = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(i.toString().padStart(2, '0'));
    }
    return hours;
  };

  // Dakika seçenekleri için yardımcı fonksiyon
  const generateMinuteOptions = () => {
    const minutes = [];
    for (let i = 0; i < 60; i++) {
      minutes.push(i.toString().padStart(2, '0'));
    }
    return minutes;
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Sol taraf - Form */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Yeni Rezervasyon</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {/* Tur Seçimi */}
                <div className="col-md-8">
                  <label className="form-label">Tur Seçimi</label>
                  <select 
                    className="form-select"
                    value={selectedTour}
                    onChange={(e) => setSelectedTour(e.target.value)}
                  >
                    <option value="">Tur Seçiniz</option>
                    {availableTours.map(tour => (
                      <option key={tour.id} value={tour.id}>
                        {tour.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fiyat ve Para Birimi Input'ları */}
                <div className="col-md-4">
                  <label className="form-label">Fiyat</label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      value={tourPrice}
                      onChange={(e) => setTourPrice(e.target.value)}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                    <select 
                      className="form-select" 
                      style={{ maxWidth: '80px' }}
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      <option value="TRY">₺</option>
                      <option value="USD">$</option>
                      <option value="EUR">€</option>
                      <option value="GBP">£</option>
                    </select>
                  </div>
                </div>

                {/* Müşteri Bilgileri */}
                <div className="col-md-4">
                  <label className="form-label">Müşteri Adı Soyadı</label>
                  <input
                    type="text"
                    className="form-control"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Telefon</label>
                  <div className="input-group">
                    <select
                      className="form-select"
                      style={{ maxWidth: '140px' }}
                      value={customerInfo.phoneCode}
                      onChange={(e) => setCustomerInfo({
                        ...customerInfo,
                        phoneCode: e.target.value
                      })}
                    >
                      {countryCodes.map((country, index) => (
                        <option key={index} value={country.code}>
                          {country.code} {country.country}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      className="form-control"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({
                        ...customerInfo,
                        phone: e.target.value
                      })}
                      placeholder="5XX XXX XX XX"
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Otel</label>
                  <input
                    type="text"
                    className="form-control"
                    value={customerInfo.pickupHotel}
                    onChange={(e) => setCustomerInfo({...customerInfo, pickupHotel: e.target.value})}
                    placeholder="Otel adı"
                  />
                </div>

                {/* Alınış Bilgileri */}
                <div className="col-md-6">
                  <label className="form-label">Alınış Bölge</label>
                  <input
                    type="text"
                    className="form-control"
                    value={customerInfo.pickupRegion}
                    onChange={(e) => setCustomerInfo({...customerInfo, pickupRegion: e.target.value})}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Alınış Alan</label>
                  <input
                    type="text"
                    className="form-control"
                    value={customerInfo.pickupArea}
                    onChange={(e) => setCustomerInfo({...customerInfo, pickupArea: e.target.value})}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Alınış Tarihi</label>
                  <input
                    type="date"
                    className="form-control"
                    value={customerInfo.pickupDate}
                    onChange={(e) => setCustomerInfo({...customerInfo, pickupDate: e.target.value})}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Alınış Saati</label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      value={customerInfo.pickupTime.hour}
                      onChange={(e) => {
                        let value = e.target.value;
                        
                        // Sadece sayısal değer kontrolü
                        if (!isNaN(value)) {
                          // Sayıya çevir
                          value = parseInt(value);
                          
                          // 0-23 arasında sınırlama
                          if (value >= 0 && value <= 23) {
                            // İki haneli formata çevir
                            value = value.toString().padStart(2, '0');
                            setCustomerInfo({
                              ...customerInfo,
                              pickupTime: {
                                ...customerInfo.pickupTime,
                                hour: value
                              }
                            });
                          }
                        }
                      }}
                      min="0"
                      max="23"
                      style={{ maxWidth: '80px' }}
                      placeholder="00"
                    />
                    <span className="input-group-text">:</span>
                    <input
                      type="number"
                      className="form-control"
                      value={customerInfo.pickupTime.minute}
                      onChange={(e) => {
                        let value = e.target.value;
                        
                        // Sadece sayısal değer kontrolü
                        if (!isNaN(value)) {
                          // Sayıya çevir
                          value = parseInt(value);
                          
                          // 0-59 arasında sınırlama
                          if (value >= 0 && value <= 59) {
                            // İki haneli formata çevir
                            value = value.toString().padStart(2, '0');
                            setCustomerInfo({
                              ...customerInfo,
                              pickupTime: {
                                ...customerInfo.pickupTime,
                                minute: value
                              }
                            });
                          }
                        }
                      }}
                      min="0"
                      max="59"
                      style={{ maxWidth: '80px' }}
                      placeholder="00"
                    />
                  </div>
                </div>

                {/* Pax Bilgileri */}
                <div className="col-md-4">
                  <label className="form-label">Yetişkin</label>
                  <input
                    type="number"
                    className="form-control"
                    value={customerInfo.pax.adult}
                    onChange={(e) => handlePaxChange('adult', e.target.value)}
                    min="0"
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Çocuk</label>
                  <input
                    type="number"
                    className="form-control"
                    value={customerInfo.pax.child}
                    onChange={(e) => handlePaxChange('child', e.target.value)}
                    min="0"
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Ücretsiz</label>
                  <input
                    type="number"
                    className="form-control"
                    value={customerInfo.pax.free}
                    onChange={(e) => handlePaxChange('free', e.target.value)}
                    min="0"
                  />
                </div>

                <div className="col-12">
                  <button 
                    className="btn btn-primary w-100"
                    onClick={editingReservation ? handleUpdateReservation : handleAddToCart}
                  >
                    {editingReservation ? 'Rezervasyonu Güncelle' : 'Sepete Ekle'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sağ taraf - Sepet */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Sepet ({cart.length})</h5>
            </div>
            <div className="card-body">
              {cart.length === 0 ? (
                <p className="text-muted">Sepetiniz boş</p>
              ) : (
                cart.map((item, index) => (
                  <div key={index} className="card mb-2">
                    <div className="card-body">
                      <h6>{item.tourName}</h6>
                      <p className="mb-1">
                        {item.name} - {item.phoneCode} {item.phone}
                      </p>
                      <p className="mb-1">
                        Alınış: {item.pickupRegion} - {item.pickupArea}
                        {item.pickupHotel && ` - ${item.pickupHotel}`}
                      </p>
                      <p className="mb-1">
                        Alınış Tarihi: {formatDate(item.pickupDate)} {formatTime(item.pickupTime)}
                      </p>
                      <p className="mb-1">
                        Pax: {item.pax.adult} yetişkin, {item.pax.child} çocuk, {item.pax.free} ücretsiz
                      </p>
                      <p className="mb-1">
                        Birim Fiyat: {item.tourPrice} {item.currencySymbol}
                      </p>
                      <p className="mb-1">
                        Toplam: {item.totalPrice} {item.currencySymbol}
                      </p>
                      <div className="btn-group">
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => handleEditCartItem(item, index)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleRemoveFromCart(index)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
              {cart.length > 0 && (
                <button 
                  className="btn btn-success w-100 mt-3"
                  onClick={handleCompleteReservation}
                >
                  Rezervasyonu Tamamla
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tamamlanan Rezervasyonlar Tablosu */}
      {completedReservations.length > 0 && (
        <>
          <div className="card mt-4">
            <div className="card-header">
              <h5 className="mb-0">Tamamlanan Rezervasyonlar</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Tur</th>
                      <th>Müşteri</th>
                      <th>İletişim</th>
                      <th>Alınış Bilgileri</th>
                      <th>Pax</th>
                      <th>Fiyat</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedReservations.map((reservation, index) => (
                      <tr key={index}>
                        <td>{reservation.tourName}</td>
                        <td>{reservation.name}</td>
                        <td>
                          {reservation.phoneCode} {reservation.phone}
                        </td>
                        <td>
                          <div>{reservation.pickupRegion} - {reservation.pickupArea}</div>
                          {reservation.pickupHotel && <div>Otel: {reservation.pickupHotel}</div>}
                          <div>
                            Tarih: {formatDate(reservation.pickupDate)} {formatTime(reservation.pickupTime)}
                          </div>
                        </td>
                        <td>
                          <div>Yetişkin: {reservation.pax.adult}</div>
                          <div>Çocuk: {reservation.pax.child}</div>
                          <div>Ücretsiz: {reservation.pax.free}</div>
                        </td>
                        <td>
                          <div>Birim: {reservation.tourPrice} {reservation.currencySymbol}</div>
                          <div>Toplam: {reservation.totalPrice} {reservation.currencySymbol}</div>
                        </td>
                        <td>
                          <div className="btn-group">
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleEditCartItem(reservation, index)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteReservation(index)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Rezervasyonları Gönder Butonu */}
          <div className="d-flex justify-content-end mt-3 mb-4">
            <button 
              className="btn btn-primary btn-lg"
              onClick={handleSendReservations}
            >
              <i className="bi bi-send me-2"></i>
              Rezervasyonları Gönder ({completedReservations.length})
            </button>
          </div>
        </>
      )}
    </div>
  );
} 