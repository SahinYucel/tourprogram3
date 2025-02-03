import React, { useState } from 'react';
import GuideTableRow from './GuideTableRow';
import GuideSettingsModal from '../GuideSettingsModal';

const GuideTable = ({ guides, onEdit, onDelete, onSettingsSave }) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);

  const handleSettingsClick = (guide) => {
    setSelectedGuide(guide);
    setShowSettingsModal(true);
  };

  const handleSettingsSave = (settings) => {
    if (selectedGuide) {
      onSettingsSave(selectedGuide.id, settings);
    }
    setShowSettingsModal(false);
    setSelectedGuide(null);
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Kod</th>
            <th>İsim</th>
            <th>Soyisim</th>
            <th>Bölge</th>
            <th>Grup</th>
            <th>Telefon</th>
            <th>Diller</th>
            <th>Durum</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {guides.map((guide) => (
            <GuideTableRow
              key={guide.id}
              guide={guide}
              onEdit={onEdit}
              onDelete={onDelete}
              onSettingsClick={handleSettingsClick}
            />
          ))}
        </tbody>
      </table>

      {selectedGuide && (
        <GuideSettingsModal
          show={showSettingsModal}
          onHide={() => setShowSettingsModal(false)}
          onSave={handleSettingsSave}
          guide={{
            ...selectedGuide,
            earnings: selectedGuide.earnings || 0,
            promotionRate: selectedGuide.promotionRate || 0,
            revenue: selectedGuide.revenue || 0,
            pax: {
              adult: selectedGuide.pax?.adult || 0,
              child: selectedGuide.pax?.child || 0,
              free: selectedGuide.pax?.free || 0
            }
          }}
        />
      )}
    </div>
  );
};

export default GuideTable; 