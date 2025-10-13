-- Migração: Sistema Completo de Trilhas
USE trilhas;

-- Tabela de Trilhas
CREATE TABLE IF NOT EXISTS trails (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(10) DEFAULT '📚',
  category VARCHAR(50) NOT NULL,
  difficulty ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
  total_xp INT DEFAULT 0,
  course ENUM('base', 'Informática', 'Meio Ambiente', 'Produção Cultural', 'Mecânica') DEFAULT 'base',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_category (category),
  INDEX idx_difficulty (difficulty),
  INDEX idx_course (course)
);

-- Tabela de Módulos
CREATE TABLE IF NOT EXISTS modules (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  trail_id INT UNSIGNED NOT NULL,
  title VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  order_index INT NOT NULL,
  xp_reward INT DEFAULT 100,
  resources_count INT DEFAULT 0,
  badge VARCHAR(10) DEFAULT '🏅',
  content TEXT,
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (trail_id) REFERENCES trails(id) ON DELETE CASCADE,
  INDEX idx_trail_order (trail_id, order_index)
);

-- Tabela de Progresso do Usuário
CREATE TABLE IF NOT EXISTS user_progress (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  module_id INT UNSIGNED NOT NULL,
  trail_id INT UNSIGNED NOT NULL,
  status ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started',
  xp_earned INT DEFAULT 0,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY unique_user_module (user_id, module_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
  FOREIGN KEY (trail_id) REFERENCES trails(id) ON DELETE CASCADE,
  INDEX idx_user_trail (user_id, trail_id),
  INDEX idx_user_status (user_id, status)
);

-- Tabela de Conquistas
CREATE TABLE IF NOT EXISTS achievements (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(10) DEFAULT '🏆',
  type ENUM('module', 'trail', 'streak', 'special') DEFAULT 'module',
  requirement_value INT DEFAULT 1,
  xp_reward INT DEFAULT 50,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_type (type)
);

-- Tabela de Conquistas do Usuário
CREATE TABLE IF NOT EXISTS user_achievements (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  achievement_id INT UNSIGNED NOT NULL,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY unique_user_achievement (user_id, achievement_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
  INDEX idx_user (user_id)
);

-- Tabela de XP do Usuário (consolidado)
CREATE TABLE IF NOT EXISTS user_xp (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  total_xp INT DEFAULT 0,
  level INT DEFAULT 1,
  streak_days INT DEFAULT 0,
  last_activity_date DATE NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY unique_user (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

