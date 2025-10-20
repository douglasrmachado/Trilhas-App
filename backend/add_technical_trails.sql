-- Script para adicionar trilhas técnicas para todos os cursos
-- Execute este script no MySQL Workbench se o banco já existir

USE trilhas;

-- Inserir trilhas técnicas para Mecânica
INSERT INTO trails (title, description, icon, category, difficulty, total_xp, course) VALUES
('Desenho Técnico', 'Fundamentos de desenho técnico', '📐', 'Técnica', 'intermediate', 400, 'Mecânica'),
('Resistência dos Materiais', 'Propriedades e comportamento dos materiais', '🔧', 'Técnica', 'intermediate', 400, 'Mecânica'),
('Processos de Fabricação', 'Técnicas de produção industrial', '⚙️', 'Técnica', 'intermediate', 400, 'Mecânica'),
('Manutenção Industrial', 'Gestão e manutenção de equipamentos', '🔨', 'Técnica', 'intermediate', 400, 'Mecânica');

-- Inserir trilhas técnicas para Meio Ambiente
INSERT INTO trails (title, description, icon, category, difficulty, total_xp, course) VALUES
('Gestão Ambiental', 'Administração de recursos ambientais', '🌱', 'Técnica', 'intermediate', 400, 'Meio Ambiente'),
('Química Ambiental', 'Processos químicos no ambiente', '🧪', 'Técnica', 'intermediate', 400, 'Meio Ambiente'),
('Ecologia', 'Estudo das relações ecológicas', '🦋', 'Técnica', 'intermediate', 400, 'Meio Ambiente'),
('Recursos Hídricos', 'Gestão e conservação da água', '💧', 'Técnica', 'intermediate', 400, 'Meio Ambiente');

-- Inserir trilhas técnicas para Produção Cultural
INSERT INTO trails (title, description, icon, category, difficulty, total_xp, course) VALUES
('História da Arte', 'Evolução das expressões artísticas', '🎨', 'Técnica', 'intermediate', 400, 'Produção Cultural'),
('Teoria da Comunicação', 'Fundamentos da comunicação', '📡', 'Técnica', 'intermediate', 400, 'Produção Cultural'),
('Produção Audiovisual', 'Criação de conteúdo audiovisual', '🎬', 'Técnica', 'intermediate', 400, 'Produção Cultural'),
('Gestão Cultural', 'Administração de projetos culturais', '🎭', 'Técnica', 'intermediate', 400, 'Produção Cultural');

-- Obter IDs das trilhas recém-criadas para inserir módulos
SET @desenho_tecnico_id = (SELECT id FROM trails WHERE title = 'Desenho Técnico' AND course = 'Mecânica');
SET @resistencia_materiais_id = (SELECT id FROM trails WHERE title = 'Resistência dos Materiais' AND course = 'Mecânica');
SET @processos_fabricacao_id = (SELECT id FROM trails WHERE title = 'Processos de Fabricação' AND course = 'Mecânica');
SET @manutencao_industrial_id = (SELECT id FROM trails WHERE title = 'Manutenção Industrial' AND course = 'Mecânica');

SET @gestao_ambiental_id = (SELECT id FROM trails WHERE title = 'Gestão Ambiental' AND course = 'Meio Ambiente');
SET @quimica_ambiental_id = (SELECT id FROM trails WHERE title = 'Química Ambiental' AND course = 'Meio Ambiente');
SET @ecologia_id = (SELECT id FROM trails WHERE title = 'Ecologia' AND course = 'Meio Ambiente');
SET @recursos_hidricos_id = (SELECT id FROM trails WHERE title = 'Recursos Hídricos' AND course = 'Meio Ambiente');

SET @historia_arte_id = (SELECT id FROM trails WHERE title = 'História da Arte' AND course = 'Produção Cultural');
SET @teoria_comunicacao_id = (SELECT id FROM trails WHERE title = 'Teoria da Comunicação' AND course = 'Produção Cultural');
SET @producao_audiovisual_id = (SELECT id FROM trails WHERE title = 'Produção Audiovisual' AND course = 'Produção Cultural');
SET @gestao_cultural_id = (SELECT id FROM trails WHERE title = 'Gestão Cultural' AND course = 'Produção Cultural');

-- Inserir módulos para trilhas técnicas de Mecânica
INSERT INTO modules (trail_id, title, description, order_index, xp_reward, badge) VALUES
-- Desenho Técnico
(@desenho_tecnico_id, 'Vistas e Projeções', 'Fundamentos de representação', 1, 100, '🥇'),
(@desenho_tecnico_id, 'Cortes e Seções', 'Técnicas de corte', 2, 100, '🥈'),
(@desenho_tecnico_id, 'Tolerâncias', 'Especificações dimensionais', 3, 100, '🥉'),
(@desenho_tecnico_id, 'Desenho Assistido', 'CAD e ferramentas digitais', 4, 100, '🏆'),
-- Resistência dos Materiais
(@resistencia_materiais_id, 'Propriedades dos Materiais', 'Características físicas', 1, 100, '🥇'),
(@resistencia_materiais_id, 'Tensões e Deformações', 'Comportamento sob carga', 2, 100, '🥈'),
(@resistencia_materiais_id, 'Flexão e Torção', 'Esforços combinados', 3, 100, '🥉'),
(@resistencia_materiais_id, 'Fadiga dos Materiais', 'Comportamento cíclico', 4, 100, '🏆'),
-- Processos de Fabricação
(@processos_fabricacao_id, 'Usinagem', 'Processos de remoção de material', 1, 100, '🥇'),
(@processos_fabricacao_id, 'Soldagem', 'Técnicas de união', 2, 100, '🥈'),
(@processos_fabricacao_id, 'Conformação', 'Processos de deformação', 3, 100, '🥉'),
(@processos_fabricacao_id, 'Tratamentos Térmicos', 'Modificação de propriedades', 4, 100, '🏆'),
-- Manutenção Industrial
(@manutencao_industrial_id, 'Planejamento de Manutenção', 'Estratégias preventivas', 1, 100, '🥇'),
(@manutencao_industrial_id, 'Diagnóstico de Falhas', 'Identificação de problemas', 2, 100, '🥈'),
(@manutencao_industrial_id, 'Manutenção Preditiva', 'Monitoramento avançado', 3, 100, '🥉'),
(@manutencao_industrial_id, 'Gestão de Ativos', 'Otimização de recursos', 4, 100, '🏆');

-- Inserir módulos para trilhas técnicas de Meio Ambiente
INSERT INTO modules (trail_id, title, description, order_index, xp_reward, badge) VALUES
-- Gestão Ambiental
(@gestao_ambiental_id, 'Sistemas de Gestão', 'ISO 14001 e certificações', 1, 100, '🥇'),
(@gestao_ambiental_id, 'Auditoria Ambiental', 'Avaliação de conformidade', 2, 100, '🥈'),
(@gestao_ambiental_id, 'Licenciamento Ambiental', 'Processos regulatórios', 3, 100, '🥉'),
(@gestao_ambiental_id, 'Sustentabilidade', 'Desenvolvimento sustentável', 4, 100, '🏆'),
-- Química Ambiental
(@quimica_ambiental_id, 'Poluentes Químicos', 'Tipos e características', 1, 100, '🥇'),
(@quimica_ambiental_id, 'Tratamento de Efluentes', 'Processos de purificação', 2, 100, '🥈'),
(@quimica_ambiental_id, 'Análise Ambiental', 'Técnicas de monitoramento', 3, 100, '🥉'),
(@quimica_ambiental_id, 'Remediação', 'Recuperação de áreas contaminadas', 4, 100, '🏆'),
-- Ecologia
(@ecologia_id, 'Ecossistemas', 'Estrutura e funcionamento', 1, 100, '🥇'),
(@ecologia_id, 'Biodiversidade', 'Conservação da vida', 2, 100, '🥈'),
(@ecologia_id, 'Ecologia Urbana', 'Ambiente urbano', 3, 100, '🥉'),
(@ecologia_id, 'Restauração Ecológica', 'Recuperação de ecossistemas', 4, 100, '🏆'),
-- Recursos Hídricos
(@recursos_hidricos_id, 'Ciclo Hidrológico', 'Dinâmica da água', 1, 100, '🥇'),
(@recursos_hidricos_id, 'Qualidade da Água', 'Parâmetros e monitoramento', 2, 100, '🥈'),
(@recursos_hidricos_id, 'Tratamento de Água', 'Processos de purificação', 3, 100, '🥉'),
(@recursos_hidricos_id, 'Gestão de Bacias', 'Planejamento hidrológico', 4, 100, '🏆');

-- Inserir módulos para trilhas técnicas de Produção Cultural
INSERT INTO modules (trail_id, title, description, order_index, xp_reward, badge) VALUES
-- História da Arte
(@historia_arte_id, 'Arte Antiga', 'Civilizações clássicas', 1, 100, '🥇'),
(@historia_arte_id, 'Arte Medieval', 'Idade Média e Renascimento', 2, 100, '🥈'),
(@historia_arte_id, 'Arte Moderna', 'Movimentos modernos', 3, 100, '🥉'),
(@historia_arte_id, 'Arte Contemporânea', 'Expressões atuais', 4, 100, '🏆'),
-- Teoria da Comunicação
(@teoria_comunicacao_id, 'Comunicação Interpessoal', 'Relações humanas', 1, 100, '🥇'),
(@teoria_comunicacao_id, 'Comunicação de Massa', 'Mídia e sociedade', 2, 100, '🥈'),
(@teoria_comunicacao_id, 'Comunicação Digital', 'Era da informação', 3, 100, '🥉'),
(@teoria_comunicacao_id, 'Comunicação Estratégica', 'Planejamento comunicacional', 4, 100, '🏆'),
-- Produção Audiovisual
(@producao_audiovisual_id, 'Roteiro', 'Escrita para audiovisual', 1, 100, '🥇'),
(@producao_audiovisual_id, 'Direção', 'Linguagem cinematográfica', 2, 100, '🥈'),
(@producao_audiovisual_id, 'Edição', 'Pós-produção', 3, 100, '🥉'),
(@producao_audiovisual_id, 'Produção Executiva', 'Gestão de projetos', 4, 100, '🏆'),
-- Gestão Cultural
(@gestao_cultural_id, 'Políticas Culturais', 'Marco legal e institucional', 1, 100, '🥇'),
(@gestao_cultural_id, 'Captação de Recursos', 'Financiamento cultural', 2, 100, '🥈'),
(@gestao_cultural_id, 'Marketing Cultural', 'Promoção e divulgação', 3, 100, '🥉'),
(@gestao_cultural_id, 'Eventos Culturais', 'Organização e produção', 4, 100, '🏆');

-- Verificar se as trilhas foram criadas
SELECT 'Trilhas criadas com sucesso!' as status;
SELECT course, COUNT(*) as trilhas_criadas FROM trails GROUP BY course ORDER BY course;
