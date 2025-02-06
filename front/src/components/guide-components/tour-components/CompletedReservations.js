import React from 'react';

const CompletedReservations = ({
  completedReservations,
  onMoveToCart,
  onEdit,
  onDelete,
  formatDate,
  formatTime
}) => {
  if (completedReservations.length === 0) {
    return null;
  }

  return (
    <div className="mt-5">
      <h3>Tamamlanan Rezervasyonlar</h3>
      <div className="table-responsive">
        <table className="table table-striped table-hover shadow-sm">
          <thead className="table-light">
            <tr>
              <th>Tur</th>
              <th>Müşteri</th>
              <th>İletişim</th>
              <th>Transfer</th>
              <th>Kişi Sayısı</th>
              <th>Fiyat</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {completedReservations.map((reservation, index) => (
              <tr key={index}>
                <td className="fw-semibold">{reservation.tourName}</td>
                <td>{reservation.name}</td>
                <td>
                  <span className="text-secondary">
                    {reservation.phoneCode} {reservation.phone}
                  </span>
                </td>
                <td>
                  <div className="fw-semibold">{reservation.pickupRegion} - {reservation.pickupArea}</div>
                  <div className="text-secondary">{reservation.pickupHotel}</div>
                  <div className="text-primary small">
                    {formatDate(reservation.pickupDate)} 
                    <span className="ms-2 badge bg-light text-dark">
                      {formatTime(reservation.pickupTime)}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="small">
                    <span className="fw-bold">Yetişkin:</span> {reservation.pax.adult || 0}
                  </div>
                  <div className="small">
                    <span className="fw-bold">Çocuk:</span> {reservation.pax.child || 0}
                  </div>
                  <div className="small">
                    <span className="fw-bold">Ücretsiz:</span> {reservation.pax.free || 0}
                  </div>
                </td>
                <td className="fw-bold text-success">
                  {reservation.tourPrice} {reservation.currencySymbol}
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => onMoveToCart(index)}
                      title="Sepete Ekle"
                      data-bs-toggle="tooltip"
                    >
                      <i className="bi bi-cart-plus"></i>
                    </button>
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => onDelete(index)}
                      title="Rezervasyonu Sil"
                      data-bs-toggle="tooltip"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompletedReservations; 