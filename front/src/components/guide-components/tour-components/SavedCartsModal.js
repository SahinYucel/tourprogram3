import React from 'react';

const SavedCartsModal = ({
  show,
  onClose,
  savedCarts,
  onLoadCart,
  onDeleteCart,
  formatDate
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
              <h5 className="modal-title">Saklanan Sepetler ({savedCarts.length})</h5>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              {savedCarts.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <i className="bi bi-folder fs-1"></i>
                  <p className="mt-2">Saklanan sepet bulunmamaktadır</p>
                </div>
              ) : (
                savedCarts.map((savedCart) => (
                  <div key={savedCart.id} className="card mb-3 border-0 shadow-sm">
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="fw-bold text-primary mb-1">
                            <i className="bi bi-calendar3 me-2"></i>
                            {savedCart.date}
                          </h6>
                          <div className="small text-muted">
                            <i className="bi bi-cart3 me-2"></i>
                            {savedCart.items.length} rezervasyon
                          </div>
                        </div>
                        <div className="btn-group">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            title="Sepete Yükle"
                            onClick={() => onLoadCart(savedCart)}
                          >
                            <i className="bi bi-cart-plus"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            title="Sepeti Sil"
                            onClick={() => onDeleteCart(savedCart.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 small">
                        <div className="row">
                          {savedCart.items.map((item, idx) => (
                            <div key={idx} className="col-md-6 mb-2">
                              <div className="p-2 border rounded">
                                <div className="fw-bold text-primary mb-1">{item.tourName}</div>
                                <div className="d-flex align-items-center text-muted mb-1">
                                  <i className="bi bi-person me-2"></i>
                                  {item.name}
                                </div>
                                <div className="d-flex align-items-center text-muted mb-1">
                                  <i className="bi bi-calendar-event me-2"></i>
                                  {formatDate(item.pickupDate)}
                                </div>
                                <div className="d-flex align-items-center text-muted">
                                  <i className="bi bi-currency-dollar me-2"></i>
                                  {item.totalPrice} {item.currencySymbol}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
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

export default SavedCartsModal; 