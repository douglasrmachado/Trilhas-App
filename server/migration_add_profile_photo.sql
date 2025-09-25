-- Migração para adicionar campo profile_photo na tabela users
-- Execute este script se a tabela users já existir

USE trilhas;

-- Adicionar coluna profile_photo se ela não existir
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS profile_photo TEXT NULL 
AFTER role;

