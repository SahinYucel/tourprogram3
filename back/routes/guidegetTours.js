const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Promise wrapper for database queries
  const query = (sql, values) => {
    return new Promise((resolve, reject) => {
      db.query(sql, values, (error, results) => {
        if (error) {
          console.error('Database query error:', error);
          reject(error);
        } else {
          console.log('Query results:', results);
          resolve(results);
        }
      });
    });
  };

  // Get tours endpoint
  router.get('/', async (req, res) => {
    console.log('GET /guidegetTours request received');
    
    try {
      const guideId = req.query.guideId;
      console.log('Guide ID:', guideId);

      if (!guideId) {
        return res.status(400).json({
          success: false,
          message: 'Guide ID gerekli'
        });
      }

      // Önce rehberin bölgelerini al
      const guideRegionsSql = `
        SELECT region_name 
        FROM guide_regions 
        WHERE guide_id = ?
      `;
      
      const guideRegions = await query(guideRegionsSql, [guideId]);
      console.log('Guide regions:', guideRegions);

      if (!guideRegions.length) {
        return res.json({ 
          success: true, 
          data: [] 
        });
      }

      // Rehberin bölgelerine ait turları getir
      const sql = `
        WITH TourRegions AS (
          SELECT DISTINCT tr.tour_id, 
            GROUP_CONCAT(DISTINCT tr.region_name) as regions
          FROM tour_regions tr
          GROUP BY tr.tour_id
        ),
        TourPickupTimes AS (
          SELECT 
            tour_id,
            GROUP_CONCAT(
              CONCAT_WS('|', 
                id,
                hour,
                minute,
                region,
                area,
                period_active,
                period
              ) ORDER BY period
            ) as pickup_times
          FROM tour_pickup_times
          WHERE period_active = 1
          GROUP BY tour_id
        )
        SELECT DISTINCT
          t.*,
          tr.regions,
          GROUP_CONCAT(DISTINCT td.day_number ORDER BY td.day_number) as tour_days,
          (
            SELECT GROUP_CONCAT(DISTINCT tr2.region_name)
            FROM tour_regions tr2
            WHERE tr2.tour_id = t.id
          ) as available_regions,
          tpt.pickup_times
        FROM tours t
        LEFT JOIN TourRegions tr ON t.id = tr.tour_id
        LEFT JOIN tour_days td ON t.id = td.tour_id
        LEFT JOIN TourPickupTimes tpt ON t.id = tpt.tour_id
        WHERE EXISTS (
          SELECT 1 
          FROM tour_regions tr3
          WHERE tr3.tour_id = t.id
          AND tr3.region_name IN (
            SELECT region_name 
            FROM guide_regions 
            WHERE guide_id = ?
          )
        )
        AND t.is_active = 1
        GROUP BY t.id
        ORDER BY t.created_at DESC
      `;
      
      console.log('Executing SQL query:', sql);
      console.log('Query params:', [guideId]);

      const tours = await query(sql, [guideId]);
      console.log('Raw tours data:', tours);

      // Turları formatla
      const formattedTours = tours.map(tour => {
        // Pickup times'ı parse et
        const pickupTimes = tour.pickup_times ? tour.pickup_times.split(',').map(timeStr => {
          const [id, hour, minute, region, area, periodActive, period] = timeStr.split('|');
          return {
            id: parseInt(id),
            hour,
            minute,
            region,
            area,
            periodActive: parseInt(periodActive),
            period: parseInt(period)
          };
        }).sort((a, b) => a.period - b.period) : [];

        const formatted = {
          id: tour.id,
          tour_name: tour.tour_name,
          tourName: tour.tour_name || tour.name,
          operator: tour.operator,
          operatorId: tour.operator_id,
          adultPrice: tour.adult_price || tour.price,
          childPrice: tour.child_price,
          guideAdultPrice: tour.guide_adult_price,
          guideChildPrice: tour.guide_child_price,
          priority: tour.priority || '0',
          regions: tour.regions ? tour.regions.split(',') : [],
          availableRegions: tour.available_regions ? tour.available_regions.split(',') : [],
          description: tour.description || '',
          status: tour.status || 'active',
          tourDays: tour.tour_days ? tour.tour_days.split(',').map(Number) : [],
          pickupTimes: pickupTimes
        };

        console.log('Formatted tour:', formatted);
        return formatted;
      });

      // Rehberin bölgelerini de response'a ekle
      const response = {
        success: true,
        data: formattedTours,
        guideRegions: guideRegions.map(region => region.region_name)
      };

      console.log('Final response:', response.data.id);
      res.json(response);

    } catch (error) {
      console.error('Error in /guidegetTours:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({
        success: false,
        message: 'Turlar getirilirken bir hata oluştu',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });

  return router;
}; 