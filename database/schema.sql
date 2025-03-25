-- ComTok Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS comtok_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE comtok_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  profile_pic VARCHAR(255) DEFAULT NULL,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  is_active BOOLEAN DEFAULT TRUE,
  karma_points INT DEFAULT 0,
  role ENUM('user', 'moderator', 'admin') DEFAULT 'user',
  INDEX idx_username (username),
  INDEX idx_email (email)
);

-- Authentication tokens table (for JWT refresh tokens)
CREATE TABLE IF NOT EXISTS auth_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_user_id (user_id)
);

-- Account lockout table
CREATE TABLE IF NOT EXISTS account_lockouts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  failed_attempts INT DEFAULT 0,
  locked_until TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

-- Password reset table
CREATE TABLE IF NOT EXISTS password_resets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email_token (email, token),
  INDEX idx_expires_at (expires_at)
);

-- OTP verification table
CREATE TABLE IF NOT EXISTS otp_verifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  email VARCHAR(100) NOT NULL,
  otp_code VARCHAR(10) NOT NULL,
  purpose ENUM('login', 'registration', 'password_reset') NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_email (email)
);

-- Biometric auth table
CREATE TABLE IF NOT EXISTS biometric_auth (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  device_id VARCHAR(255) NOT NULL,
  enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_device (user_id, device_id)
);

-- Provinces table
CREATE TABLE IF NOT EXISTS provinces (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name)
);

-- Cities table
CREATE TABLE IF NOT EXISTS cities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  province_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (province_id) REFERENCES provinces(id) ON DELETE CASCADE,
  UNIQUE KEY unique_city_province (name, province_id),
  INDEX idx_province_id (province_id)
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  province_id INT NOT NULL,
  city_id INT,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  image_url VARCHAR(255),
  votes INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (province_id) REFERENCES provinces(id) ON DELETE CASCADE,
  FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_province_id (province_id),
  INDEX idx_city_id (city_id),
  INDEX idx_created_at (created_at)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  parent_id INT DEFAULT NULL, -- For nested comments/replies
  content TEXT NOT NULL,
  votes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE SET NULL,
  INDEX idx_post_id (post_id),
  INDEX idx_user_id (user_id),
  INDEX idx_parent_id (parent_id)
);

-- Post votes table
CREATE TABLE IF NOT EXISTS post_votes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  vote_type ENUM('upvote', 'downvote') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_post_user_vote (post_id, user_id),
  INDEX idx_post_id (post_id),
  INDEX idx_user_id (user_id)
);

-- Comment votes table
CREATE TABLE IF NOT EXISTS comment_votes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  comment_id INT NOT NULL,
  user_id INT NOT NULL,
  vote_type ENUM('upvote', 'downvote') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_comment_user_vote (comment_id, user_id),
  INDEX idx_comment_id (comment_id),
  INDEX idx_user_id (user_id)
);

-- User follows provinces
CREATE TABLE IF NOT EXISTS user_province_follows (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  province_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (province_id) REFERENCES provinces(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_province (user_id, province_id),
  INDEX idx_user_id (user_id),
  INDEX idx_province_id (province_id)
);

-- User follows cities
CREATE TABLE IF NOT EXISTS user_city_follows (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  city_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_city (user_id, city_id),
  INDEX idx_user_id (user_id),
  INDEX idx_city_id (city_id)
);

-- User follows other users
CREATE TABLE IF NOT EXISTS user_follows (
  id INT AUTO_INCREMENT PRIMARY KEY,
  follower_id INT NOT NULL,
  followed_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (followed_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_follower_followed (follower_id, followed_id),
  INDEX idx_follower_id (follower_id),
  INDEX idx_followed_id (followed_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('post_like', 'comment', 'follow', 'mention', 'reply', 'system') NOT NULL,
  sender_id INT,
  post_id INT,
  comment_id INT,
  province_id INT,
  city_id INT,
  content TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE SET NULL,
  FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE SET NULL,
  FOREIGN KEY (province_id) REFERENCES provinces(id) ON DELETE SET NULL,
  FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reporter_id INT NOT NULL,
  reported_user_id INT,
  post_id INT,
  comment_id INT,
  reason ENUM('spam', 'harassment', 'inappropriate', 'violence', 'other') NOT NULL,
  details TEXT,
  status ENUM('pending', 'resolved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  resolved_by INT,
  FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reported_user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE SET NULL,
  FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE SET NULL,
  FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_reporter_id (reporter_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- User sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  session_token VARCHAR(255) NOT NULL,
  device_info TEXT,
  ip_address VARCHAR(45),
  location VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_session_token (session_token),
  INDEX idx_expires_at (expires_at)
);

-- Metrics/Statistics table
CREATE TABLE IF NOT EXISTS metrics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  province_id INT,
  city_id INT,
  post_id INT,
  metric_type ENUM('views', 'visitors', 'engagement') NOT NULL,
  count INT DEFAULT 0,
  date DATE NOT NULL,
  FOREIGN KEY (province_id) REFERENCES provinces(id) ON DELETE CASCADE,
  FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  UNIQUE KEY unique_metric (province_id, city_id, post_id, metric_type, date),
  INDEX idx_date (date)
);

-- Tags table for posts (optional)
CREATE TABLE IF NOT EXISTS tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_name (name)
);

-- Post-Tag relationships
CREATE TABLE IF NOT EXISTS post_tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  tag_id INT NOT NULL,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
  UNIQUE KEY unique_post_tag (post_id, tag_id),
  INDEX idx_post_id (post_id),
  INDEX idx_tag_id (tag_id)
);

-- Sample data: Provinces
INSERT INTO provinces (name, description, image_url) VALUES
('Metro Manila', 'The National Capital Region and largest urban area in the Philippines', 'https://images.unsplash.com/photo-1573832035811-218f5113ffdc?q=80&w=1000'),
('Cebu', 'Province in Central Visayas known for beaches and historical sites', 'https://images.unsplash.com/photo-1597435877855-0cdf75885cd8?q=80&w=1000'),
('Davao', 'Major province in Mindanao and home to Mount Apo', 'https://images.unsplash.com/photo-1673709897735-d5940be03b93?q=80&w=1000'),
('Batangas', 'Province near Manila known for beaches and diving spots', 'https://images.unsplash.com/photo-1629447236518-d2f70561a33a?q=80&w=1000'),
('Palawan', 'Island province known for pristine beaches and natural wonders', 'https://images.unsplash.com/photo-1565180742034-32a5b941691c?q=80&w=1000'),
('Ilocos Norte', 'Northern province known for heritage sites and windmills', 'https://images.unsplash.com/photo-1541776059735-1befc8ba3e40?q=80&w=1000'),
('Aklan', 'Province in Western Visayas, home to Boracay Island', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000'),
('Laguna', 'Province south of Manila known for hot springs and waterfalls', 'https://images.unsplash.com/photo-1600583696773-472aafd3dd6c?q=80&w=1000');

-- Sample data: Cities for Metro Manila
INSERT INTO cities (province_id, name) VALUES
(1, 'Manila'),
(1, 'Makati'),
(1, 'Quezon City'),
(1, 'Taguig'),
(1, 'Pasig');

-- Sample data: Cities for Cebu
INSERT INTO cities (province_id, name) VALUES
(2, 'Cebu City'),
(2, 'Mandaue'),
(2, 'Lapu-Lapu'),
(2, 'Talisay');

-- Sample data: Cities for Davao
INSERT INTO cities (province_id, name) VALUES
(3, 'Davao City'),
(3, 'Tagum'),
(3, 'Digos');

-- Sample data: Cities for Batangas
INSERT INTO cities (province_id, name) VALUES
(4, 'Batangas City'),
(4, 'Lipa'),
(4, 'Nasugbu'),
(4, 'Calatagan');

-- Create a stored procedure to update post vote counts
DELIMITER $$
CREATE PROCEDURE update_post_votes(IN post_id_param INT)
BEGIN
    -- Calculate the new vote count
    UPDATE posts SET votes = (
        SELECT COALESCE(SUM(
            CASE 
                WHEN vote_type = 'upvote' THEN 1
                WHEN vote_type = 'downvote' THEN -1
                ELSE 0
            END
        ), 0)
        FROM post_votes 
        WHERE post_id = post_id_param
    )
    WHERE id = post_id_param;
END$$
DELIMITER ;

-- Create a stored procedure to update comment vote counts
DELIMITER $$
CREATE PROCEDURE update_comment_votes(IN comment_id_param INT)
BEGIN
    -- Calculate the new vote count
    UPDATE comments SET votes = (
        SELECT COALESCE(SUM(
            CASE 
                WHEN vote_type = 'upvote' THEN 1
                WHEN vote_type = 'downvote' THEN -1
                ELSE 0
            END
        ), 0)
        FROM comment_votes 
        WHERE comment_id = comment_id_param
    )
    WHERE id = comment_id_param;
END$$
DELIMITER ;

-- Create a trigger to update post vote counts after insert
DELIMITER $$
CREATE TRIGGER after_post_vote_insert
AFTER INSERT ON post_votes
FOR EACH ROW
BEGIN
    CALL update_post_votes(NEW.post_id);
END$$
DELIMITER ;

-- Create a trigger to update post vote counts after update
DELIMITER $$
CREATE TRIGGER after_post_vote_update
AFTER UPDATE ON post_votes
FOR EACH ROW
BEGIN
    CALL update_post_votes(NEW.post_id);
END$$
DELIMITER ;

-- Create a trigger to update post vote counts after delete
DELIMITER $$
CREATE TRIGGER after_post_vote_delete
AFTER DELETE ON post_votes
FOR EACH ROW
BEGIN
    CALL update_post_votes(OLD.post_id);
END$$
DELIMITER ;

-- Create a trigger to update comment vote counts after insert
DELIMITER $$
CREATE TRIGGER after_comment_vote_insert
AFTER INSERT ON comment_votes
FOR EACH ROW
BEGIN
    CALL update_comment_votes(NEW.comment_id);
END$$
DELIMITER ;

-- Create a trigger to update comment vote counts after update
DELIMITER $$
CREATE TRIGGER after_comment_vote_update
AFTER UPDATE ON comment_votes
FOR EACH ROW
BEGIN
    CALL update_comment_votes(NEW.comment_id);
END$$
DELIMITER ;

-- Create a trigger to update comment vote counts after delete
DELIMITER $$
CREATE TRIGGER after_comment_vote_delete
AFTER DELETE ON comment_votes
FOR EACH ROW
BEGIN
    CALL update_comment_votes(OLD.comment_id);
END$$
DELIMITER ;

-- Create a trigger to update comment count on posts
DELIMITER $$
CREATE TRIGGER after_comment_insert
AFTER INSERT ON comments
FOR EACH ROW
BEGIN
    UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
END$$
DELIMITER ;

-- Trigger for when a comment is deleted
DELIMITER $$
CREATE TRIGGER after_comment_delete
AFTER UPDATE ON comments
FOR EACH ROW
BEGIN
    IF NEW.is_deleted = TRUE AND OLD.is_deleted = FALSE THEN
        UPDATE posts SET comment_count = comment_count - 1 WHERE id = NEW.post_id;
    END IF;
END$$
DELIMITER ;

-- Create function to calculate user karma
DELIMITER $$
CREATE FUNCTION calculate_user_karma(user_id_param INT) RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE post_karma INT;
    DECLARE comment_karma INT;
    DECLARE total_karma INT;
    
    -- Calculate karma from posts
    SELECT COALESCE(SUM(votes), 0) INTO post_karma
    FROM posts
    WHERE user_id = user_id_param AND is_deleted = FALSE;
    
    -- Calculate karma from comments
    SELECT COALESCE(SUM(votes), 0) INTO comment_karma
    FROM comments
    WHERE user_id = user_id_param AND is_deleted = FALSE;
    
    -- Calculate total karma
    SET total_karma = post_karma + comment_karma;
    
    RETURN total_karma;
END$$
DELIMITER ;

-- Create view for trending posts (by votes and recency)
CREATE VIEW trending_posts AS
SELECT 
    p.*,
    u.username,
    u.profile_pic,
    pr.name as province_name,
    c.name as city_name,
    (p.votes * 10 + p.comment_count * 5 - DATEDIFF(NOW(), p.created_at)) as trending_score
FROM 
    posts p
JOIN 
    users u ON p.user_id = u.id
JOIN 
    provinces pr ON p.province_id = pr.id
LEFT JOIN 
    cities c ON p.city_id = c.id
WHERE 
    p.is_deleted = FALSE
ORDER BY 
    trending_score DESC
LIMIT 100;

-- Create view for user activity feed (posts from followed provinces/cities/users)
CREATE VIEW user_activity_feed AS
SELECT DISTINCT
    p.*,
    u.username,
    u.profile_pic,
    pr.name as province_name,
    c.name as city_name,
    'post' as content_type,
    p.created_at as activity_date,
    feed_user_id
FROM 
    posts p
JOIN 
    users u ON p.user_id = u.id
JOIN 
    provinces pr ON p.province_id = pr.id
LEFT JOIN 
    cities c ON p.city_id = c.id
JOIN (
    -- This subquery sets up the specific user we're generating the feed for
    SELECT id as feed_user_id FROM users
) as feed_user 
WHERE 
    p.is_deleted = FALSE AND
    (
        -- Posts from provinces the user follows
        p.province_id IN (SELECT province_id FROM user_province_follows WHERE user_id = feed_user.feed_user_id)
        OR
        -- Posts from cities the user follows
        (p.city_id IS NOT NULL AND p.city_id IN (SELECT city_id FROM user_city_follows WHERE user_id = feed_user.feed_user_id))
        OR
        -- Posts from users the user follows
        p.user_id IN (SELECT followed_id FROM user_follows WHERE follower_id = feed_user.feed_user_id)
    )
ORDER BY
    p.created_at DESC;

-- Create indexes for full-text search
ALTER TABLE posts ADD FULLTEXT INDEX ft_posts_content (title, content);
ALTER TABLE comments ADD FULLTEXT INDEX ft_comments_content (content);
ALTER TABLE provinces ADD FULLTEXT INDEX ft_provinces (name, description);
ALTER TABLE cities ADD FULLTEXT INDEX ft_cities (name, description);
