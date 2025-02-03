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

  return (
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
  );
};

export default TourTableRow; 