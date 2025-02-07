import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { guideLogin } from '../../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/guide-dashboard-style.css';

export default function GuideLogin() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await guideLogin({
        name,
        password
      });

      if (response.success) {
        localStorage.setItem('guideData', JSON.stringify(response.data));
        navigate('/guide-dashboard');
      } else {
        setError(response.message || 'Giriş başarısız');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Giriş yapılırken bir hata oluştu');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">Rehber Girişi</h2>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Kullanıcı Adı</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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