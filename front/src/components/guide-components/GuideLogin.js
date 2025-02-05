import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/guide-dashboard-style.css';

export default function GuideLogin() {
  const [name, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Sending login request with:', { name, password });
      
      const response = await axios.post('http://localhost:5000/guide-login', {
        name,
        password
      });

      console.log('Login response:', response.data);

      if (response.data.token) {
        // Token'ı localStorage'a kaydet
        localStorage.setItem('guideToken', response.data.token);
        
        // Guide verilerini localStorage'a kaydet
        const guideData = response.data.guide || response.data.data || {};
        localStorage.setItem('guideData', JSON.stringify(guideData));
        
        // Başarılı login sonrası guide-dashboard'a yönlendir
        navigate('/guide-dashboard');
      } else {
        alert('Giriş başarısız!');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.response?.data?.message || 'Giriş yapılırken bir hata oluştu');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">Rehber Girişi</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Kullanıcı Adı</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">Şifre</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Giriş Yap
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 