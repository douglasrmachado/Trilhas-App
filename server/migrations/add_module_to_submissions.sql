-- Migration: Adicionar campo module_id à tabela submissions
USE trilhas;

-- Adicionar coluna module_id para associar submissões a módulos específicos
ALTER TABLE submissions 
ADD COLUMN module_id INT UNSIGNED NULL 
AFTER subject;

-- Adicionar foreign key se a tabela modules existir
ALTER TABLE submissions
ADD CONSTRAINT fk_submissions_module
FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE SET NULL;

-- Adicionar índice para melhor performance
ALTER TABLE submissions
ADD INDEX idx_module_id (module_id);

