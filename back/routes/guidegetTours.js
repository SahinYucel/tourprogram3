const express = require('express');
const router = express.Router();

// Router factory function oluşturalım
module.exports = (db) => {
  // Tüm turları getir
  router.get('/', async (req, res) => {
    try {
      const query = 'SELECT * FROM tours WHERE is_active = 1';
      db.query(query, (err, results) => {
        if (err) {
          console.error('Error fetching tours:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
      });
    } catch (error) {
      console.error('Error in tours route:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}; 