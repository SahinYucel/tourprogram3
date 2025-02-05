const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Promise wrapper for database queries
  const query = (sql, values) => {
    return new Promise((resolve, reject) => {
      db.query(sql, values, (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });
  };

  // Guide login endpoint'i
  router.post('/', async (req, res) => {
    const { name, password } = req.body;

    // Debug için gelen verileri logla
    console.log('Login attempt:', { name, password });

    try {
      // Rehberi ve şirket bilgisini getir
      const sql = `
        SELECT g.*, c.company_name 
        FROM agencyguide g
        JOIN companyusers c ON g.company_id = c.id
        WHERE LOWER(g.name) = LOWER(?)
      `;
      
      // SQL sorgusunu logla
      console.log('SQL Query:', sql);
      console.log('Query params:', [name]);

      const guides = await query(sql, [name]);

      // Bulunan rehberleri logla
      console.log('Found guides:', guides);

      if (guides.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Kullanıcı bulunamadı'
        });
      }

      const guide = guides[0];

      // Debug için rehber bilgilerini logla
      console.log('Guide data:', {
        id: guide.id,
        name: guide.name,
        password_in_db: guide.sifre,
        is_active: guide.is_active
      });

      // Şifre kontrolü
      if (!guide.sifre || guide.sifre !== password) {
        return res.status(401).json({
          success: false,
          message: 'Şifre hatalı'
        });
      }

      // Rehber aktif mi kontrolü
      if (!guide.is_active) {
        return res.status(403).json({
          success: false,
          message: 'Hesabınız aktif değil'
        });
      }

      // Rehber ayarlarını getir
      const settingsSql = `
        SELECT earnings, promotion_rate, revenue, 
               pax_adult, pax_child, pax_free
        FROM agency_guide_settings 
        WHERE guide_id = ?
      `;
      
      const settings = await query(settingsSql, [guide.id]);

      // Token oluştur
      const token = 'dummy-token-' + Math.random().toString(36).substring(7);

      // Response objesi
      const response = {
        success: true,
        data: {
          id: guide.id,
          name: guide.name,
          surname: guide.surname,
          code: guide.code,
          companyId: guide.company_id,
          companyName: guide.company_name,
          region: (() => {
            try {
              return guide.region ? JSON.parse(guide.region) : [];
            } catch (e) {
              console.warn('Failed to parse guide region:', e);
              return [];
            }
          })(),
          settings: settings.length > 0 ? {
            earnings: settings[0].earnings,
            promotionRate: settings[0].promotion_rate,
            revenue: settings[0].revenue,
            pax: {
              adult: settings[0].pax_adult,
              child: settings[0].pax_child,
              free: settings[0].pax_free
            }
          } : null
        },
        token
      };

      // Debug için response'u logla
      console.log('Success response:', response);

      res.json(response);

    } catch (error) {
      console.error('Guide login error:', error);
      res.status(500).json({
        success: false,
        message: 'Giriş işlemi sırasında bir hata oluştu',
        error: error.message
      });
    }
  });

  return router;
}; 