-- Script para corrigir o ENUM da tabela submissions
-- Execute este script no MySQL Workbench se a tabela já existir

USE trilhas;

-- Alterar o ENUM da coluna content_type
ALTER TABLE submissions 
MODIFY COLUMN content_type ENUM('resumo','mapa','exercicio','apresentacao') NOT NULL;

-- Verificar se foi alterado corretamente
DESCRIBE submissions;

-- Mostrar os valores possíveis do ENUM
SHOW COLUMNS FROM submissions LIKE 'content_type';
