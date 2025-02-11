import React from 'react';

const TIME_PERIODS = [
  { value: '1', label: '1. PERIYOT' },
  { value: '2', label: '2. PERIYOT' },
  { value: '3', label: '3. PERIYOT' },
  { value: '4', label: '4. PERIYOT' },
  { value: '5', label: '5. PERIYOT' },
  { value: '6', label: '6. PERIYOT' },
  { value: '7', label: '7. PERIYOT' },
  { value: '8', label: '8. PERIYOT' },
  { value: '9', label: '9. PERIYOT' },
  { value: '10', label: '10. PERIYOT' }
];

const WEEKDAYS = {
  1: 'Pazartesi',
  2: 'Salı',
  3: 'Çarşamba',
  4: 'Perşembe',
  5: 'Cuma',
  6: 'Cumartesi',
  7: 'Pazar'
};

const TourTableExpandedRow = ({ tour, tourIndex }) => {
  // Kalkış zamanlarını area'ya göre gruplama ve tekrarları engelleme
  const groupedPickupTimes = tour.relatedData?.pickupTimes?.reduce((acc, time) => {
    const area = time.area || 'Diğer';
    if (!acc[area]) {
      acc[area] = [];
    }
    
    // Aynı area, saat ve periyotta başka kayıt var mı kontrol et
    const isDuplicate = acc[area].some(existingTime => 
      existingTime.hour === time.hour &&
      existingTime.minute === time.minute &&
      existingTime.period === time.period &&
      existingTime.region === time.region
    );
    
    // Eğer aynı kayıt yoksa ekle
    if (!isDuplicate) {
      acc[area].push(time);
    }
    
    return acc;
  }, {});

  // Her area grubu içindeki zamanları sırala
  Object.keys(groupedPickupTimes || {}).forEach(area => {
    groupedPickupTimes[area].sort((a, b) => {
      // Önce saate göre sırala
      const aTime = parseInt(a.hour) * 60 + parseInt(a.minute);
      const bTime = parseInt(b.hour) * 60 + parseInt(b.minute);
      if (aTime !== bTime) return aTime - bTime;
      
      // Saat aynıysa periyoda göre sırala
      return parseInt(a.period) - parseInt(b.period);
    });
  });

  return (
    <tr>
      <td colSpan="12s">
        <div className="p-3">
    

          {/* Tur Günleri */}
          <div className="mb-4">
            <h6 className="mb-3">
              <i className="bi bi-calendar-week me-2"></i>
              Tur Günleri
            </h6>
            <div className="d-flex flex-wrap gap-2">
              {Object.entries(WEEKDAYS).map(([id, name]) => {
                const isSelected = tour.relatedData?.days?.includes(Number(id));
                return (
                  <span
                    key={id}
                    className={`badge ${isSelected ? 'bg-success' : 'bg-secondary'}`}
                    style={{ fontSize: '0.9em', padding: '8px 12px' }}
                  >
                    {name}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Kalkış Zamanları */}
          <div className="mb-4">
            <h6 className="mb-3">
              <i className="bi bi-clock me-2"></i>
              Kalkış Zamanları
            </h6>
            {Object.entries(groupedPickupTimes || {}).map(([area, times], areaIndex) => (
              <div key={areaIndex} className="mb-3">
                <div className="table-responsive">
                  <table className="table table-sm align-middle">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: '100px', textAlign: 'center' }}>Durum</th>
                        <th style={{ width: '100px', textAlign: 'center' }}>Saat</th>
                        <th>Bölge / Alan</th>
                        <th style={{ width: '150px', textAlign: 'center' }}>Periyot</th>
                      </tr>
                    </thead>
                    <tbody>
                      {times.map((time, timeIndex) => (
                        <tr key={timeIndex}>
                          <td className="text-center">
                            <span className={`badge ${time.isActive ? 'bg-success' : 'bg-secondary'}`}
                                  style={{ minWidth: '80px' }}>
                              {time.isActive ? 'Aktif' : 'Pasif'}
                            </span>
                          </td>
                          <td className="text-center fw-medium">
                            {`${time.hour.padStart(2, '0')}:${time.minute.padStart(2, '0')}`}
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <span className="fw-medium">{time.region}</span>
                              {time.area && (
                                <>
                                  <i className="bi bi-chevron-right mx-2 text-muted"></i>
                                  <span className="text-muted">{time.area}</span>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-light text-dark"
                                  style={{ minWidth: '120px', fontSize: '0.9em' }}>
                              {TIME_PERIODS.find(p => p.value === time.period)?.label || time.period}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {/* Opsiyonlar */}
          {tour.relatedData?.options?.length > 0 && (
            <div>
              <h6 className="mb-3">
                <i className="bi bi-list-check me-2"></i>
                Opsiyonlar
              </h6>
              <div className="table-responsive">
                <table className="table table-sm table-striped">
                  <thead>
                    <tr>
                      <th>Opsiyon</th>
                      <th>Fiyat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tour.relatedData.options.map((option, optIndex) => (
                      <tr key={optIndex}>
                        <td>{option.name || option.option_name}</td>
                        <td>{option.price} €</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default TourTableExpandedRow; 