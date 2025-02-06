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
                cart.map((item, index) => (
                  <div key={index} className="card mb-3 border-0 shadow-sm">
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-bold text-primary mb-0">{item.tourName}</h6>
                        <div className="btn-group">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => {
                              onEditItem(item, index);
                              onClose();
                            }}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => onRemoveItem(index)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                      
                      <div className="small">
                        <div className="d-flex align-items-center mb-1">
                          <i className="bi bi-person me-2"></i>
                          <span>{item.name}</span>
                        </div>
                        
                        <div className="d-flex align-items-center mb-1">
                          <i className="bi bi-telephone me-2"></i>
                          <span>{item.phoneCode} {item.phone}</span>
                        </div>
                        
                        <div className="d-flex align-items-center mb-1">
                          <i className="bi bi-geo-alt me-2"></i>
                          <span>
                            {item.pickupRegion} - {item.pickupArea}
                            {item.pickupHotel && ` (${item.pickupHotel})`}
                          </span>
                        </div>
                        
                        <div className="d-flex align-items-center mb-1">
                          <i className="bi bi-calendar-event me-2"></i>
                          <span>{formatDate(item.pickupDate)} {formatTime(item.pickupTime)}</span>
                        </div>
                        
                        <div className="d-flex align-items-center mb-2">
                          <i className={`bi bi-${item.paymentType === 'cash' ? 'cash' : 'credit-card'} me-2`}></i>
                          <span>
                            {item.paymentType === 'cash' ? 'Nakit' : 'Kart'} Ödeme
                          </span>
                        </div>
                        
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-people me-2"></i>
                          <span>
                            {item.pax.adult} yetişkin
                            {item.pax.child > 0 && `, ${item.pax.child} çocuk`}
                            {item.pax.free > 0 && `, ${item.pax.free} ücretsiz`}
                          </span>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                          <span className="fw-bold">
                            Toplam: {item.totalPrice} {item.currencySymbol}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="modal-footer">
                <div className="d-flex w-100 justify-content-between align-items-center">
                  <div>
                    <span className="text-muted me-3">Toplam Rezervasyon: {cart.length} adet</span>
                    <button 
                      className="btn btn-info"
                      onClick={onSaveCart}
                    >
                      <i className="bi bi-save me-2"></i>
                      Sepeti Sakla
                    </button>
                  </div>
                  <button 
                    className="btn btn-success"
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