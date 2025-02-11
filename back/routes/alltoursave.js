const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.post('/save', async (req, res) => {
    const connection = await db.promise();
    
    try {
      await connection.beginTransaction();

      console.log('API\'ye gelen ham veriler:', JSON.stringify(req.body, null, 2));

      // Veri kontrolü
      if (!Array.isArray(req.body) || req.body.length === 0) {
        throw new Error('Geçerli tur verisi bulunamadı');
      }

      const companyRef = req.body[0]?.mainTour?.company_ref;
      if (!companyRef) {
        throw new Error('Company reference is required');
      }

      // Mevcut turları sil
      await connection.query(
        'DELETE FROM tours WHERE company_ref = ?',
        [companyRef]
      );

      // Mevcut ana turları sil
      await connection.query(
        'DELETE FROM main_tours WHERE company_ref = ?',
        [companyRef]
      );

      // Ana turları kaydet
      const mainTours = new Set();
      for (const tourData of req.body) {
        const { mainTour } = tourData;
        
        // Ana tur adını al (ya kendi ana turuysa ya da bağlı olduğu ana tur)
        if (mainTour.main_tour_name) {
          mainTours.add(mainTour.main_tour_name);
        }
      }

      console.log('Kaydedilecek ana turlar:', [...mainTours]);

      // Ana turları kaydet ve ID'lerini sakla
      const mainTourIds = new Map(); // tour_name -> id eşleştirmesi için
      for (const mainTourName of mainTours) {
        try {
          const insertQuery = `INSERT INTO main_tours (company_ref, tour_name) 
                             VALUES (?, ?)`;
          
          const [result] = await connection.query(insertQuery, [
            companyRef,
            mainTourName
          ]);

          mainTourIds.set(mainTourName, result.insertId);
          console.log(`Ana tur kaydedildi:`, {
            tour_name: mainTourName,
            company_ref: companyRef,
            insertId: result.insertId
          });
        } catch (error) {
          console.error(`Ana tur kaydetme hatası:`, {
            tour_name: mainTourName,
            error: error.message
          });
          throw error;
        }
      }

      // Normal turları kaydet
      for (const tourData of req.body) {
        const { mainTour, days, pickupTimes, options } = tourData;

        // Ana tur ID'sini bul
        const mainTourId = mainTour.main_tour_name ? mainTourIds.get(mainTour.main_tour_name) : null;

        console.log('Tur kaydediliyor:', {
          tour_name: mainTour.tour_name,
          main_tour_name: mainTour.main_tour_name,
          main_tour_id: mainTourId
        });

        const insertQuery = `INSERT INTO tours (
          company_ref, tour_name, main_tour_id,
          operator, operator_id, 
          adult_price, child_price, guide_adult_price, guide_child_price, 
          is_active, priority, description, currency
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const insertValues = [
          mainTour.company_ref,
          mainTour.tour_name,
          mainTourId,  // Ana tur ID'si
          mainTour.operator,
          mainTour.operator_id,
          parseFloat(mainTour.adult_price) || 0,
          parseFloat(mainTour.child_price) || 0,
          parseFloat(mainTour.guide_adult_price) || 0,
          parseFloat(mainTour.guide_child_price) || 0,
          mainTour.is_active === false ? 0 : 1,
          parseInt(mainTour.priority) || 0,
          mainTour.description || '',
          mainTour.currency || 'EUR'
        ];

        console.log('Kaydedilen tur değerleri:', {
          tour_name: mainTour.tour_name,
          main_tour_name: mainTour.main_tour_name,
          main_tour_id: mainTourId,
          values: insertValues
        });

        const [tourResult] = await connection.query(insertQuery, insertValues);
        const tourId = tourResult.insertId;

        // Bölgeleri kaydet
        if (Array.isArray(mainTour.bolgeler) && mainTour.bolgeler.length > 0) {
          // Boş region değerlerini filtrele
          const validRegions = mainTour.bolgeler.filter(region => region.trim() !== '');

          // Her benzersiz region için bir kayıt oluştur
          const uniqueRegions = [...new Set(validRegions)];

          const regionValues = uniqueRegions.map(region => [tourId, region]);
          
          if (regionValues.length > 0) {
            await connection.query(
              'INSERT INTO tour_regions (tour_id, region_name) VALUES ?',
              [regionValues]
            );
          }
        }

        // Günleri kaydet
        if (Array.isArray(days)) {
          // Önce bu tura ait tüm günleri sil
          await connection.query(
            'DELETE FROM tour_days WHERE tour_id = ?',
            [tourId]
          );

          // Gelen günlerin geçerli olduğundan emin ol (1-7 arası)
          const validDays = days.filter(day => day >= 0 && day <= 7);
          
          // 7 günlük bir dizi oluştur
          const fullWeekDays = Array(7).fill(0).map((_, index) => {
            const dayNumber = index + 1;
            return validDays.includes(dayNumber) ? dayNumber : 0;  // Seçili olmayan günler için 0
          });

          // Bulk insert kullan
          const dayValues = fullWeekDays.map(day => [tourId, day]);
          
          await connection.query(
            'INSERT INTO tour_days (tour_id, day_number) VALUES ?',
            [dayValues]
          );
        }

        // Kalkış zamanlarını kaydet
        if (Array.isArray(pickupTimes) && pickupTimes.length > 0) {
          console.log('Kaydedilecek pickup times:', pickupTimes);
          
          const timeValues = pickupTimes.map(time => {
            // isActive değerini period_active olarak 1/0 şeklinde dönüştür
            const periodActive = time.isActive === false ? 0 : 1;
            
            console.log('Pickup time dönüşümü:', {
              original: time,
              periodActive,
              isActive: time.isActive
            });

            return [
              tourId, 
              time.hour || '00',
              time.minute || '00',
              time.region || '',
              time.area || '',
              time.period || '1',
              periodActive  // period_active sütununa 1 veya 0 olarak kaydet
            ];
          });

          if (timeValues.length > 0) {
            await connection.query(
              `INSERT INTO tour_pickup_times 
              (tour_id, hour, minute, region, area, period, period_active) 
              VALUES ?`,
              [timeValues]
            );
          }
        }

        // Seçenekleri kaydet
        if (Array.isArray(options) && options.length > 0) {
          const optionValues = options
            .filter(opt => opt.name || opt.option_name || opt.price)
            .map(opt => [
              tourId, 
              opt.option_name || opt.name || '',
              parseFloat(opt.price) || 0
            ]);

          if (optionValues.length > 0) {
            await connection.query(
              'INSERT INTO tour_options (tour_id, option_name, price) VALUES ?',
              [optionValues]
            );
          }
        }
      }

      await connection.commit();
      console.log('Kayıt başarılı');
      res.json({ 
        success: true, 
        message: 'Turlar başarıyla kaydedildi',
        savedCount: req.body.length
      });

    } catch (error) {
      await connection.rollback();
      console.error('Tour kaydetme hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Turlar kaydedilirken bir hata oluştu',
        error: error.message
      });
    }
  });

  // Turları getirme endpoint'i
  router.get('/:companyRef', async (req, res) => {
    const connection = await db.promise();
    try {
      const { companyRef } = req.params;

      // Turları getir
      const [tours] = await connection.query(
        `SELECT t.*, mt.tour_name as main_tour_name
         FROM tours t
         LEFT JOIN main_tours mt ON t.main_tour_id = mt.id
         WHERE t.company_ref = ?`,
        [companyRef]
      );

      // Her tur için ilişkili verileri al
      const fullTours = await Promise.all(tours.map(async (tour) => {
        // Günleri al
        const [days] = await connection.query(
          'SELECT day_number FROM tour_days WHERE tour_id = ?',
          [tour.id]
        );

        // Kalkış zamanlarını al
        const [pickupTimes] = await connection.query(
          'SELECT * FROM tour_pickup_times WHERE tour_id = ?',
          [tour.id]
        );

        // Seçenekleri al
        const [options] = await connection.query(
          'SELECT * FROM tour_options WHERE tour_id = ?',
          [tour.id]
        );

        // Bölgeleri al
        const [regions] = await connection.query(
          'SELECT region_name FROM tour_regions WHERE tour_id = ?',
          [tour.id]
        );

        // Ana tur mu kontrol et
        const [isMainTour] = await connection.query(
          'SELECT 1 FROM main_tours WHERE company_ref = ? AND tour_name = ?',
          [companyRef, tour.tour_name]
        );

        return {
          mainTour: {
            id: tour.id,
            company_ref: tour.company_ref,
            tour_name: tour.tour_name,
            main_tour_name: tour.main_tour_name,
            operator: tour.operator,
            operator_id: tour.operator_id,
            adult_price: tour.adult_price,
            child_price: tour.child_price,
            guide_adult_price: tour.guide_adult_price,
            guide_child_price: tour.guide_child_price,
            is_active: tour.is_active === 1,
            priority: parseInt(tour.priority) || 0,
            bolgeler: regions.map(r => r.region_name),
            description: tour.description || '',
            currency: tour.currency || 'EUR'
          },
          days: days.map(d => d.day_number),
          pickupTimes: pickupTimes.map(time => ({
            ...time,
            isActive: time.period_active === 1
          })),
          options
        };
      }));

      res.json({
        success: true,
        data: fullTours
      });

    } catch (error) {
      console.error('Tur getirme hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Turlar getirilirken bir hata oluştu',
        error: error.message
      });
    }
  });

  // Tur silme endpoint'i
  router.delete('/:tourId', async (req, res) => {
    const connection = await db.promise();
    try {
      const { tourId } = req.params;

      await connection.beginTransaction();

      // İlişkili kayıtları sil
      await connection.query('DELETE FROM tour_regions WHERE tour_id = ?', [tourId]);
      await connection.query('DELETE FROM tour_days WHERE tour_id = ?', [tourId]);
      await connection.query('DELETE FROM tour_pickup_times WHERE tour_id = ?', [tourId]);
      await connection.query('DELETE FROM tour_options WHERE tour_id = ?', [tourId]);
      
      // Ana turu sil
      await connection.query('DELETE FROM tours WHERE id = ?', [tourId]);

      await connection.commit();

      res.json({
        success: true,
        message: 'Tur başarıyla silindi'
      });

    } catch (error) {
      await connection.rollback();
      console.error('Tur silme hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Tur silinirken bir hata oluştu',
        error: error.message
      });
    }
  });

  return router;
}; 