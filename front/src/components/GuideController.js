import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './guide-components/styles/guide-dashboard-style.css';
import { useNavigate } from 'react-router-dom';

export default function GuideController() {
  const navigate = useNavigate();
  const username = localStorage.getItem('guideUsername');

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
    // LocalStorage'dan token ve kullanıcı bilgilerini temizle
    localStorage.removeItem('guideToken');
    localStorage.removeItem('guideUsername');
    // Login sayfasına yönlendir
    navigate('/guide-login');
  };

  return (
    <div className="container mt-5">
      {/* Header kısmı */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h1>Rehber Paneli</h1>
        <div className="d-flex align-items-center">
          <span className="me-3">
            <i className="bi bi-person-circle me-2"></i>
            {username}
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