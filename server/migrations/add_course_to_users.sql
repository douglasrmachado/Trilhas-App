-- Migration: Adicionar campo 'course' à tabela users
USE trilhas;

-- Adicionar coluna course (ignora erro se já existir)
ALTER TABLE users 
ADD COLUMN course ENUM('Informática','Meio Ambiente','Produção Cultural','Mecânica') NULL 
AFTER role;

