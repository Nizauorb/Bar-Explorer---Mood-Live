-- Base de données Bar Explorer - Mood Live
-- Création de la structure pour l'application de découverte de bars

-- Création de la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS bar_explorer;
USE bar_explorer;

-- Configuration des caractères pour le support UTF-8
ALTER DATABASE bar_explorer CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Table des utilisateurs
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL UNIQUE,
    pseudo VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255),
    avatar VARCHAR(500),
    google_id VARCHAR(100) UNIQUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Table des préférences utilisateur
CREATE TABLE user_preferences (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    music_genres JSON,
    go_out_frequency ENUM('jamais', 'rarement', 'occasionnellement', 'souvent', 'tres_souvent') DEFAULT 'occasionnellement',
    preferred_price_range ENUM('€', '€€', '€€€') DEFAULT '€€',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    location_sharing BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des bars
CREATE TABLE bars (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(200) NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    location POINT NOT NULL SRID 4326,
    current_mood DECIMAL(3,2) DEFAULT NULL COMMENT 'Humeur actuelle calculée (0-5)',
    current_crowd ENUM('faible', 'moyenne', 'pleine') DEFAULT NULL COMMENT 'Affluence actuelle',
    vote_count INT DEFAULT 0 COMMENT 'Nombre total de votes',
    price_range ENUM('€', '€€', '€€€') NOT NULL,
    tags JSON,
    description TEXT,
    hours JSON,
    services JSON,
    image_url VARCHAR(500),
    phone VARCHAR(20),
    website VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Index pour la recherche géospatiale
    SPATIAL INDEX(location),
    INDEX idx_name (name),
    INDEX idx_price_range (price_range)
);

-- Table des votes
CREATE TABLE votes (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    bar_id VARCHAR(36) NOT NULL,
    mood TINYINT NOT NULL CHECK (mood >= 0 AND mood <= 5),
    crowd ENUM('faible', 'moyenne', 'pleine') NOT NULL,
    comment TEXT,
    user_latitude DECIMAL(10, 8),
    user_longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (bar_id) REFERENCES bars(id) ON DELETE CASCADE,
    
    -- Un utilisateur ne peut voter qu'une fois toutes les 15 minutes pour un bar
    UNIQUE KEY unique_user_bar_time (user_id, bar_id, created_at),
    INDEX idx_bar_votes (bar_id),
    INDEX idx_user_votes (user_id),
    INDEX idx_created_at (created_at)
);

-- Table des favoris
CREATE TABLE favorites (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    bar_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (bar_id) REFERENCES bars(id) ON DELETE CASCADE,
    
    -- Un utilisateur ne peut avoir le même bar en favori qu'une fois
    UNIQUE KEY unique_user_bar (user_id, bar_id),
    INDEX idx_user_favorites (user_id),
    INDEX idx_bar_favorites (bar_id)
);

-- Table des amitiés
CREATE TABLE friendships (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    requester_id VARCHAR(36) NOT NULL,
    addressee_id VARCHAR(36) NOT NULL,
    status ENUM('pending', 'accepted', 'blocked') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (addressee_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Empêcher les doublons et l'auto-amitié
    CHECK (requester_id != addressee_id),
    UNIQUE KEY unique_friendship (requester_id, addressee_id),
    INDEX idx_friendships (requester_id, status),
    INDEX idx_friend_requests (addressee_id, status)
);

-- Table des sessions utilisateurs (pour le suivi en temps réel)
CREATE TABLE user_sessions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    current_bar_id VARCHAR(36) NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_online BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (current_bar_id) REFERENCES bars(id) ON DELETE SET NULL,
    
    INDEX idx_user_sessions (user_id),
    INDEX idx_online_users (is_online, last_activity),
    INDEX idx_bar_sessions (current_bar_id)
);

-- Table des logs d'activité (optionnel, pour le debugging)
CREATE TABLE activity_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id VARCHAR(36),
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_activity (user_id),
    INDEX idx_entity_activity (entity_type, entity_id),
    INDEX idx_created_at (created_at)
);

-- Trigger pour mettre à jour les statistiques des bars après un vote
DELIMITER //
CREATE TRIGGER after_vote_insert 
AFTER INSERT ON votes
FOR EACH ROW
BEGIN
    UPDATE bars 
    SET 
        current_mood = (
            SELECT AVG(mood) 
            FROM votes 
            WHERE bar_id = NEW.bar_id 
            AND created_at >= DATE_SUB(NOW(), INTERVAL 2 HOUR)
        ),
        current_crowd = (
            SELECT CASE 
                WHEN AVG(CASE crowd 
                    WHEN 'faible' THEN 1 
                    WHEN 'moyenne' THEN 2 
                    WHEN 'pleine' THEN 3 
                END) < 1.5 THEN 'faible'
                WHEN AVG(CASE crowd 
                    WHEN 'faible' THEN 1 
                    WHEN 'moyenne' THEN 2 
                    WHEN 'pleine' THEN 3 
                END) < 2.5 THEN 'moyenne'
                ELSE 'pleine'
            END
            FROM votes 
            WHERE bar_id = NEW.bar_id 
            AND created_at >= DATE_SUB(NOW(), INTERVAL 2 HOUR)
        ),
        vote_count = vote_count + 1
    WHERE id = NEW.bar_id;
END//
DELIMITER ;

-- Insertion de données de test (optionnel car on va utiliser les données de Google places API)
-- INSERT INTO bars (name, address, latitude, longitude, price_range, tags, description) VALUES
-- ('Le Petit Bar', '123 Rue de la République, Lyon', 45.7640, 4.8357, '€€', '["cocktails", "musique", "terrasse"]', 'Bar cosy avec cocktails artisanaux'),
-- ('La Cave à Jazz', '45 Rue Jean Jaurès, Lyon', 45.7785, 4.8565, '€€', '["jazz", "vin", "concerts"]', 'Bar de jazz avec concerts live'),
-- ('Le Rooftop', '10 Place Bellecour, Lyon', 45.7597, 4.8322, '€€€', '["terrasse", "vue", "chic"]', 'Rooftop avec vue panoramique');

-- Insertion d'utilisateurs de test (optionnel - à supprimer en production)
INSERT INTO users (email, pseudo, email_verified) VALUES
('test@example.com', 'TestUser', TRUE),
('lucas@bar-explorer.com', 'Lucas22', TRUE),
('anna@bar-explorer.com', 'Anna28', TRUE),
('marc@bar-explorer.com', 'Marc15', TRUE);

-- Création des vues utiles
CREATE VIEW active_users AS
SELECT u.id, u.pseudo, u.avatar, us.is_online, us.last_activity, us.current_bar_id, b.name as current_bar_name
FROM users u
LEFT JOIN user_sessions us ON u.id = us.user_id
LEFT JOIN bars b ON us.current_bar_id = b.id
WHERE us.is_online = TRUE AND us.last_activity >= DATE_SUB(NOW(), INTERVAL 5 MINUTE);

CREATE VIEW bar_stats AS
SELECT 
    b.id,
    b.name,
    b.current_mood,
    b.current_crowd,
    b.vote_count,
    COUNT(DISTINCT f.id) as favorite_count,
    COUNT(DISTINCT v.id) as recent_votes,
    AVG(v.mood) as avg_mood_2h
FROM bars b
LEFT JOIN favorites f ON b.id = f.bar_id
LEFT JOIN votes v ON b.id = v.bar_id AND v.created_at >= DATE_SUB(NOW(), INTERVAL 2 HOUR)
WHERE b.is_active = TRUE
GROUP BY b.id, b.name, b.current_mood, b.current_crowd, b.vote_count;

-- Index de performance pour les requêtes fréquentes
CREATE INDEX idx_votes_recent ON votes (bar_id, created_at DESC);
CREATE INDEX idx_user_location ON user_sessions (latitude, longitude);
CREATE INDEX idx_bar_location ON bars (latitude, longitude);

-- Table des tokens de réinitialisation de mot de passe
CREATE TABLE password_reset_tokens (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_tokens (user_id),
    INDEX idx_expires_at (expires_at)
);

-- Table pour rate limiting connexions
CREATE TABLE login_attempts (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN DEFAULT FALSE,
    
    INDEX idx_email_attempts (email, attempted_at),
    INDEX idx_ip_attempts (ip_address, attempted_at)
);

-- ==========================================
-- TRIGGERS POUR LA GÉOMÉTRIE SPATIALE
-- ==========================================

-- Trigger pour mettre à jour automatiquement la colonne spatiale lors de l'insertion
DELIMITER //
CREATE TRIGGER before_bar_insert 
BEFORE INSERT ON bars
FOR EACH ROW
BEGIN
    -- Convertir latitude/longitude en POINT spatial
    SET NEW.location = ST_GeomFromText(CONCAT('POINT(', NEW.longitude, ' ', NEW.latitude, ')'), 4326);
END//
DELIMITER ;

-- Trigger pour mettre à jour automatiquement la colonne spatiale lors de la modification
DELIMITER //
CREATE TRIGGER before_bar_update 
BEFORE UPDATE ON bars
FOR EACH ROW
BEGIN
    -- Mettre à jour le POINT si les coordonnées changent
    IF NEW.latitude <> OLD.latitude OR NEW.longitude <> OLD.longitude THEN
        SET NEW.location = ST_GeomFromText(CONCAT('POINT(', NEW.longitude, ' ', NEW.latitude, ')'), 4326);
    END IF;
END//
DELIMITER ;