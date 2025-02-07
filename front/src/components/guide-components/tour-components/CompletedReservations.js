import React, { useState } from 'react';

const CompletedReservations = ({
  completedReservations,
  onMoveToCart,
  onEdit,
  onDelete,
  formatDate,
  formatTime
}) => {
  const [printer, setPrinter] = useState(null);

  // Bluetooth yazıcıya bağlan
  const connectPrinter = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: ['000018f0-0000-1000-8000-00805f9b34fb'] }  // Yazıcı servis UUID'si
        ]
      });

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
      const characteristic = await service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb');
      
      setPrinter({ device, characteristic });
      alert('Yazıcı bağlandı!');
    } catch (error) {
      console.error('Yazıcı bağlantı hatası:', error);
      alert('Yazıcı bağlanamadı: ' + error.message);
    }
  };

  // Bluetooth yazıcıya yazdır
  const printToBluetooth = async (data) => {
    if (!printer) {
      alert('Lütfen önce yazıcıyı bağlayın');
      return;
    }

    try {
      // 58mm yazıcı için karakter sınırı yaklaşık 32 karakterdir
      const formatLine = (text, maxLength = 32) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
      };

      const formatPrice = (price, symbol) => {
        return `${price} ${symbol}`.padStart(10);
      };

      const divider = '-'.repeat(32) + '\n';

      // ESC/POS komutları ile yazdırma formatını ayarla
      const commands = [
        '\x1B\x40',      // Initialize printer
        '\x1B\x61\x01',  // Center alignment
        '\x1B\x21\x10',  // Double height text
        'REZERVASYON\n',
        '\x1B\x21\x00',  // Normal text
        divider,
        ...completedReservations.map(res => [
          '\x1B\x61\x00',  // Left alignment
          formatLine(`${res.tourName}\n`),
          divider,
          `Musteri: ${formatLine(res.name)}\n`,
          `Tel: ${res.phoneCode}${res.phone}\n`,
          divider,
          `${formatLine(res.pickupRegion)}\n`,
          `${formatLine(res.pickupArea)}\n`,
          res.pickupHotel ? `${formatLine(res.pickupHotel)}\n` : '',
          divider,
          `Tarih: ${formatDate(res.pickupDate)}\n`,
          `Saat:  ${formatTime(res.pickupTime)}\n`,
          divider,
          `Yetiskin: ${res.pax.adult || 0}\n`,
          res.pax.child > 0 ? `Cocuk:    ${res.pax.child}\n` : '',
          res.pax.free > 0 ? `Ucretsiz: ${res.pax.free}\n` : '',
          divider,
          '\x1B\x61\x02',  // Right alignment
          `${formatPrice(res.tourPrice, res.currencySymbol)}\n`,
          res.paymentType === 'cash' ? 'NAKIT\n' : 'KART\n',
          divider,
          '\n'
        ].join('')),
        '\x1B\x61\x01',  // Center alignment
        formatDate(new Date()) + '\n',
        new Date().toLocaleTimeString() + '\n',
        '\n\n\n\n',      // Feed paper
        '\x1B\x69'       // Cut paper
      ].join('');

      // Veriyi yazıcıya gönder
      const encoder = new TextEncoder();
      await printer.characteristic.writeValue(encoder.encode(commands));
      alert('Yazdırma tamamlandı!');
    } catch (error) {
      console.error('Yazdırma hatası:', error);
      alert('Yazdırma hatası: ' + error.message);
    }
  };

  const handlePrint = async () => {
    if (window.confirm('Bluetooth yazıcı kullanmak ister misiniz?')) {
      if (!printer) {
        await connectPrinter();
      }
      await printToBluetooth();
    } else {
      // Normal tarayıcı yazdırması
      const printContent = document.getElementById('printArea').innerHTML;
      const originalContent = document.body.innerHTML;

      document.body.innerHTML = `
        <div style="padding: 20px;">
          <h2 style="text-align: center; margin-bottom: 20px;">Rezervasyon Listesi</h2>
          ${printContent}
        </div>
      `;

      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  };

  const handleExportToExcel = () => {
    // Excel için veriyi hazırla
    const data = completedReservations.map(res => ({
      'Tur Adı': res.tourName,
      'Müşteri': res.name,
      'Telefon': `${res.phoneCode} ${res.phone}`,
      'Bölge': res.pickupRegion,
      'Alan': res.pickupArea,
      'Otel': res.pickupHotel,
      'Tarih': formatDate(res.pickupDate),
      'Saat': formatTime(res.pickupTime),
      'Yetişkin': res.pax.adult || 0,
      'Çocuk': res.pax.child || 0,
      'Ücretsiz': res.pax.free || 0,
      'Fiyat': `${res.tourPrice} ${res.currencySymbol}`,
      'Ödeme Tipi': res.paymentType === 'cash' ? 'Nakit' : 'Kart'
    }));

    // CSV formatına dönüştür
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    // Dosyayı indir
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `rezervasyonlar_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (completedReservations.length === 0) {
    return null;
  }

  return (
    <div className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Tamamlanan Rezervasyonlar</h3>
        <div className="btn-group">
          <button 
            className="btn btn-outline-primary"
            onClick={handlePrint}
          >
            <i className="bi bi-printer me-2"></i>
            Yazdır
          </button>
          {printer && (
            <button 
              className="btn btn-outline-secondary"
              onClick={() => setPrinter(null)}
            >
              <i className="bi bi-bluetooth-x me-2"></i>
              Yazıcı Bağlantısını Kes
            </button>
          )}
          <button 
            className="btn btn-outline-success"
            onClick={handleExportToExcel}
          >
            <i className="bi bi-file-earmark-excel me-2"></i>
            Excel'e Aktar
          </button>
        </div>
      </div>

      <div id="printArea" className="table-responsive">
        <table className="table table-striped table-hover shadow-sm">
          <thead className="table-light">
            <tr>
              <th>Tur</th>
              <th>Müşteri</th>
              <th>İletişim</th>
              <th>Transfer</th>
              <th>Kişi Sayısı</th>
              <th>Fiyat</th>
              <th className="print-hide">İşlemler</th>
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

      <style>
        {`
          @media print {
            .print-hide {
              display: none !important;
            }
            .btn-group {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default CompletedReservations; 