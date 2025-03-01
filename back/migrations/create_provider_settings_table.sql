CREATE TABLE IF NOT EXISTS agency_provider_settings (
  id INT NOT NULL AUTO_INCREMENT,
  provider_id VARCHAR(255) NOT NULL,
  earnings DECIMAL(10,2) DEFAULT 0.00,
  promotion_rate DECIMAL(5,2) DEFAULT 0.00,
  revenue DECIMAL(10,2) DEFAULT 0.00,
  currency VARCHAR(3) DEFAULT 'EUR',
  pax_adult INT DEFAULT 0,
  pax_child INT DEFAULT 0,
  pax_free INT DEFAULT 0,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY unique_provider (provider_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;