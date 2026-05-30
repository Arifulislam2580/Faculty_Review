-- Faculty Review database schema for MySQL
-- Run this file in your MySQL/MariaDB environment.

CREATE DATABASE IF NOT EXISTS faculty_review CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE faculty_review;

-- Teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  course_code VARCHAR(50) NOT NULL,
  course_name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_course_code (course_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Teacher courses relationship
CREATE TABLE IF NOT EXISTS teacher_courses (
  teacher_id INT UNSIGNED NOT NULL,
  course_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (teacher_id, course_id),
  KEY idx_tc_course_id (course_id),
  CONSTRAINT fk_tc_teacher FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
  CONSTRAINT fk_tc_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  teacher_id INT UNSIGNED NOT NULL,
  course VARCHAR(100) NOT NULL,
  teaching_quality TINYINT UNSIGNED NOT NULL CHECK (teaching_quality BETWEEN 1 AND 5),
  behavior TINYINT UNSIGNED NOT NULL CHECK (behavior BETWEEN 1 AND 5),
  marking TINYINT UNSIGNED NOT NULL CHECK (marking BETWEEN 1 AND 5),
  communication TINYINT UNSIGNED NOT NULL CHECK (communication BETWEEN 1 AND 5),
  enthusiasm TINYINT UNSIGNED NOT NULL CHECK (enthusiasm BETWEEN 1 AND 5),
  comments TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  review_date DATE NOT NULL DEFAULT (CURRENT_DATE()),
  PRIMARY KEY (id),
  KEY idx_reviews_teacher (teacher_id),
  CONSTRAINT fk_reviews_teacher FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Optional view for average ratings per teacher
CREATE OR REPLACE VIEW teacher_rating_summary AS
SELECT
  t.id AS teacher_id,
  t.name AS teacher_name,
  t.code AS teacher_code,
  COUNT(r.id) AS review_count,
  AVG((r.teaching_quality + r.behavior + r.marking + r.communication + r.enthusiasm) / 5) AS average_rating
FROM teachers t
LEFT JOIN reviews r ON r.teacher_id = t.id
GROUP BY t.id, t.name, t.code;

-- Sample teacher records
INSERT INTO teachers (name, code) VALUES
('Dr. Md. Afzal Hossain', 'CBA_DAH'),
('Mr. Hasan Moudud', 'CBA_MHM'),
('Ms. Taslima Khatun', 'CBA_MTK'),
('Sunan Islam', 'CBA_SI'),
('Ashish Basak', 'CBA_AB'),
('Mr. Abdullah Al Yousuf Khan', 'CBA_AYK'),
('Dr. Md. Moniruzzaman', 'CBA_DMM'),
('Mr. Swapan Kumar Saha', 'CBA_SS');

-- Sample course records
INSERT INTO courses (course_code, course_name) VALUES
('ACC101', 'ACC 101'),
('ACC300', 'ACC 300'),
('ACC303', 'ACC 303'),
('ACC1305', 'ACC 1305'),
('ACC201', 'ACC 201'),
('ACC40', 'ACC 40'),
('ACC304', 'ACC 304'),
('ACC403', 'ACC 403'),
('ACC404', 'ACC 404');

-- Sample teacher -> course assignments
INSERT IGNORE INTO teacher_courses (teacher_id, course_id)
SELECT t.id, c.id
FROM teachers t
JOIN courses c ON c.course_name = 'ACC 101' AND t.code IN ('CBA_DAH', 'CBA_MHM', 'CBA_MTK', 'CBA_SI')
UNION ALL
SELECT t.id, c.id
FROM teachers t
JOIN courses c ON c.course_name = 'ACC 300' AND t.code IN ('CBA_DAH', 'CBA_DMM')
UNION ALL
SELECT t.id, c.id
FROM teachers t
JOIN courses c ON c.course_name = 'ACC 303' AND t.code IN ('CBA_MTK', 'CBA_DMM')
UNION ALL
SELECT t.id, c.id
FROM teachers t
JOIN courses c ON c.course_name = 'ACC 1305' AND t.code IN ('CBA_SI', 'CBA_AB', 'CBA_AYK')
UNION ALL
SELECT t.id, c.id
FROM teachers t
JOIN courses c ON c.course_name = 'ACC 201' AND t.code = 'CBA_SI'
UNION ALL
SELECT t.id, c.id
FROM teachers t
JOIN courses c ON c.course_name = 'ACC 40' AND t.code = 'CBA_SI'
UNION ALL
SELECT t.id, c.id
FROM teachers t
JOIN courses c ON c.course_name = 'ACC 304' AND t.code IN ('CBA_AB', 'CBA_SS')
UNION ALL
SELECT t.id, c.id
FROM teachers t
JOIN courses c ON c.course_name = 'ACC 403' AND t.code = 'CBA_AB'
UNION ALL
SELECT t.id, c.id
FROM teachers t
JOIN courses c ON c.course_name = 'ACC 404' AND t.code = 'CBA_SS';
