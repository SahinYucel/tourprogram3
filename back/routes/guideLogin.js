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

    console.log('Login attempt:', { name, password }); // Debug için

    try {
      const sql = `
        SELECT 
          g.*,
          c.company_name,
          GROUP_CONCAT(gr.region_name) as regions,
          g.guide_group,
          g.nickname
        FROM agencyguide g
        JOIN companyusers c ON g.company_id = c.id
        LEFT JOIN guide_regions gr ON g.id = gr.guide_id
        WHERE LOWER(g.name) = LOWER(?)
        GROUP BY g.id
      `;

      console.log('Executing SQL:', sql); // SQL sorgusunu logla
      console.log('Query params:', [name]); // Parametreleri logla

      const guides = await query(sql, [name]);
      console.log('Found guides:', guides); // Bulunan rehberleri logla

      if (guides.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Kullanıcı bulunamadı'
        });
      }

      const guide = guides[0];
      console.log('Guide data:', { // Rehber verilerini logla
        id: guide.id,
        name: guide.name,
        password_in_db: guide.sifre,
        is_active: guide.is_active
      });

      // Şifre kontrolü
      if (!guide.sifre || guide.sifre !== password) {
        console.log('Password mismatch:', { // Şifre uyuşmazlığını logla
          provided: password,
          stored: guide.sifre
        });
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
        FROM agency_guide_accounts 
        WHERE guide_id = ?
      `;
      
      const settings = await query(settingsSql, [guide.id]);
      console.log('Guide settings:', settings); // Ayarları logla

      // Bölgeleri array'e dönüştür
      const regions = guide.regions ? guide.regions.split(',') : [];
      console.log('Guide regions:', regions); // Bölgeleri logla

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
          region: regions,
          guideGroup: guide.guide_group || '',
          nickname: guide.nickname || 'Guide',
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
        }
      };

      console.log('Response:', response); // Response'u logla
      res.json(response);

    } catch (error) {
      console.error('Guide login error:', error);
      console.error('Error stack:', error.stack); // Stack trace'i logla
      res.status(500).json({
        success: false,
        message: 'Giriş işlemi sırasında bir hata oluştu',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });

  return router;
}; 