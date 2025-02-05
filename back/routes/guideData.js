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
          resolve(results);
        }
      });
    });
  };

  // Güvenli JSON parse fonksiyonu
  const safeJSONParse = (str, defaultValue = []) => {
    if (!str) return defaultValue;
    try {
      return JSON.parse(str);
    } catch (error) {
      console.error('JSON parse error:', error);
      return defaultValue;
    }
  };

  // Rehberleri kaydet
  router.post('/save', async (req, res) => {
    const { companyId, guides } = req.body;

    console.log('Gelen rehber verileri:', JSON.stringify(guides, null, 2));

    try {
      // Transaction başlat
      await query('START TRANSACTION');

      try {
        // Önce bu şirkete ait tüm rehberleri ve ayarları sil
        await query('DELETE FROM agency_guide_settings WHERE guide_id IN (SELECT id FROM agencyguide WHERE company_id = ?)', [companyId]);
        await query('DELETE FROM agencyguide WHERE company_id = ?', [companyId]);

        // Her rehberi tek tek ekle ve ayarlarını kaydet
        for (const guide of guides) {
          console.log('İşlenen rehber:', guide.name, guide.surname);
          console.log('Rehber ayarları:', {
            earnings: guide.earnings,
            promotionRate: guide.promotionRate,
            revenue: guide.revenue,
            pax: guide.pax
          });

          // Rehberi ekle
          const insertGuideSql = `
            INSERT INTO agencyguide (
              name, surname, is_active, region, guide_group,
              nickname, languages, other_languages, phone, code, sifre,
              company_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          const guideResult = await query(insertGuideSql, [
            guide.name,
            guide.surname, 
            guide.isActive ? 1 : 0,
            Array.isArray(guide.region) ? JSON.stringify(guide.region) : '[]',
            guide.guideGroup,
            guide.nickname,
            typeof guide.languages === 'object' ? JSON.stringify(guide.languages) : '{}',
            guide.otherLanguages,
            guide.phone,
            guide.code,
            guide.guide_password,
            companyId
          ]);

          console.log('Rehber kaydedildi, ID:', guideResult.insertId);

          // Rehber ayarlarını kaydet
          const insertSettingsSql = `
            INSERT INTO agency_guide_settings (
              guide_id, earnings, promotion_rate, revenue,
              pax_adult, pax_child, pax_free
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
          `;

          await query(insertSettingsSql, [
            guideResult.insertId,
            parseFloat(guide.earnings) || 0,
            parseFloat(guide.promotionRate) || 0,
            parseFloat(guide.revenue) || 0,
            parseInt(guide.pax?.adult) || 0,
            parseInt(guide.pax?.child) || 0,
            parseInt(guide.pax?.free) || 0
          ]);

          console.log('Ayarlar kaydedildi, guide_id:', guideResult.insertId);
        }

        // Transaction'ı commit et
        await query('COMMIT');

        res.json({ 
          success: true, 
          message: 'Rehberler başarıyla kaydedildi'
        });

      } catch (error) {
        // Hata durumunda rollback yap
        await query('ROLLBACK');
        throw error;
      }

    } catch (error) {
      console.error('Rehber kaydetme hatası:', error);
      res.status(500).json({ 
        error: 'Rehberler kaydedilemedi',
        details: error.message 
      });
    }
  });

  // Rehberleri getir
  router.get('/:companyId', async (req, res) => {
    const { companyId } = req.params;

    try {
      console.log('Rehberler getiriliyor, companyId:', companyId);

      // Önce rehberleri al
      const guideSql = `
        SELECT 
          ag.*,
          CONCAT(
            CASE 
              WHEN ag.languages IS NOT NULL AND ag.languages != '{}'
              THEN (
                SELECT GROUP_CONCAT(
                  CASE 
                    WHEN JSON_EXTRACT(ag.languages, CONCAT('$.', lang)) = true 
                    THEN CONCAT(UPPER(LEFT(lang, 1)), LOWER(SUBSTRING(lang, 2)))
                  END
                )
                FROM JSON_TABLE(
                  '[\"almanca\",\"rusca\",\"ingilizce\",\"fransizca\",\"arapca\"]',
                  '$[*]' COLUMNS (lang VARCHAR(50) PATH '$')
                ) langs
              )
              ELSE ''
            END,
            CASE 
              WHEN ag.other_languages != '' 
              THEN CONCAT(IF(JSON_EXTRACT(ag.languages, '$.*') IS NOT NULL, ', ', ''), ag.other_languages)
              ELSE ''
            END
          ) as languagesDisplay
        FROM agencyguide ag 
        WHERE ag.company_id = ?
      `;
      
      const guides = await query(guideSql, [companyId]);
      console.log('Raw guides from DB:', guides);

      if (!guides || !Array.isArray(guides)) {
        return res.json([]);
      }

      // Her rehber için ayarları al
      const formattedGuides = await Promise.all(guides.map(async (guide) => {
        try {
          const settingsSql = `
            SELECT earnings, promotion_rate as promotionRate, revenue,
                   pax_adult, pax_child, pax_free
            FROM agency_guide_settings 
            WHERE guide_id = ?
          `;
          
          const settings = await query(settingsSql, [guide.id]);
          const guideSettings = settings[0] || {};

          // JSON alanlarını parse et
          let parsedRegion = [];
          let parsedLanguages = {};
          
          try {
            parsedRegion = guide.region ? JSON.parse(guide.region) : [];
          } catch (e) {
            console.error('Region parse error:', e);
            parsedRegion = Array.isArray(guide.region) ? guide.region : [];
          }

          try {
            parsedLanguages = guide.languages ? JSON.parse(guide.languages) : {};
          } catch (e) {
            console.error('Languages parse error:', e);
            parsedLanguages = typeof guide.languages === 'object' ? guide.languages : {};
          }

          return {
            id: guide.id,
            name: guide.name,
            surname: guide.surname,
            isActive: guide.is_active === 1,
            region: parsedRegion,
            guideGroup: guide.guide_group,
            nickname: guide.nickname,
            languages: parsedLanguages,
            languagesDisplay: guide.languagesDisplay,
            otherLanguages: guide.other_languages,
            phone: guide.phone,
            code: guide.code,
            guide_password: guide.sifre,
            earnings: guideSettings.earnings || 0,
            promotionRate: guideSettings.promotionRate || 0,
            revenue: guideSettings.revenue || 0,
            pax: {
              adult: guideSettings.pax_adult || 0,
              child: guideSettings.pax_child || 0,
              free: guideSettings.pax_free || 0
            }
          };
        } catch (error) {
          console.error('Error formatting guide:', guide.id, error);
          console.error('Problematic guide data:', guide);
          return null;
        }
      }));

      // Null değerleri filtrele
      const validGuides = formattedGuides.filter(guide => guide !== null);
      console.log('Formatted guides:', validGuides);

      res.json(validGuides);

    } catch (error) {
      console.error('Rehber getirme hatası:', error);
      res.status(500).json({ 
        error: 'Rehberler getirilemedi',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });

  // Rehber sil
  router.delete('/:guideId', async (req, res) => {
    const { guideId } = req.params;

    try {
      await db.beginTransaction();

      // Cascade olduğu için sadece rehberi silmek yeterli
      await db.query('DELETE FROM agencyguide WHERE id = ?', [guideId]);

      await db.commit();
      res.json({ success: true, message: 'Rehber başarıyla silindi' });

    } catch (error) {
      await db.rollback();
      console.error('Rehber silme hatası:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Guide login endpoint'i
  router.post('/guide-login', async (req, res) => {
    const { code, password } = req.body;

    try {
      // Rehberi ve şirket bilgisini getir
      const sql = `
        SELECT g.*, c.company_name 
        FROM agencyguide g
        JOIN companyusers c ON g.company_id = c.id
        WHERE g.code = ?
      `;
      
      const guides = await query(sql, [code]);

      if (guides.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Kullanıcı bulunamadı'
        });
      }

      const guide = guides[0];

      // Şifre kontrolü
      if (guide.sifre !== password) {
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

      // Token oluştur (gerçek uygulamada JWT kullanılabilir)
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
          region: JSON.parse(guide.region || '[]'),
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