import React from 'react';
import StatusCell from './StatusCell';
import ActionButtons from './ActionButtons';

const TourTableRow = ({ 
  tour, 
  index, 
  isExpanded, 
  onToggle, 
  onEdit, 
  onDelete, 
  onCopy, 
  onStatusChange 
}) => {
  // Öncelik badge'inin rengini ve metnini belirleyen yardımcı fonksiyon
  const getPriorityBadge = (priority) => {
    const priorityMap = {
      1: { bg: 'danger', text: 'En Yüksek' },
      2: { bg: 'warning', text: 'Yüksek' },
      3: { bg: 'info', text: 'Normal' },
      4: { bg: 'success', text: 'Düşük' },
      5: { bg: 'primary', text: 'En Düşük' },
      0: { bg: 'light text-dark', text: 'Belirsiz' }
    };
    
    const priorityInfo = priorityMap[priority] || priorityMap[0];
    return (
      <span className={`badge bg-${priorityInfo.bg}`}>
        {priorityInfo.text} ({priority})
      </span>
    );
  };

  const formatPrice = (price, currency = 'EUR') => {
    if (!price) return '-';
    return `${price} ${currency}`;
  };

  return (
    <>
      <tr 
        className="tour-header position-relative" 
        style={{ 
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          backgroundColor: isExpanded ? '#f8f9fa' : 'transparent'
        }}
        onMouseEnter={(e) => {
          if (!isExpanded) {
            e.currentTarget.style.backgroundColor = '#f8f9fa';
          }
        }}
        onMouseLeave={(e) => {
          if (!isExpanded) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        <td 
          onClick={() => onToggle(index)}
          style={{
            width: '40px',
            textAlign: 'center'
          }}
        >
          <div 
            className={`d-flex align-items-center justify-content-center rounded-circle ${isExpanded ? 'bg-primary' : 'bg-light'}`}
            style={{
              width: '24px',
              height: '24px',
              transition: 'all 0.2s ease'
            }}
          >
            <i className={`bi bi-${isExpanded ? 'dash' : 'plus'}-lg ${isExpanded ? 'text-white' : 'text-primary'}`}></i>
          </div>
        </td>
        <td>
          <StatusCell 
            isActive={tour.isActive}
            onChange={() => onStatusChange(tour)}
            index={index}
          />
        </td>
        {/* Öncelik sütunu eklendi */}
        <td onClick={() => onToggle(index)} style={{ width: '120px' }}>
          {getPriorityBadge(parseInt(tour.priority) || 0)}
        </td>
        <td onClick={() => onToggle(index)}>
          <span className="fw-medium">{tour.tourName}</span>
        </td>
        <td onClick={() => onToggle(index)}>
          <div className="d-flex flex-column">
            <span>{tour.operator}</span>
            {tour.operatorId && (
              <small className="text-muted">ID: {tour.operatorId}</small>
            )}
          </div>
        </td>
        <td onClick={() => onToggle(index)}>
          <div className="d-flex flex-column">
            {tour.bolgeler && tour.bolgeler.length > 0 ? (
              <span className="badge bg-info text-wrap">
                {tour.bolgeler.join(', ')}
              </span>
            ) : (
              <span className="text-muted">Bölge seçilmemiş</span>
            )}
          </div>
        </td>
        <td>
          <ActionButtons
            onEdit={() => onEdit(tour)}
            onDelete={() => onDelete(tour)}
            onCopy={() => onCopy(tour)}
          />
        </td>
      </tr>
      
      {/* Fiyatlar satırını sadece expanded durumunda göster */}
      {isExpanded && (
        <tr 
          className="price-row"
          style={{ 
            backgroundColor: '#f8f9fa',
            fontSize: '0.9em'
          }}
        >
          <td colSpan="5">
            <div className="d-flex justify-content-start gap-3 m-3">
              <div className="price-card p-2 rounded border" style={{ minWidth: '200px' }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted fw-medium">Normal Fiyatlar</span>
                  <span className="badge bg-light text-dark">{tour.currency}</span>
                </div>
                <div className="d-flex flex-column gap-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">Yetişkin</small>
                    <span className="fw-bold text-success">
                      {tour.adultPrice || '-'}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">Çocuk</small>
                    <span className="fw-bold text-info">
                      {tour.childPrice || '-'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="price-card p-2 rounded border" style={{ minWidth: '200px' }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted fw-medium">Rehberli Fiyatlar</span>
                  <span className="badge bg-light text-dark">{tour.currency}</span>
                </div>
                <div className="d-flex flex-column gap-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">Yetişkin</small>
                    <span className="fw-bold text-warning">
                      {tour.guideAdultPrice || '-'}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">Çocuk</small>
                    <span className="fw-bold text-secondary">
                      {tour.guideChildPrice || '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default TourTableRow; 