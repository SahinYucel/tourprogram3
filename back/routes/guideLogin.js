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
      // SQL sorgusunu güncelle
      const sql = `
        SELECT 
          g.*,
          c.company_name,
          g.region as guide_region,
          g.guide_group,
          g.nickname,
          JSON_UNQUOTE(g.region) as region_text  /* JSON_UNQUOTE ile region'u al */
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

      // Region'u parse et
      let parsedRegion = [];
      try {
        // Region verisini parse et
        const regionData = guide.region_text || guide.guide_region;
        
        if (regionData) {
          // Eğer string ise ve köşeli parantezle başlıyorsa JSON parse et
          if (typeof regionData === 'string' && regionData.trim().startsWith('[')) {
            parsedRegion = JSON.parse(regionData);
          } 
          // Değilse direkt string olarak al
          else if (typeof regionData === 'string') {
            parsedRegion = [regionData];
          }
        }

        // Array kontrolü yap
        if (!Array.isArray(parsedRegion)) {
          parsedRegion = [];
        }

        console.log('Region parsing:', {
          original: regionData,
          parsed: parsedRegion,
          type: typeof regionData
        });

      } catch (e) {
        console.warn('Region parse error:', e);
        parsedRegion = [];
      }

      // Response objesini güncelle
      const response = {
        success: true,
        data: {
          id: guide.id,
          name: guide.name,
          surname: guide.surname,
          code: guide.code,
          companyId: guide.company_id,
          companyName: guide.company_name,
          region: parsedRegion,
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
        },
        token
      };

      // Debug için response'u logla
      console.log('Success response:', response);

      // Debug için detaylı loglama
      console.log('\n=== GUIDE LOGIN RESPONSE ===');
      console.log('Raw guide data:', {
        ...guide,
        region_text: guide.region_text,
        guide_region: guide.guide_region,
        original_region: guide.region
      });
      console.log('\nParsed Region:', {
        raw_text: guide.region_text,
        raw_region: guide.guide_region,
        parsed: parsedRegion,
        type: typeof guide.region_text
      });
      console.log('\nFinal Response:', JSON.stringify(response, null, 2));
      console.log('===========================\n');

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