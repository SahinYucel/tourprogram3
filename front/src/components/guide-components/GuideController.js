import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/guide-dashboard-style.css';
import { useNavigate } from 'react-router-dom';

export default function GuideController() {
  const navigate = useNavigate();
  
  // Token kontrolü yap ve yoksa login sayfasına yönlendir
  useEffect(() => {
    const token = localStorage.getItem('guideToken');
    if (!token) {
      navigate('/guide-login');
      return;
    }
  }, [navigate]);
  
  // localStorage'dan guide verilerini al ve parse et
  const guideData = (() => {
    try {
      const storedData = localStorage.getItem('guideData');
      
      // Eğer veri yoksa boş obje döndür
      if (!storedData) {
        console.log('No guide data found in localStorage');
        return {};
      }

      const data = JSON.parse(storedData);
      
      // Debug için localStorage verilerini detaylı logla
      console.log('\n=== GUIDE DATA FROM LOCALSTORAGE ===');
      console.log('Token:', localStorage.getItem('guideToken'));
      console.log('Guide Data:', {
        ...data,
        region: Array.isArray(data.region) ? data.region : [],
        settings: data.settings || null
      });
      console.log('Region Type:', Array.isArray(data.region) ? 'Array' : typeof data.region);
      console.log('Region Values:', data.region);
      console.log('Guide Group:', data.guideGroup);
      console.log('Nickname:', data.nickname);
      console.log('Settings:', data.settings);
      console.log('===================================\n');

      return data;
    } catch (error) {
      console.error('Guide data parse error:', error);
      // Hata durumunda login sayfasına yönlendir
      navigate('/guide-login');
      return {};
    }
  })();

  // Rehber bilgilerini al ve varsayılan değerler ata
  const {
    name = '',
    surname = '',
    nickname = '',
    guideGroup = '',
    companyName = ''
  } = guideData;

  const menuItems = [
    {
      title: 'Cüzdan',
      icon: 'bi-wallet2',
      description: 'Kazançlarınızı ve işlem geçmişinizi görüntüleyin',
      path: '/guide-dashboard/wallet',
      color: 'primary'
    },
    {
      title: 'Rezervasyonlar',
      icon: 'bi-calendar-check',
      description: 'Tur rezervasyonlarınızı yönetin',
      path: '/guide-dashboard/reservations',
      color: 'success'
    },
    {
      title: 'Turlar',
      icon: 'bi-compass',
      description: 'Turlarınızı görüntüleyin ve yönetin',
      path: '/guide-dashboard/tours',
      color: 'info'
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('guideToken');
    localStorage.removeItem('guideData'); // guideUsername yerine guideData'yı sil
    navigate('/guide-login');
  };

  return (
    <div className="container mt-5">
      {/* Header kısmı */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1>Rehber Paneli</h1>
          <div className="text-muted">
            <p className="mb-1">
              <i className="bi bi-building me-2"></i>
              {companyName}
            </p>
            <p className="mb-1">
              <i className="bi bi-person-badge me-2"></i>
              {nickname || name} {guideGroup && `- ${guideGroup}`}
            </p>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <span className="me-3">
            <i className="bi bi-person-circle me-2"></i>
            {name} {surname}
          </span>
          <button 
            className="btn btn-outline-danger"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right me-2"></i>
            Çıkış Yap
          </button>
        </div>
      </div>

      {/* Menu kartları */}
      <div className="row justify-content-center">
        {menuItems.map((item, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div 
              className="card h-100 shadow-sm"
              onClick={() => navigate(item.path)}
              style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="card-body text-center">
                <div className={`text-${item.color} mb-3`}>
                  <i className={`${item.icon} fs-1`}></i>
                </div>
                <h3 className="card-title">{item.title}</h3>
                <p className="card-text text-muted">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}