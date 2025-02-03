-- Rehber tablosu
CREATE TABLE IF NOT EXISTS agencyguide (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  surname VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  region JSON,
  guide_group VARCHAR(100),
  nickname VARCHAR(100),
  languages JSON,
  other_languages TEXT,
  phone VARCHAR(50),
  code VARCHAR(20),
  company_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_company (company_id),
  FOREIGN KEY (company_id) REFERENCES companyusers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Rehber ayarları tablosu
CREATE TABLE IF NOT EXISTS agency_guide_settings (
  id INT NOT NULL AUTO_INCREMENT,
  guide_id INT NOT NULL,
  earnings DECIMAL(10,2) DEFAULT 0.00,
  promotion_rate DECIMAL(5,2) DEFAULT 0.00,
  revenue DECIMAL(10,2) DEFAULT 0.00,
  pax_adult INT DEFAULT 0,
  pax_child INT DEFAULT 0,
  pax_free INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY unique_guide (guide_id),
  FOREIGN KEY (guide_id) REFERENCES agencyguide(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 