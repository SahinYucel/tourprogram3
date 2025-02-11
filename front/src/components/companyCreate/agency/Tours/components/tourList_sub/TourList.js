import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const TourList = ({
  isCollapsed,
  setIsCollapsed,
  tourName,
  setTourName,
  handleTourSubmit,
  tours,
  handleDelete,
  onUpdate,
  onSubTourSubmit
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editingParentId, setEditingParentId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isEditingSubTour, setIsEditingSubTour] = useState(false);
  const [subTourName, setSubTourName] = useState('');
  const [selectedTourId, setSelectedTourId] = useState(null);

  const handleEdit = (tour, isSubTour = false, parentId = null) => {
    setEditingId(tour.id);
    setEditValue(tour.name);
    setIsEditingSubTour(isSubTour);
    setEditingParentId(parentId);
  };

  const handleSave = (id) => {
    if (!editValue.trim()) return;
    onUpdate(id, editValue.trim().toUpperCase(), isEditingSubTour, editingParentId);
    setEditingId(null);
    setEditValue('');
    setIsEditingSubTour(false);
    setEditingParentId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleSubTourSubmit = (e) => {
    e.preventDefault();
    if (!subTourName.trim() || !selectedTourId) return;
    onSubTourSubmit(selectedTourId, subTourName.trim().toUpperCase());
    setSubTourName('');
  };

  return (
    <div className="card mb-4">
      <div 
        className="card-header" 
        style={{ cursor: 'pointer' }} 
        onClick={() => setIsCollapsed(prev => !prev)}
      >
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Turlar</h4>
          <i className={`bi ${isCollapsed ? 'bi-chevron-down' : 'bi-chevron-up'}`}></i>
        </div>
      </div>
      <div className={`card-body ${isCollapsed ? 'd-none' : ''}`}>
        {/* Ana Tur Form */}
        <form onSubmit={handleTourSubmit} className="mb-3">
          <div className="input-group">
            <input
              type="text"
              className="form-control text-uppercase"
              placeholder="Tur adı giriniz"
              value={tourName}
              onChange={(e) => setTourName(e.target.value.toUpperCase())}
            />
            <button type="submit" className="btn btn-primary">
              <i className="bi bi-plus-lg me-2"></i>Tur Adı Ekle
            </button>
          </div>
        </form>

        {/* Alt Tur Form */}
        <form onSubmit={handleSubTourSubmit} className="mb-4">
          <div className="input-group">
            <select
              className="form-select"
              value={selectedTourId || ''}
              onChange={(e) => setSelectedTourId(Number(e.target.value))}
              style={{ maxWidth: '200px' }}
            >
              <option value="">Tur adı seçiniz</option>
              {tours.map(tour => (
                <option key={tour.id} value={tour.id}>
                  {tour.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="form-control text-uppercase"
              placeholder="Alt tur adı giriniz"
              value={subTourName}
              onChange={(e) => setSubTourName(e.target.value.toUpperCase())}
              disabled={!selectedTourId}
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!selectedTourId}
            >
              <i className="bi bi-plus-lg me-2"></i>Alt Tur Ekle
            </button>
          </div>
        </form>

        {/* Tur Listesi */}
        {tours.length > 0 && (
          <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table className="table table-hover">
              <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">İsim</th>
                  <th scope="col">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {tours.map(tour => (
                  <React.Fragment key={tour.id}>
                    {/* Ana Tur Satırı */}
                    <tr className="table-light">
                      <th scope="row">{tour.id}</th>
                      <td>
                        {editingId === tour.id ? (
                          <input
                            type="text"
                            className="form-control text-uppercase"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value.toUpperCase())}
                          />
                        ) : tour.name}
                      </td>
                      <td>
                        {editingId === tour.id ? (
                          <>
                            <button 
                              className="btn btn-sm btn-success me-2"
                              onClick={() => handleSave(tour.id)}
                            >
                              <i className="bi bi-check-lg"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-secondary"
                              onClick={handleCancel}
                            >
                              <i className="bi bi-x-lg"></i>
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              className="btn btn-sm btn-warning me-2"
                              onClick={() => handleEdit(tour)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(tour.id, 'tur')}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                    {/* Alt Turlar burada listelenecek */}
                    {tour.subTours?.map(subTour => (
                      <tr key={subTour.id} className="table-light">
                        <th scope="row" style={{ paddingLeft: '2rem' }}>└ {subTour.id}</th>
                        <td style={{ paddingLeft: '2rem' }}>
                          {editingId === subTour.id ? (
                            <input
                              type="text"
                              className="form-control text-uppercase"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value.toUpperCase())}
                            />
                          ) : subTour.name}
                        </td>
                        <td>
                          {editingId === subTour.id ? (
                            <>
                              <button 
                                className="btn btn-sm btn-success me-2"
                                onClick={() => handleSave(subTour.id)}
                              >
                                <i className="bi bi-check-lg"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-secondary"
                                onClick={handleCancel}
                              >
                                <i className="bi bi-x-lg"></i>
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                className="btn btn-sm btn-warning me-2"
                                onClick={() => handleEdit(subTour, true, tour.id)}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(subTour.id, 'alt-tur', tour.id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourList;