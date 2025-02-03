import React, { useState } from 'react';

export default function GuideDashboard() {
  const [tourName, setTourName] = useState('');
  const [date, setDate] = useState('');
  const [pax, setPax] = useState({ adult: 0, child: 0, free: 0 });

  const handlePaxChange = (type, value) => {
    setPax(prevPax => ({
      ...prevPax,
      [type]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Reservation Details:', { tourName, date, pax });
  };

    return (
    <div>
      <h1>Guide Dashboard - Reservation</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tour Name:</label>
          <input
            type="text"
            value={tourName}
            onChange={(e) => setTourName(e.target.value)}
            required
          />
          </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Adult Pax:</label>
          <input
            type="number"
            value={pax.adult}
            onChange={(e) => handlePaxChange('adult', parseInt(e.target.value))}
            min="0"
          />
      </div>
        <div>
          <label>Child Pax:</label>
          <input
            type="number"
            value={pax.child}
            onChange={(e) => handlePaxChange('child', parseInt(e.target.value))}
            min="0"
          />
        </div>
        <div>
          <label>Free Pax:</label>
          <input
            type="number"
            value={pax.free}
            onChange={(e) => handlePaxChange('free', parseInt(e.target.value))}
            min="0"
          />
        </div>
        <button type="submit">Submit Reservation</button>
      </form>
    </div>
  );
}