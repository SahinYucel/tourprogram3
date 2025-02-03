-- Ana tur tablosu
CREATE TABLE IF NOT EXISTS tours (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_ref VARCHAR(255) NOT NULL,
    tour_name VARCHAR(255) NOT NULL,
    operator VARCHAR(255) NOT NULL,
    operator_id VARCHAR(255) NOT NULL,
    adult_price DECIMAL(10,2) DEFAULT 0,
    child_price DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_company_ref (company_ref),
    INDEX idx_operator_id (operator_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tur günleri tablosu
CREATE TABLE IF NOT EXISTS tour_days (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tour_id INT NOT NULL,
    day_number INT CHECK (day_number BETWEEN 1 AND 7),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_tour_day (tour_id, day_number),
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
    INDEX idx_tour_id (tour_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Kalkış zamanları tablosu
CREATE TABLE IF NOT EXISTS tour_pickup_times (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tour_id INT NOT NULL,
    hour VARCHAR(2) NOT NULL,
    minute VARCHAR(2) NOT NULL,
    region VARCHAR(255),
    area VARCHAR(255),
    period_active BOOLEAN DEFAULT false,
    period VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
    INDEX idx_tour_id (tour_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tur seçenekleri tablosu
CREATE TABLE IF NOT EXISTS tour_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tour_id INT NOT NULL,
    option_name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
    INDEX idx_tour_id (tour_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 