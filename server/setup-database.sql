-- Script de configuração inicial do banco de dados Trilhas
-- Execute este script no MySQL Workbench ou no Prompt de Comando do MySQL

-- Criar o banco de dados
CREATE DATABASE IF NOT EXISTS trilhas DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar o banco de dados
USE trilhas;

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  matricula VARCHAR(64) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student','professor') NOT NULL DEFAULT 'student',
  profile_photo TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_email (email),
  INDEX idx_matricula (matricula),
  INDEX idx_role (role)
);

-- As tabelas 'submissions' e 'notifications' serão criadas automaticamente
-- quando você iniciar o servidor pela primeira vez!

SELECT '✅ Banco de dados configurado com sucesso!' AS status;
SELECT 'ℹ️  As outras tabelas serão criadas automaticamente ao iniciar o servidor' AS info;

