import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/guide-dashboard-style.css';
import { useNavigate } from 'react-router-dom';
import { guideAPI } from '../../services/api';
import ReservationForm from './tour-components/ReservationForm';
import CartModal from './tour-components/CartModal';
import SavedCartsModal from './tour-components/SavedCartsModal';
import CompletedReservations from './tour-components/CompletedReservations';

export default function Tours() {
  const [cart, setCart] = useState([]);
  const [selectedTour, setSelectedTour] = useState('');
  const [tourPrice, setTourPrice] = useState('');
  const [currency, setCurrency] = useState('GBP');

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
    paymentType: 'cash',
    selectedDay: null,
    period: ''
  });

  // Para birimleri ve sembolleri - GBP'yi en başa alalım
  const currencies = {
    GBP: '£',
    EUR: '€',
    USD: '$',
    TRY: '₺'
  };

  // Turlar için loading ve error state'leri ekleyelim
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // availableTours state'ini boş array olarak başlatalım
  const [availableTours, setAvailableTours] = useState([]);

  // Turları çeken useEffect
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await guideAPI.getTours();
        console.log('API response:', response); // Debug için

        // API'den gelen veriyi kontrol et
        if (response?.data?.data) {
          const toursData = response.data.data;
          console.log('Tours data:', toursData); // Debug için
          setAvailableTours(toursData);
        } else {
          console.error('Invalid API response:', response);
          setError('Turlar yüklenirken bir hata oluştu: Geçersiz API yanıtı');
          setAvailableTours([]); // Boş array ile başlat
        }
      } catch (err) {
        console.error('Error fetching tours:', err);
        setError('Turlar yüklenirken bir hata oluştu.');
        setAvailableTours([]); // Hata durumunda boş array
      } finally {
        setIsLoading(false);
      }
    };

    fetchTours();
  }, []);

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

  // Düzenleme modu için state
  const [editingReservation, setEditingReservation] = useState(null);

  // Saklanan sepetler için state ekleyelim
  const [savedCarts, setSavedCarts] = useState(() => {
    try {
      const saved = localStorage.getItem('savedCarts');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading saved carts:', error);
      return [];
    }
  });

  // Saklanan sepetler için useEffect ekleyelim
  useEffect(() => {
    try {
      localStorage.setItem('savedCarts', JSON.stringify(savedCarts));
    } catch (error) {
      console.error('Error saving carts:', error);
    }
  }, [savedCarts]);

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

  // Bölge ve alan seçenekleri için state'ler
  const [regions] = useState([
    'Alanya Merkez',
    'Mahmutlar',
    'Kestel',
    'Oba',
    'Tosmur',
    'Konakli',
    'Avsallar',
    'İncekum',
    'Okurcalar'
  ]);
  
  const [areas] = useState({
    'Alanya Merkez': ['Kleopatra', 'Damlataş', 'Güllerpınarı', 'Çarşı', 'Hacet', 'Kale'],
    'Mahmutlar': ['Barbaros', 'Atatürk', 'Fatih'],
    'Kestel': ['Kestel-1', 'Kestel-2'],
    'Oba': ['Oba-1', 'Oba-2'],
    'Tosmur': ['Tosmur-1', 'Tosmur-2'],
    'Konakli': ['Konakli-1', 'Konakli-2'],
    'Avsallar': ['Avsallar-1', 'Avsallar-2'],
    'İncekum': ['İncekum-1', 'İncekum-2'],
    'Okurcalar': ['Okurcalar-1', 'Okurcalar-2']
  });

  const handleAddToCart = () => {
    if (!selectedTour || !customerInfo.name || !customerInfo.phone || !tourPrice) {
      alert('Lütfen gerekli alanları doldurunuz');
      return;
    }

    const tour = availableTours.find(t => t.id === parseInt(selectedTour));
    console.log('Selected tour:', tour); // Debug için tur verisini görelim

    const cartItem = {
      ...customerInfo,
      tourId: selectedTour,
      tourName: tour.tour_name || tour.name || tour.tourName, // Tüm olası alanları kontrol edelim
      tourPrice: parseFloat(tourPrice),
      currency: currency,
      currencySymbol: currencies[currency],
      totalPrice: parseFloat(tourPrice)
    };

    console.log('Cart item:', cartItem); // Debug için sepet öğesini görelim
    setCart([...cart, cartItem]);
    resetForm();
  };

  const resetForm = () => {
    setSelectedTour('');
    setTourPrice('');
    setCurrency('GBP');
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
      pax: { adult: '', child: '', free: '' },
      paymentType: 'cash',
      selectedDay: null,
      period: ''
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

  // Saklanan sepeti silme fonksiyonunu güncelleyelim
  const handleDeleteSavedCart = (cartId) => {
    if (window.confirm('Bu kaydedilmiş sepeti silmek istediğinize emin misiniz?')) {
      setSavedCarts(prev => prev.filter(cart => cart.id !== cartId));
    }
  };

  // Saklanan sepeti geri yükleme fonksiyonunu güncelleyelim
  const handleLoadSavedCart = (savedCart) => {
    if (window.confirm('Bu sepeti yüklemek istediğinize emin misiniz? Mevcut sepetteki öğeler korunacaktır.')) {
      setCart(prev => [...prev, ...savedCart.items]);
      setSavedCarts(prev => prev.filter(cart => cart.id !== savedCart.id));
      setShowSavedCarts(false); // Modalı kapat
    }
  };

  // Sepeti saklama fonksiyonunu güncelleyelim
  const handleSaveCart = () => {
    if (cart.length === 0) {
      alert('Saklanacak sepet boş!');
      return;
    }

    if (window.confirm('Mevcut sepeti kaydetmek istediğinize emin misiniz?')) {
      const cartToSave = {
        id: Date.now(),
        date: new Date().toLocaleDateString('tr-TR'),
        items: [...cart]
      };

      setSavedCarts(prev => [...prev, cartToSave]);
      setCart([]); // mevcut sepeti temizle
      setShowCart(false); // Sepet modalını kapat
    }
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
      paymentType: item.paymentType,
      selectedDay: null,
      period: ''
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
      tourName: tour.tour_name,
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

  // Update completedReservations state to use localStorage
  const [completedReservations, setCompletedReservations] = useState(() => {
    try {
      const saved = localStorage.getItem('completedReservations');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading completed reservations:', error);
      return [];
    }
  });

  // Add useEffect to save completedReservations to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('completedReservations', JSON.stringify(completedReservations));
    } catch (error) {
      console.error('Error saving completed reservations:', error);
    }
  }, [completedReservations]);

  // Update handleCompleteReservation to include payment type
  const handleCompleteReservation = () => {
    if (cart.length === 0) {
      alert('Sepet boş!');
      return;
    }

    // Add timestamp to each reservation
    const reservationsWithTimestamp = cart.map(item => ({
      ...item,
      completedAt: new Date().toISOString()
    }));

    setCompletedReservations(prev => [...prev, ...reservationsWithTimestamp]);
    setCart([]);
    setShowCart(false);
  };

  // Update handleDeleteReservation
  const handleDeleteReservation = (index) => {
    if (window.confirm('Bu rezervasyonu silmek istediğinize emin misiniz?')) {
      setCompletedReservations(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Update handleMoveToCart
  const handleMoveToCart = (index) => {
    const reservation = completedReservations[index];
    setCart(prev => [...prev, reservation]);
    setCompletedReservations(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="container mt-4">
      {/* Dashboard'a Dönüş Butonu */}
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <button 
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navigate('/guide-dashboard')}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Dashboard'a Dön
        </button>
        <div className="d-flex align-items-center">
          <button
            className="btn btn-primary btn-sm position-relative me-2"
            onClick={() => setShowCart(true)}
          >
            <i className="bi bi-cart3 me-2"></i>
            Sepet
            {cart.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cart.length}
              </span>
            )}
          </button>
          <button
            className="btn btn-outline-primary btn-sm position-relative"
            onClick={() => setShowSavedCarts(true)}
          >
            <i className="bi bi-folder me-2"></i>
            Saklanan Sepetler
            {savedCarts.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">
                {savedCarts.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <ReservationForm
        isLoading={isLoading}
        error={error}
        selectedTour={selectedTour}
        availableTours={availableTours || []}
        tourPrice={tourPrice}
        currency={currency}
        customerInfo={customerInfo}
        regions={regions}
        areas={areas}
        countryCodes={countryCodes}
        onTourSelect={(e) => {
          setSelectedTour(e.target.value);
          const selected = availableTours?.find(t => t.id === parseInt(e.target.value));
          if (selected?.default_price) {
            setTourPrice(selected.default_price.toString());
          }
        }}
        onTourPriceChange={(e) => setTourPrice(e.target.value)}
        onCurrencyChange={(e) => setCurrency(e.target.value)}
        onCustomerInfoChange={(updates) => {
          setCustomerInfo(prev => {
            // Eğer değişiklik yoksa state'i güncelleme
            const newState = { ...prev, ...updates };
            if (JSON.stringify(prev) === JSON.stringify(newState)) {
              return prev;
            }
            return newState;
          });
        }}
        onSubmit={handleAddToCart}
        editingReservation={editingReservation}
        onUpdate={handleUpdateReservation}
      />

      <CartModal
        show={showCart}
        onClose={() => setShowCart(false)}
        cart={cart}
        onEditItem={handleEditCartItem}
        onRemoveItem={handleRemoveFromCart}
        onSaveCart={handleSaveCart}
        onCompleteReservation={handleCompleteReservation}
        formatDate={formatDate}
        formatTime={formatTime}
      />

      <SavedCartsModal
        show={showSavedCarts}
        onClose={() => setShowSavedCarts(false)}
        savedCarts={savedCarts}
        onLoadCart={handleLoadSavedCart}
        onDeleteCart={handleDeleteSavedCart}
        formatDate={formatDate}
      />

      {/* Add CompletedReservations component before closing div */}
      <CompletedReservations
        completedReservations={completedReservations}
        onMoveToCart={handleMoveToCart}
        onEdit={handleEditCartItem}
        onDelete={handleDeleteReservation}
        formatDate={formatDate}
        formatTime={formatTime}
      />
    </div>
  );
} 