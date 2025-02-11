import React from 'react';

const RegionFilter = ({ selectedRegions, setSelectedRegions, bolgeler }) => {
  const handleRegionChange = (regionId) => {
    setSelectedRegions(prev => {
      if (prev.includes(regionId)) {
        return prev.filter(id => id !== regionId);
      } else {
        return [...prev, regionId];
      }
    });
  };

  return (
    <div className="d-flex gap-2 align-items-center">
      <span className="text-nowrap">
        <i className="bi bi-geo-alt me-1"></i>
        Bölgeler:
      </span>
      <div className="d-flex gap-1 flex-wrap">
        {bolgeler.map(bolge => (
          <button
            key={bolge.id}
            className={`btn btn-sm ${
              selectedRegions.includes(bolge.id)
                ? 'btn-primary'
                : 'btn-outline-primary'
            }`}
            onClick={() => handleRegionChange(bolge.id)}
          >
            {bolge.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RegionFilter; 