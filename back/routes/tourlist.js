const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Promise wrapper for database connection
  const promiseDb = db.promise();

  // Save tour data
  router.post('/save', async (req, res) => {
    const { companyId, tours, bolgeler, regions } = req.body;

    if (!companyId) {
      return res.status(400).json({ error: 'Company ID is required' });
    }

    try {
      await promiseDb.beginTransaction();

      // Önce tüm verileri sil (sıralama önemli - foreign key constraints için)
      console.log('Deleting existing areas...'); // Debug için
      await promiseDb.query(
        'DELETE a FROM areaslist a ' +
        'INNER JOIN regionslist r ON a.region_id = r.id ' +
        'WHERE a.company_id = ?',
        [companyId]
      );
      
      console.log('Deleting existing regions...'); // Debug için
      await promiseDb.query('DELETE FROM regionslist WHERE company_id = ?', [companyId]);
      
      console.log('Deleting existing tours...'); // Debug için
      await promiseDb.query('DELETE FROM tourlist WHERE company_id = ?', [companyId]);
      
      console.log('Deleting existing create_areaslist...'); // Debug için
      await promiseDb.query('DELETE FROM create_areaslist WHERE company_id = ?', [companyId]);

      // Delete existing sub tours
      await promiseDb.query('DELETE st FROM sub_tours st ' +
        'INNER JOIN tourlist t ON st.tour_id = t.id ' +
        'WHERE t.company_id = ?', [companyId]);

      // Insert tours and their sub-tours
      if (tours && tours.length > 0) {
        for (const tour of tours) {
          // Insert main tour
          const [tourResult] = await promiseDb.query(
            'INSERT INTO tourlist (name, company_id) VALUES (?, ?)',
            [tour.name, companyId, companyId]
          );

          // Insert sub-tours if any
          if (tour.subTours && tour.subTours.length > 0) {
            const subTourValues = tour.subTours.map(subTour => [
              subTour.name,
              tourResult.insertId,
              companyId
            ]);
            
            await promiseDb.query(
              'INSERT INTO sub_tours (name, tour_id, company_id) VALUES ?',
              [subTourValues]
            );
          }
        }
      }

      console.log('Gelen bolgeler:', bolgeler);
      // Insert bolgeler into create_areaslist
      if (bolgeler && bolgeler.length > 0) {
        const bolgeValues = bolgeler.map(bolge => [bolge.name, companyId]);
        console.log('Oluşturulan bolgeValues:', bolgeValues);
        try {
          await promiseDb.query(
            'INSERT INTO create_areaslist (name, company_id) VALUES ?',
            [bolgeValues]
          );
          console.log('Veriler başarıyla kaydedildi');
        } catch (error) {
          console.error('SQL Error:', error.message);
          console.error('SQL Query:', 'INSERT INTO create_areaslist (name, company_id) VALUES ?');
          console.error('Values:', bolgeValues);
          throw error;
        }
      }

      // Insert Bölgeler ve Alanlar
      if (regions && regions.length > 0) {
        for (const region of regions) {
          // Insert region
          const [regionResult] = await promiseDb.query(
            'INSERT INTO regionslist (name, company_id) VALUES (?, ?)',
            [region.name, companyId]
          );

          // Insert areas for this region
          if (region.areas && region.areas.length > 0) {
            const areaValues = region.areas.map(area => [
              area.name,
              regionResult.insertId,
              companyId
            ]);
            
            await promiseDb.query(
              'INSERT INTO areaslist (name, region_id, company_id) VALUES ?',
              [areaValues]
            );
          }
        }
      }

      await promiseDb.commit();
      
      res.json({
        success: true,
        message: 'Tur verileri başarıyla kaydedildi'
      });
    } catch (error) {
      await promiseDb.rollback();
      console.error('İşlem hatası:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET - Şirkete ait tur verilerini getir
  router.get('/:companyId', async (req, res) => {
    console.log('GET request received for companyId:', req.params.companyId);
    
    try {
      const { companyId } = req.params;

      if (!companyId) {
        console.log('CompanyId is missing');
        return res.status(400).json({ error: 'Şirket ID gerekli' });
      }

      console.log('Executing database queries...');
      
      // Get tours with their sub-tours
      const [tours] = await promiseDb.query(
        'SELECT t.*, st.id as sub_tour_id, st.name as sub_tour_name ' +
        'FROM tourlist t ' +
        'LEFT JOIN sub_tours st ON t.id = st.tour_id ' +
        'WHERE t.company_id = ?',
        [companyId]
      );

      // Format tours with sub-tours
      const formattedTours = tours.reduce((acc, curr) => {
        const tour = acc.find(t => t.id === curr.id);
        if (!tour) {
          acc.push({
            id: curr.id,
            name: curr.name,
            subTours: curr.sub_tour_id ? [{
              id: curr.sub_tour_id,
              name: curr.sub_tour_name
            }] : []
          });
        } else if (curr.sub_tour_id && !tour.subTours.find(st => st.id === curr.sub_tour_id)) {
          tour.subTours.push({
            id: curr.sub_tour_id,
            name: curr.sub_tour_name
          });
        }
        return acc;
      }, []);

      // create_areaslist tablosundan bölgeleri getir
      const [bolgeler] = await promiseDb.query(
        'SELECT * FROM create_areaslist WHERE company_id = ?',
        [companyId]
      );

      // Bölgeler ve Alanlar listesini getir
      const [regions] = await promiseDb.query(
        'SELECT r.*, a.id as area_id, a.name as area_name ' +
        'FROM regionslist r ' +
        'LEFT JOIN areaslist a ON r.id = a.region_id ' +
        'WHERE r.company_id = ?',
        [companyId]
      );

      // Bölgeleri ve alanları düzenle
      const formattedRegions = regions.reduce((acc, curr) => {
        const region = acc.find(r => r.id === curr.id);
        if (!region) {
          acc.push({
            id: curr.id,
            name: curr.name,
            areas: curr.area_id ? [{
              id: curr.area_id,
              name: curr.area_name
            }] : []
          });
        } else if (curr.area_id && !region.areas.find(a => a.id === curr.area_id)) {
          region.areas.push({
            id: curr.area_id,
            name: curr.area_name
          });
        }
        return acc;
      }, []);

      // Verileri client'a gönder
      res.json({
        tours: formattedTours,
        bolgeler: bolgeler.map(bolge => ({
          id: bolge.id,
          name: bolge.name
        })),
        regions: formattedRegions
      });

    } catch (error) {
      console.error('Detailed error in GET /tourlist/:companyId:', error);
      res.status(500).json({ 
        error: 'Sunucu hatası',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });

  // Add new route for sub-tour operations
  router.post('/subtour', async (req, res) => {
    const { tourId, name, companyId } = req.body;

    try {
      const [result] = await promiseDb.query(
        'INSERT INTO sub_tours (name, tour_id, company_id) VALUES (?, ?, ?)',
        [name, tourId, companyId]
      );

      res.json({
        success: true,
        subTour: {
          id: result.insertId,
          name,
          tourId
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}; 