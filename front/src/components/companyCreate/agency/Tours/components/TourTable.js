import React, { useState } from 'react';
import TourTableHeader from './table/TourTableHeader';
import TourTableRow from './table/TourTableRow';
import TourTableExpandedRow from './table/TourTableExpandedRow';

const TourTable = ({ 
  tours, 
  onEdit, 
  onDelete, 
  onCopy, 
  onStatusChange,
  onPickupTimeStatusChange,
  onDayStatusChange,
  onSaveToDatabase
}) => {
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (index) => {
    setExpandedRows(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (!tours.length) {
    return (
      <div className="alert alert-info">
        <i className="bi bi-info-circle me-2"></i>
        Henüz tur oluşturulmamış.
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table ">
        <thead>
          <tr>
            <th style={{ width: '40px' }}></th>
            <th style={{ width: '80px' }}>Durum</th>
            <th style={{ width: '120px' }}>Öncelik</th>
            <th>Tur Adı</th>
            <th>Operatör</th>
            <th>Bölgeler</th>
            <th style={{ width: '120px' }}>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {tours.map((tour, index) => (
            <React.Fragment key={index}>
              <TourTableRow 
                tour={tour}
                index={index}
                isExpanded={expandedRows[index]}
                onToggle={toggleRow}
                onEdit={onEdit}
                onDelete={onDelete}
                onCopy={onCopy}
                onStatusChange={onStatusChange}
              />
              {expandedRows[index] && (
                <TourTableExpandedRow 
                  tour={tour}
                  tourIndex={index}
                />
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <button 
        className='btn btn-primary btn-block w-100'
        onClick={onSaveToDatabase}
        disabled={!tours.length}
      >
        <i className='bi bi-cloud-upload me-2'></i>
        Veritabanına Kaydet
      </button>
    </div>
  );
};

export default TourTable; 