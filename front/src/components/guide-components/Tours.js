import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/guide-dashboard-style.css';
import { useNavigate } from 'react-router-dom';

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
      adult: '',
      child: '',
      free: ''
    },
    paymentType: 'cash' // Varsayılan olarak cash seçili olsun
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

  // Saklanan sepetler için state ekleyelim
  const [savedCarts, setSavedCarts] = useState(() => {
    const saved = localStorage.getItem('savedCarts');
    return saved ? JSON.parse(saved) : [];
  });

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

  const navigate = useNavigate();

  // Guide verilerini localStorage'dan al
  const guideData = (() => {
    try {
      return JSON.parse(localStorage.getItem('guideData')) || {};
    } catch (error) {
      console.error('Guide data parse error:', error);
      return {};
    }
  })();

  // Region'u güvenli bir şekilde işle
  const safeRegion = (() => {
    const region = guideData.region;
    if (!region) return [];
    if (Array.isArray(region)) return region;
    try {
      const parsed = JSON.parse(region);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      return typeof region === 'string' ? [region] : [];
    }
  })();

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
      totalPrice: parseFloat(tourPrice)
    };

    setCart([...cart, cartItem]);
    resetForm();
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
      pax: { adult: 0, child: 0, free: 0 },
      paymentType: 'cash' // Varsayılan değeri resetleyelim
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

  // Sepeti saklama fonksiyonunu güncelleyelim
  const handleSaveCart = () => {
    if (cart.length === 0) {
      alert('Saklanacak sepet boş!');
      return;
    }

    const cartToSave = {
      id: Date.now(),
      date: new Date().toLocaleDateString('tr-TR'),
      items: [...cart]
    };

    const updatedSavedCarts = [...savedCarts, cartToSave];
    setSavedCarts(updatedSavedCarts);
    localStorage.setItem('savedCarts', JSON.stringify(updatedSavedCarts));
    setCart([]); // mevcut sepeti temizle
    alert('Sepet başarıyla kaydedildi!');
  };

  // Saklanan sepeti silme fonksiyonu
  const handleDeleteSavedCart = (cartId) => {
    if (window.confirm('Bu kaydedilmiş sepeti silmek istediğinize emin misiniz?')) {
      const updatedSavedCarts = savedCarts.filter(cart => cart.id !== cartId);
      setSavedCarts(updatedSavedCarts);
      localStorage.setItem('savedCarts', JSON.stringify(updatedSavedCarts));
    }
  };

  // Saklanan sepeti geri yükleme fonksiyonunu güncelleyelim
  const handleLoadSavedCart = (savedCart) => {
    setCart([...cart, ...savedCart.items]);
    const updatedSavedCarts = savedCarts.filter(cart => cart.id !== savedCart.id);
    setSavedCarts(updatedSavedCarts);
    localStorage.setItem('savedCarts', JSON.stringify(updatedSavedCarts));
    setShowSavedCarts(false);
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
      pax: { ...item.pax },
      paymentType: item.paymentType
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
      totalPrice: parseFloat(tourPrice)
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

  // Modal state'ini ekleyelim
  const [showCart, setShowCart] = useState(false);

  // Saklanan sepetler modalı için state
  const [showSavedCarts, setShowSavedCarts] = useState(false);

  // Tamamlanan rezervasyonları sepete taşıma fonksiyonu ekleyelim
  const handleMoveToCart = (index) => {
    // Seçilen rezervasyonu al
    const reservation = completedReservations[index];
    
    // Sepete ekle
    setCart([...cart, reservation]);
    
    // Tamamlanan rezervasyonlardan kaldır
    const updatedReservations = completedReservations.filter((_, i) => i !== index);
    setCompletedReservations(updatedReservations);
  };

  return (
    <div className="container mt-4">
      {/* Dashboard'a Dönüş Butonu */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button 
          className="btn btn-outline-secondary"
          onClick={() => navigate('/guide-dashboard')}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Dashboard'a Dön
        </button>
      </div>

      <div className="row">
        <div className="col">
          <h2>Turlar</h2>
          <div className="mb-4">
            <h5>Çalışma Bölgeleri:</h5>
            <div className="d-flex flex-wrap gap-2">
              {safeRegion.map((region, index) => (
                <span key={index} className="badge bg-primary">
                  {region}
                </span>
              ))}
            </div>
          </div>
          {/* Diğer tur içeriği buraya gelecek */}
        </div>
      </div>

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
                <div className="col-md-6">
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
                <div className="col-md-6">
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
                <div className="col-md-6">
                  <label className="form-label">Müşteri Adı Soyadı</label>
                  <input
                    type="text"
                    className="form-control"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  />
                </div>

                <div className="col-md-6">
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
                          {country.code} 
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

                <div className="col-md-12">
                  <label className="form-label">Otel</label>
                  <input
                    type="text"
                    className="form-control"
                    value={customerInfo.pickupHotel}
                    onChange={(e) => setCustomerInfo({...customerInfo, pickupHotel: e.target.value})}
                    placeholder="Otel adı"
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

                <div className="col-md-12">
                  <label className="form-label">Ödeme Tipi</label>
                  <div className="btn-group w-100">
                    <button
                      type="button"
                      className={`btn ${customerInfo.paymentType === 'cash' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                      onClick={() => setCustomerInfo(prev => ({ ...prev, paymentType: 'cash' }))}
                    >
                      <i className="bi bi-cash me-2"></i>
                      Nakit
                    </button>
                    <button
                      type="button"
                      className={`btn ${customerInfo.paymentType === 'card' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                      onClick={() => setCustomerInfo(prev => ({ ...prev, paymentType: 'card' }))}
                    >
                      <i className="bi bi-credit-card me-2"></i>
                      Kart
                    </button>
                  </div>
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
          <div className="position-fixed" style={{ right: '20px', top: '20px', zIndex: 1030 }}>
            <div className="dropdown">
              <button 
                className="btn btn-primary rounded-circle p-3 shadow"
                onClick={() => setShowCart(true)}
              >
                <i className="bi bi-cart3 fs-4"></i>
                {cart.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cart.length}
                  </span>
                )}
              </button>
              {savedCarts.length > 0 && (
                <button
                  className="btn btn-secondary rounded-circle p-2 shadow position-absolute"
                  style={{ top: '50px', right: '0' }}
                  onClick={() => setShowSavedCarts(true)}
                >
                  <i className="bi bi-folder fs-5"></i>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                    {savedCarts.length}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sepet Modal */}
      <div 
        className={`modal fade ${showCart ? 'show' : ''}`} 
        style={{ display: showCart ? 'block' : 'none' }}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-scrollable modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">Sepet ({cart.length})</h5>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={() => setShowCart(false)}
              ></button>
            </div>
            <div className="modal-body">
              {cart.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <i className="bi bi-cart3 fs-1"></i>
                  <p className="mt-2">Sepetiniz boş</p>
                </div>
              ) : (
                cart.map((item, index) => (
                  <div key={index} className="card mb-3 border-0 shadow-sm">
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-bold text-primary mb-0">{item.tourName}</h6>
                        <div className="btn-group">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => {
                              handleEditCartItem(item, index);
                              setShowCart(false);
                            }}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleRemoveFromCart(index)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                      
                      <div className="small">
                        <div className="d-flex align-items-center mb-1">
                          <i className="bi bi-person me-2"></i>
                          <span>{item.name}</span>
                        </div>
                        
                        <div className="d-flex align-items-center mb-1">
                          <i className="bi bi-telephone me-2"></i>
                          <span>{item.phoneCode} {item.phone}</span>
                        </div>
                        
                        <div className="d-flex align-items-center mb-1">
                          <i className="bi bi-geo-alt me-2"></i>
                          <span>
                            {item.pickupRegion} - {item.pickupArea}
                            {item.pickupHotel && ` (${item.pickupHotel})`}
                          </span>
                        </div>
                        
                        <div className="d-flex align-items-center mb-1">
                          <i className="bi bi-calendar-event me-2"></i>
                          <span>{formatDate(item.pickupDate)} {formatTime(item.pickupTime)}</span>
                        </div>
                        
                        <div className="d-flex align-items-center mb-2">
                          <i className={`bi bi-${item.paymentType === 'cash' ? 'cash' : 'credit-card'} me-2`}></i>
                          <span>
                            {item.paymentType === 'cash' ? 'Nakit' : 'Kart'} Ödeme
                          </span>
                        </div>
                        
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-people me-2"></i>
                          <span>
                            {item.pax.adult} yetişkin
                            {item.pax.child > 0 && `, ${item.pax.child} çocuk`}
                            {item.pax.free > 0 && `, ${item.pax.free} ücretsiz`}
                          </span>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                          <span className="fw-bold">
                            Toplam: {item.totalPrice} {item.currencySymbol}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="modal-footer">
                <div className="d-flex w-100 justify-content-between align-items-center">
                  <div>
                    <span className="text-muted me-3">Toplam Rezervasyon: {cart.length} adet</span>
                    <button 
                      className="btn btn-info"
                      onClick={handleSaveCart}
                    >
                      <i className="bi bi-save me-2"></i>
                      Sepeti Sakla
                    </button>
                  </div>
                  <button 
                    className="btn btn-success"
                    onClick={() => {
                      handleCompleteReservation();
                      setShowCart(false);
                    }}
                  >
                    <i className="bi bi-check2-circle me-2"></i>
                    Rezervasyonu Tamamla
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Backdrop */}
      {showCart && (
        <div 
          className="modal-backdrop fade show" 
          onClick={() => setShowCart(false)}
        ></div>
      )}

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
                      <th>Ödeme</th>
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
                          <div>Toplam: {reservation.totalPrice} {reservation.currencySymbol}</div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <i className={`bi bi-${reservation.paymentType === 'cash' ? 'cash' : 'credit-card'} me-2`}></i>
                            {reservation.paymentType === 'cash' ? 'Nakit' : 'Kart'}
                          </div>
                        </td>
                        <td>
                          <div className="btn-group">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleMoveToCart(index)}
                              title="Sepete Taşı"
                            >
                              <i className="bi bi-cart-plus"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleEditCartItem(reservation, index)}
                              title="Düzenle"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteReservation(index)}
                              title="Sil"
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

      {/* Saklanan Sepetler Modalı */}
      <div 
        className={`modal fade ${showSavedCarts ? 'show' : ''}`} 
        style={{ 
          display: showSavedCarts ? 'block' : 'none', 
          zIndex: 1090  // z-index değerini daha da yükseltelim
        }}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header bg-secondary text-white">
              <h5 className="modal-title">
                <i className="bi bi-folder me-2"></i>
                Saklanan Sepetler ({savedCarts.length})
              </h5>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={() => setShowSavedCarts(false)}
              ></button>
            </div>
            <div className="modal-body">
              {savedCarts.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <i className="bi bi-folder fs-1"></i>
                  <p className="mt-2">Kaydedilmiş sepet bulunmamaktadır</p>
                </div>
              ) : (
                savedCarts.map((savedCart) => (
                  <div key={savedCart.id} className="card mb-3 border-0 shadow-sm">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0">
                          <i className="bi bi-calendar-event me-2"></i>
                          {savedCart.date}
                        </h6>
                        <span className="badge bg-primary">{savedCart.items.length} Rezervasyon</span>
                      </div>
                      <div className="small mb-2">
                        {/* Sepet içeriğini özet olarak gösterelim */}
                        {savedCart.items.map((item, idx) => (
                          <div key={idx} className="text-muted">
                            • {item.tourName} - {item.name}
                          </div>
                        ))}
                      </div>
                      <div className="btn-group w-100">
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleLoadSavedCart(savedCart)}
                        >
                          <i className="bi bi-arrow-clockwise me-2"></i>
                          Sepete Yükle
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteSavedCart(savedCart.id)}
                        >
                          <i className="bi bi-trash me-2"></i>
                          Sil
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Saklanan Sepetler Modal Backdrop */}
      {showSavedCarts && (
        <div 
          className="modal-backdrop fade show" 
          style={{ 
            zIndex: 1085,
            opacity: '0.5',  // Arka planı biraz daha şeffaf yapalım
            backgroundColor: '#000'
          }}
          onClick={() => setShowSavedCarts(false)}
        ></div>
      )}
    </div>
  );
} 