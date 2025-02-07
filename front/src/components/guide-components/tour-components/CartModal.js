import React from 'react';

const CartModal = ({
  show,
  onClose,
  cart,
  onEditItem,
  onRemoveItem,
  onSaveCart,
  onCompleteReservation,
  formatDate,
  formatTime
}) => {

  // Düzenleme işlemi için yeni fonksiyon
  const handleEdit = (item, index) => {
    onEditItem(item, index);
    onClose(); // Modalı kapat
  };

  return (
    <>
      <div 
        className={`modal fade ${show ? 'show' : ''}`} 
        style={{ display: show ? 'block' : 'none' }}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-scrollable modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">Sepet ({cart.length})</h5>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              {cart.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <i className="bi bi-cart3 fs-1"></i>
                  <p className="mt-2">Sepetiniz boş</p>
                </div>
              ) : (
                <div className="table-responsive">
                  {cart.map((item, index) => (
                    <div key={index} className="card mb-3">
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="card-title mb-0">
                            {index + 1}. {item.tourName}
                          </h6>
                          <span className="badge bg-primary">
                            {item.tourPrice} {item.currencySymbol}
                          </span>
                        </div>
                        
                        <div className="row g-2">
                          <div className="col-12 col-sm-6">
                            <small className="text-muted d-block">Müşteri:</small>
                            <div>{item.name}</div>
                            <div className="small text-muted">
                              {item.phoneCode} {item.phone}
                            </div>
                          </div>
                          
                          <div className="col-12 col-sm-6">
                            <small className="text-muted d-block">Transfer:</small>
                            <div>{item.pickupRegion} - {item.pickupArea}</div>
                            {item.pickupHotel && (
                              <div className="small text-muted">{item.pickupHotel}</div>
                            )}
                          </div>
                          
                          <div className="col-12 col-sm-6">
                            <small className="text-muted d-block">Tarih/Saat:</small>
                            <div>{formatDate(item.pickupDate)}</div>
                            <div className="small text-muted">
                              {formatTime(item.pickupTime)}
                            </div>
                          </div>
                          
                          <div className="col-12 col-sm-6">
                            <small className="text-muted d-block">Kişi Sayısı:</small>
                            <div>
                              Yetişkin: {item.pax.adult || 0}
                              {item.pax.child > 0 && `, Çocuk: ${item.pax.child}`}
                              {item.pax.free > 0 && `, Ücretsiz: ${item.pax.free}`}
                            </div>
                            <div className="small text-muted">
                              {item.paymentType === 'cash' ? 'Nakit' : 'Kart'}
                            </div>
                          </div>
                        </div>

                        <div className="d-flex justify-content-end gap-2 mt-3">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(item, index)}
                          >
                            <i className="bi bi-pencil me-1"></i>
                            Düzenle
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => onRemoveItem(index)}
                          >
                            <i className="bi bi-trash me-1"></i>
                            Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="modal-footer">
                <div className="d-flex w-100 flex-column flex-sm-row justify-content-between align-items-center gap-2">
                  <div className="d-flex flex-column flex-sm-row align-items-center gap-2">
                    <span className="text-muted">Toplam: {cart.length}</span>
                    <button 
                      className="btn btn-info"
                      onClick={onSaveCart}
                    >
                      <i className="bi bi-save me-2"></i>
                      Sepeti Sakla
                    </button>
                  </div>
                  <button 
                    className="btn btn-success w-100 w-sm-auto"
                    onClick={() => {
                      onCompleteReservation();
                      onClose();
                    }}
                  >
                    <i className="bi bi-check2-circle me-2"></i>
                    Rezervasyonu Tamamla
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {show && (
        <div 
          className="modal-backdrop fade show" 
          onClick={onClose}
        ></div>
      )}
    </>
  );
};

export default CartModal; 