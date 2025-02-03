import React, { useState } from 'react';
import GuideSettingsModal from '../GuideSettingsModal';

const GuideTableRow = ({ guide, onEdit, onDelete, onSettingsSave }) => {
  const [showSettings, setShowSettings] = useState(false);

  const handleSettingsSave = (settings) => {
    onSettingsSave(guide.id, settings);
    setShowSettings(false);
  };

  return (
    <>
      <tr>
        <td>{guide.code}</td>
        <td>{guide.name}</td>
        <td>{guide.surname}</td>
        <td>{guide.nickname}</td>
        <td>{guide.phone}</td>
        <td>
          {Array.isArray(guide.region) ? 
            guide.region.join(', ') || '-' : 
            guide.region || '-'}
        </td>
        <td>{guide.guideGroup || '-'}</td>
        <td>{guide.commission}%</td>
        <td>{guide.languagesDisplay}</td>
        <td>
          <span className={`badge ${guide.isActive ? 'bg-success' : 'bg-danger'}`}>
            {guide.isActive ? 'Aktif' : 'Pasif'}
          </span>
        </td>
        <td>
          <div className="d-flex gap-2">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onEdit(guide)}
            >
              Düzenle
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(guide.id)}
            >
              Sil
            </button>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => setShowSettings(true)}
              title="Rehber Ayarları"
            >
              <i className="bi bi-gear-fill"></i>
            </button>
          </div>
        </td>
      </tr>

      <GuideSettingsModal 
        show={showSettings}
        onHide={() => setShowSettings(false)}
        guide={guide}
        onSave={handleSettingsSave}
      />
    </>
  );
};

export default GuideTableRow; 