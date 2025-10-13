-- Seed: Dados Iniciais de Trilhas
USE trilhas;

-- ============================================================
-- TRILHAS BASE (Compartilhadas por todos os cursos)
-- ============================================================

-- Matemática Base
INSERT INTO trails (title, description, icon, category, difficulty, total_xp, course) VALUES
('Matemática', 'Fundamentos de matemática para ensino médio técnico', '🔢', 'Base', 'beginner', 400, 'base');

INSERT INTO modules (trail_id, title, description, order_index, xp_reward, resources_count, badge) VALUES
((SELECT id FROM trails WHERE title = 'Matemática' AND course = 'base'), 'Matemática I', 'Módulo I de Matemática', 1, 100, 0, '🥇'),
((SELECT id FROM trails WHERE title = 'Matemática' AND course = 'base'), 'Matemática II', 'Módulo II de Matemática', 2, 100, 0, '🥈'),
((SELECT id FROM trails WHERE title = 'Matemática' AND course = 'base'), 'Matemática III', 'Módulo III de Matemática', 3, 100, 0, '🥉'),
((SELECT id FROM trails WHERE title = 'Matemática' AND course = 'base'), 'Matemática IV', 'Módulo IV de Matemática', 4, 100, 0, '🏆');

-- Português Base
INSERT INTO trails (title, description, icon, category, difficulty, total_xp, course) VALUES
('Português', 'Língua Portuguesa e Literatura', '📝', 'Base', 'beginner', 400, 'base');

INSERT INTO modules (trail_id, title, description, order_index, xp_reward, resources_count, badge) VALUES
((SELECT id FROM trails WHERE title = 'Português' AND course = 'base'), 'Português I', 'Módulo I de Português', 1, 100, 0, '🥇'),
((SELECT id FROM trails WHERE title = 'Português' AND course = 'base'), 'Português II', 'Módulo II de Português', 2, 100, 0, '🥈'),
((SELECT id FROM trails WHERE title = 'Português' AND course = 'base'), 'Português III', 'Módulo III de Português', 3, 100, 0, '🥉'),
((SELECT id FROM trails WHERE title = 'Português' AND course = 'base'), 'Português IV', 'Módulo IV de Português', 4, 100, 0, '🏆');

-- Física Base
INSERT INTO trails (title, description, icon, category, difficulty, total_xp, course) VALUES
('Física', 'Fundamentos de Física', '⚛️', 'Base', 'beginner', 400, 'base');

INSERT INTO modules (trail_id, title, description, order_index, xp_reward, resources_count, badge) VALUES
((SELECT id FROM trails WHERE title = 'Física' AND course = 'base'), 'Física I', 'Módulo I de Física', 1, 100, 0, '🥇'),
((SELECT id FROM trails WHERE title = 'Física' AND course = 'base'), 'Física II', 'Módulo II de Física', 2, 100, 0, '🥈'),
((SELECT id FROM trails WHERE title = 'Física' AND course = 'base'), 'Física III', 'Módulo III de Física', 3, 100, 0, '🥉'),
((SELECT id FROM trails WHERE title = 'Física' AND course = 'base'), 'Física IV', 'Módulo IV de Física', 4, 100, 0, '🏆');

-- Artes Base
INSERT INTO trails (title, description, icon, category, difficulty, total_xp, course) VALUES
('Artes', 'Artes e Cultura', '🎨', 'Base', 'beginner', 400, 'base');

INSERT INTO modules (trail_id, title, description, order_index, xp_reward, resources_count, badge) VALUES
((SELECT id FROM trails WHERE title = 'Artes' AND course = 'base'), 'Artes I', 'Módulo I de Artes', 1, 100, 0, '🥇'),
((SELECT id FROM trails WHERE title = 'Artes' AND course = 'base'), 'Artes II', 'Módulo II de Artes', 2, 100, 0, '🥈'),
((SELECT id FROM trails WHERE title = 'Artes' AND course = 'base'), 'Artes III', 'Módulo III de Artes', 3, 100, 0, '🥉'),
((SELECT id FROM trails WHERE title = 'Artes' AND course = 'base'), 'Artes IV', 'Módulo IV de Artes', 4, 100, 0, '🏆');

-- Educação Física Base
INSERT INTO trails (title, description, icon, category, difficulty, total_xp, course) VALUES
('Educação Física', 'Educação Física e Saúde', '⚽', 'Base', 'beginner', 400, 'base');

INSERT INTO modules (trail_id, title, description, order_index, xp_reward, resources_count, badge) VALUES
((SELECT id FROM trails WHERE title = 'Educação Física' AND course = 'base'), 'Educação Física I', 'Módulo I de Educação Física', 1, 100, 0, '🥇'),
((SELECT id FROM trails WHERE title = 'Educação Física' AND course = 'base'), 'Educação Física II', 'Módulo II de Educação Física', 2, 100, 0, '🥈'),
((SELECT id FROM trails WHERE title = 'Educação Física' AND course = 'base'), 'Educação Física III', 'Módulo III de Educação Física', 3, 100, 0, '🥉'),
((SELECT id FROM trails WHERE title = 'Educação Física' AND course = 'base'), 'Educação Física IV', 'Módulo IV de Educação Física', 4, 100, 0, '🏆');

-- Biologia Base
INSERT INTO trails (title, description, icon, category, difficulty, total_xp, course) VALUES
('Biologia', 'Ciências Biológicas', '🧬', 'Base', 'beginner', 400, 'base');

INSERT INTO modules (trail_id, title, description, order_index, xp_reward, resources_count, badge) VALUES
((SELECT id FROM trails WHERE title = 'Biologia' AND course = 'base'), 'Biologia I', 'Módulo I de Biologia', 1, 100, 0, '🥇'),
((SELECT id FROM trails WHERE title = 'Biologia' AND course = 'base'), 'Biologia II', 'Módulo II de Biologia', 2, 100, 0, '🥈'),
((SELECT id FROM trails WHERE title = 'Biologia' AND course = 'base'), 'Biologia III', 'Módulo III de Biologia', 3, 100, 0, '🥉'),
((SELECT id FROM trails WHERE title = 'Biologia' AND course = 'base'), 'Biologia IV', 'Módulo IV de Biologia', 4, 100, 0, '🏆');

-- Sociologia Base
INSERT INTO trails (title, description, icon, category, difficulty, total_xp, course) VALUES
('Sociologia', 'Sociedade e Cultura', '👥', 'Base', 'beginner', 400, 'base');

INSERT INTO modules (trail_id, title, description, order_index, xp_reward, resources_count, badge) VALUES
((SELECT id FROM trails WHERE title = 'Sociologia' AND course = 'base'), 'Sociologia I', 'Módulo I de Sociologia', 1, 100, 0, '🥇'),
((SELECT id FROM trails WHERE title = 'Sociologia' AND course = 'base'), 'Sociologia II', 'Módulo II de Sociologia', 2, 100, 0, '🥈'),
((SELECT id FROM trails WHERE title = 'Sociologia' AND course = 'base'), 'Sociologia III', 'Módulo III de Sociologia', 3, 100, 0, '🥉'),
((SELECT id FROM trails WHERE title = 'Sociologia' AND course = 'base'), 'Sociologia IV', 'Módulo IV de Sociologia', 4, 100, 0, '🏆');

-- Filosofia Base
INSERT INTO trails (title, description, icon, category, difficulty, total_xp, course) VALUES
('Filosofia', 'Pensamento e Filosofia', '🤔', 'Base', 'beginner', 400, 'base');

INSERT INTO modules (trail_id, title, description, order_index, xp_reward, resources_count, badge) VALUES
((SELECT id FROM trails WHERE title = 'Filosofia' AND course = 'base'), 'Filosofia I', 'Módulo I de Filosofia', 1, 100, 0, '🥇'),
((SELECT id FROM trails WHERE title = 'Filosofia' AND course = 'base'), 'Filosofia II', 'Módulo II de Filosofia', 2, 100, 0, '🥈'),
((SELECT id FROM trails WHERE title = 'Filosofia' AND course = 'base'), 'Filosofia III', 'Módulo III de Filosofia', 3, 100, 0, '🥉'),
((SELECT id FROM trails WHERE title = 'Filosofia' AND course = 'base'), 'Filosofia IV', 'Módulo IV de Filosofia', 4, 100, 0, '🏆');

-- Química Base
INSERT INTO trails (title, description, icon, category, difficulty, total_xp, course) VALUES
('Química', 'Fundamentos de Química', '🧪', 'Base', 'beginner', 400, 'base');

INSERT INTO modules (trail_id, title, description, order_index, xp_reward, resources_count, badge) VALUES
((SELECT id FROM trails WHERE title = 'Química' AND course = 'base'), 'Química I', 'Módulo I de Química', 1, 100, 0, '🥇'),
((SELECT id FROM trails WHERE title = 'Química' AND course = 'base'), 'Química II', 'Módulo II de Química', 2, 100, 0, '🥈'),
((SELECT id FROM trails WHERE title = 'Química' AND course = 'base'), 'Química III', 'Módulo III de Química', 3, 100, 0, '🥉'),
((SELECT id FROM trails WHERE title = 'Química' AND course = 'base'), 'Química IV', 'Módulo IV de Química', 4, 100, 0, '🏆');

-- ============================================================
-- TRILHAS TÉCNICAS - INFORMÁTICA
-- ============================================================

-- Lógica de Programação
INSERT INTO trails (title, description, icon, category, difficulty, total_xp, course) VALUES
('Lógica de Programação', 'Fundamentos de lógica e algoritmos', '💻', 'Técnica', 'intermediate', 400, 'Informática');

INSERT INTO modules (trail_id, title, description, order_index, xp_reward, resources_count, badge) VALUES
((SELECT id FROM trails WHERE title = 'Lógica de Programação'), 'Lógica de Programação I', 'Módulo I de Lógica de Programação', 1, 100, 0, '🥇'),
((SELECT id FROM trails WHERE title = 'Lógica de Programação'), 'Lógica de Programação II', 'Módulo II de Lógica de Programação', 2, 100, 0, '🥈'),
((SELECT id FROM trails WHERE title = 'Lógica de Programação'), 'Lógica de Programação III', 'Módulo III de Lógica de Programação', 3, 100, 0, '🥉'),
((SELECT id FROM trails WHERE title = 'Lógica de Programação'), 'Lógica de Programação IV', 'Módulo IV de Lógica de Programação', 4, 100, 0, '🏆');

-- Banco de Dados
INSERT INTO trails (title, description, icon, category, difficulty, total_xp, course) VALUES
('Banco de Dados', 'Modelagem e gestão de dados', '🗄️', 'Técnica', 'intermediate', 400, 'Informática');

INSERT INTO modules (trail_id, title, description, order_index, xp_reward, resources_count, badge) VALUES
((SELECT id FROM trails WHERE title = 'Banco de Dados'), 'Banco de Dados I', 'Módulo I de Banco de Dados', 1, 100, 0, '🥇'),
((SELECT id FROM trails WHERE title = 'Banco de Dados'), 'Banco de Dados II', 'Módulo II de Banco de Dados', 2, 100, 0, '🥈'),
((SELECT id FROM trails WHERE title = 'Banco de Dados'), 'Banco de Dados III', 'Módulo III de Banco de Dados', 3, 100, 0, '🥉'),
((SELECT id FROM trails WHERE title = 'Banco de Dados'), 'Banco de Dados IV', 'Módulo IV de Banco de Dados', 4, 100, 0, '🏆');

-- Estrutura de Dados
INSERT INTO trails (title, description, icon, category, difficulty, total_xp, course) VALUES
('Estrutura de Dados', 'Organização e manipulação de dados', '📊', 'Técnica', 'intermediate', 400, 'Informática');

INSERT INTO modules (trail_id, title, description, order_index, xp_reward, resources_count, badge) VALUES
((SELECT id FROM trails WHERE title = 'Estrutura de Dados'), 'Estrutura de Dados I', 'Módulo I de Estrutura de Dados', 1, 100, 0, '🥇'),
((SELECT id FROM trails WHERE title = 'Estrutura de Dados'), 'Estrutura de Dados II', 'Módulo II de Estrutura de Dados', 2, 100, 0, '🥈'),
((SELECT id FROM trails WHERE title = 'Estrutura de Dados'), 'Estrutura de Dados III', 'Módulo III de Estrutura de Dados', 3, 100, 0, '🥉'),
((SELECT id FROM trails WHERE title = 'Estrutura de Dados'), 'Estrutura de Dados IV', 'Módulo IV de Estrutura de Dados', 4, 100, 0, '🏆');

-- Desenvolvimento Web
INSERT INTO trails (title, description, icon, category, difficulty, total_xp, course) VALUES
('Desenvolvimento Web', 'Criação de aplicações web modernas', '🌐', 'Técnica', 'intermediate', 400, 'Informática');

INSERT INTO modules (trail_id, title, description, order_index, xp_reward, resources_count, badge) VALUES
((SELECT id FROM trails WHERE title = 'Desenvolvimento Web'), 'Desenvolvimento Web I', 'Módulo I de Desenvolvimento Web', 1, 100, 0, '🥇'),
((SELECT id FROM trails WHERE title = 'Desenvolvimento Web'), 'Desenvolvimento Web II', 'Módulo II de Desenvolvimento Web', 2, 100, 0, '🥈'),
((SELECT id FROM trails WHERE title = 'Desenvolvimento Web'), 'Desenvolvimento Web III', 'Módulo III de Desenvolvimento Web', 3, 100, 0, '🥉'),
((SELECT id FROM trails WHERE title = 'Desenvolvimento Web'), 'Desenvolvimento Web IV', 'Módulo IV de Desenvolvimento Web', 4, 100, 0, '🏆');

-- Arquitetura de Computadores
INSERT INTO trails (title, description, icon, category, difficulty, total_xp, course) VALUES
('Arquitetura de Computadores', 'Hardware e organização de computadores', '🖥️', 'Técnica', 'intermediate', 400, 'Informática');

INSERT INTO modules (trail_id, title, description, order_index, xp_reward, resources_count, badge) VALUES
((SELECT id FROM trails WHERE title = 'Arquitetura de Computadores'), 'Arquitetura de Computadores I', 'Módulo I de Arquitetura de Computadores', 1, 100, 0, '🥇'),
((SELECT id FROM trails WHERE title = 'Arquitetura de Computadores'), 'Arquitetura de Computadores II', 'Módulo II de Arquitetura de Computadores', 2, 100, 0, '🥈'),
((SELECT id FROM trails WHERE title = 'Arquitetura de Computadores'), 'Arquitetura de Computadores III', 'Módulo III de Arquitetura de Computadores', 3, 100, 0, '🥉'),
((SELECT id FROM trails WHERE title = 'Arquitetura de Computadores'), 'Arquitetura de Computadores IV', 'Módulo IV de Arquitetura de Computadores', 4, 100, 0, '🏆');

-- ============================================================
-- TRILHAS TÉCNICAS - MEIO AMBIENTE
-- ============================================================

-- Ecologia e Biodiversidade
INSERT INTO trails (title, description, icon, category, difficulty, total_xp, course) VALUES
('Ecologia e Biodiversidade', 'Estudo dos ecossistemas e preservação', '🌿', 'Técnica', 'intermediate', 400, 'Meio Ambiente');

INSERT INTO modules (trail_id, title, description, order_index, xp_reward, resources_count, badge) VALUES
((SELECT id FROM trails WHERE title = 'Ecologia e Biodiversidade'), 'Ecologia e Biodiversidade I', 'Módulo I de Ecologia e Biodiversidade', 1, 100, 0, '🥇'),
((SELECT id FROM trails WHERE title = 'Ecologia e Biodiversidade'), 'Ecologia e Biodiversidade II', 'Módulo II de Ecologia e Biodiversidade', 2, 100, 0, '🥈'),
((SELECT id FROM trails WHERE title = 'Ecologia e Biodiversidade'), 'Ecologia e Biodiversidade III', 'Módulo III de Ecologia e Biodiversidade', 3, 100, 0, '🥉'),
((SELECT id FROM trails WHERE title = 'Ecologia e Biodiversidade'), 'Ecologia e Biodiversidade IV', 'Módulo IV de Ecologia e Biodiversidade', 4, 100, 0, '🏆');

-- Gestão Ambiental
INSERT INTO trails (title, description, icon, category, difficulty, total_xp, course) VALUES
('Gestão Ambiental', 'Planejamento e gestão de recursos naturais', '♻️', 'Técnica', 'intermediate', 400, 'Meio Ambiente');

INSERT INTO modules (trail_id, title, description, order_index, xp_reward, resources_count, badge) VALUES
((SELECT id FROM trails WHERE title = 'Gestão Ambiental'), 'Gestão Ambiental I', 'Módulo I de Gestão Ambiental', 1, 100, 0, '🥇'),
((SELECT id FROM trails WHERE title = 'Gestão Ambiental'), 'Gestão Ambiental II', 'Módulo II de Gestão Ambiental', 2, 100, 0, '🥈'),
((SELECT id FROM trails WHERE title = 'Gestão Ambiental'), 'Gestão Ambiental III', 'Módulo III de Gestão Ambiental', 3, 100, 0, '🥉'),
((SELECT id FROM trails WHERE title = 'Gestão Ambiental'), 'Gestão Ambiental IV', 'Módulo IV de Gestão Ambiental', 4, 100, 0, '🏆');

-- Recursos Hídricos
INSERT INTO trails (title, description, icon, category, difficulty, total_xp, course) VALUES
('Recursos Hídricos', 'Gestão e preservação da água', '💧', 'Técnica', 'intermediate', 400, 'Meio Ambiente');

INSERT INTO modules (trail_id, title, description, order_index, xp_reward, resources_count, badge) VALUES
((SELECT id FROM trails WHERE title = 'Recursos Hídricos'), 'Recursos Hídricos I', 'Módulo I de Recursos Hídricos', 1, 100, 0, '🥇'),
((SELECT id FROM trails WHERE title = 'Recursos Hídricos'), 'Recursos Hídricos II', 'Módulo II de Recursos Hídricos', 2, 100, 0, '🥈'),
((SELECT id FROM trails WHERE title = 'Recursos Hídricos'), 'Recursos Hídricos III', 'Módulo III de Recursos Hídricos', 3, 100, 0, '🥉'),
((SELECT id FROM trails WHERE title = 'Recursos Hídricos'), 'Recursos Hídricos IV', 'Módulo IV de Recursos Hídricos', 4, 100, 0, '🏆');

-- Educação Ambiental
INSERT INTO trails (title, description, icon, category, difficulty, total_xp, course) VALUES
('Educação Ambiental', 'Conscientização e sustentabilidade', '🌎', 'Técnica', 'intermediate', 400, 'Meio Ambiente');

INSERT INTO modules (trail_id, title, description, order_index, xp_reward, resources_count, badge) VALUES
((SELECT id FROM trails WHERE title = 'Educação Ambiental'), 'Educação Ambiental I', 'Módulo I de Educação Ambiental', 1, 100, 0, '🥇'),
((SELECT id FROM trails WHERE title = 'Educação Ambiental'), 'Educação Ambiental II', 'Módulo II de Educação Ambiental', 2, 100, 0, '🥈'),
((SELECT id FROM trails WHERE title = 'Educação Ambiental'), 'Educação Ambiental III', 'Módulo III de Educação Ambiental', 3, 100, 0, '🥉'),
((SELECT id FROM trails WHERE title = 'Educação Ambiental'), 'Educação Ambiental IV', 'Módulo IV de Educação Ambiental', 4, 100, 0, '🏆');

-- Saneamento Ambiental
INSERT INTO trails (title, description, icon, category, difficulty, total_xp, course) VALUES
('Saneamento Ambiental', 'Tratamento de água e resíduos', '🚰', 'Técnica', 'intermediate', 400, 'Meio Ambiente');

INSERT INTO modules (trail_id, title, description, order_index, xp_reward, resources_count, badge) VALUES
((SELECT id FROM trails WHERE title = 'Saneamento Ambiental'), 'Saneamento Ambiental I', 'Módulo I de Saneamento Ambiental', 1, 100, 0, '🥇'),
((SELECT id FROM trails WHERE title = 'Saneamento Ambiental'), 'Saneamento Ambiental II', 'Módulo II de Saneamento Ambiental', 2, 100, 0, '🥈'),
((SELECT id FROM trails WHERE title = 'Saneamento Ambiental'), 'Saneamento Ambiental III', 'Módulo III de Saneamento Ambiental', 3, 100, 0, '🥉'),
((SELECT id FROM trails WHERE title = 'Saneamento Ambiental'), 'Saneamento Ambiental IV', 'Módulo IV de Saneamento Ambiental', 4, 100, 0, '🏆');

-- ============================================================
-- TRILHAS TÉCNICAS - PRODUÇÃO CULTURAL
-- ============================================================

-- Gestão Cultural
INSERT INTO trails (title, description, icon, category, difficulty, total_xp, course) VALUES
('Gestão Cultural', 'Planejamento e administração cultural', '🎭', 'Técnica', 'intermediate', 400, 'Produção Cultural');

INSERT INTO modules (trail_id, title, description, order_index, xp_reward, resources_count, badge) VALUES
((SELECT id FROM trails WHERE title = 'Gestão Cultural'), 'Gestão Cultural I', 'Módulo I de Gestão Cultural', 1, 100, 0, '🥇'),
((SELECT id FROM trails WHERE title = 'Gestão Cultural'), 'Gestão Cultural II', 'Módulo II de Gestão Cultural', 2, 100, 0, '🥈'),
((SELECT id FROM trails WHERE title = 'Gestão Cultural'), 'Gestão Cultural III', 'Módulo III de Gestão Cultural', 3, 100, 0, '🥉'),
((SELECT id FROM trails WHERE title = 'Gestão Cultural'), 'Gestão Cultural IV', 'Módulo IV de Gestão Cultural', 4, 100, 0, '🏆');

-- Produção Audiovisual
INSERT INTO trails (title, description, icon, category, difficulty, total_xp, course) VALUES
('Produção Audiovisual', 'Cinema, vídeo e fotografia', '🎬', 'Técnica', 'intermediate', 400, 'Produção Cultural');

INSERT INTO modules (trail_id, title, description, order_index, xp_reward, resources_count, badge) VALUES
((SELECT id FROM trails WHERE title = 'Produção Audiovisual'), 'Produção Audiovisual I', 'Módulo I de Produção Audiovisual', 1, 100, 0, '🥇'),
((SELECT id FROM trails WHERE title = 'Produção Audiovisual'), 'Produção Audiovisual II', 'Módulo II de Produção Audiovisual', 2, 100, 0, '🥈'),
((SELECT id FROM trails WHERE title = 'Produção Audiovisual'), 'Produção Audiovisual III', 'Módulo III de Produção Audiovisual', 3, 100, 0, '🥉'),
((SELECT id FROM trails WHERE title = 'Produção Audiovisual'), 'Produção Audiovisual IV', 'Módulo IV de Produção Audiovisual', 4, 100, 0, '🏆');

-- Patrimônio Cultural
INSERT INTO trails (title, description, icon, category, difficulty, total_xp, course) VALUES
('Patrimônio Cultural', 'Preservação e valorização cultural', '🏛️', 'Técnica', 'intermediate', 400, 'Produção Cultural');

INSERT INTO modules (trail_id, title, description, order_index, xp_reward, resources_count, badge) VALUES
((SELECT id FROM trails WHERE title = 'Patrimônio Cultural'), 'Patrimônio Cultural I', 'Módulo I de Patrimônio Cultural', 1, 100, 0, '🥇'),
((SELECT id FROM trails WHERE title = 'Patrimônio Cultural'), 'Patrimônio Cultural II', 'Módulo II de Patrimônio Cultural', 2, 100, 0, '🥈'),
((SELECT id FROM trails WHERE title = 'Patrimônio Cultural'), 'Patrimônio Cultural III', 'Módulo III de Patrimônio Cultural', 3, 100, 0, '🥉'),
((SELECT id FROM trails WHERE title = 'Patrimônio Cultural'), 'Patrimônio Cultural IV', 'Módulo IV de Patrimônio Cultural', 4, 100, 0, '🏆');

-- Políticas Culturais
INSERT INTO trails (title, description, icon, category, difficulty, total_xp, course) VALUES
('Políticas Culturais', 'Legislação e incentivo à cultura', '📜', 'Técnica', 'intermediate', 400, 'Produção Cultural');

INSERT INTO modules (trail_id, title, description, order_index, xp_reward, resources_count, badge) VALUES
((SELECT id FROM trails WHERE title = 'Políticas Culturais'), 'Políticas Culturais I', 'Módulo I de Políticas Culturais', 1, 100, 0, '🥇'),
((SELECT id FROM trails WHERE title = 'Políticas Culturais'), 'Políticas Culturais II', 'Módulo II de Políticas Culturais', 2, 100, 0, '🥈'),
((SELECT id FROM trails WHERE title = 'Políticas Culturais'), 'Políticas Culturais III', 'Módulo III de Políticas Culturais', 3, 100, 0, '🥉'),
((SELECT id FROM trails WHERE title = 'Políticas Culturais'), 'Políticas Culturais IV', 'Módulo IV de Políticas Culturais', 4, 100, 0, '🏆');

-- Produção de Eventos
INSERT INTO trails (title, description, icon, category, difficulty, total_xp, course) VALUES
('Produção de Eventos', 'Organização de eventos culturais', '🎪', 'Técnica', 'intermediate', 400, 'Produção Cultural');

INSERT INTO modules (trail_id, title, description, order_index, xp_reward, resources_count, badge) VALUES
((SELECT id FROM trails WHERE title = 'Produção de Eventos'), 'Produção de Eventos I', 'Módulo I de Produção de Eventos', 1, 100, 0, '🥇'),
((SELECT id FROM trails WHERE title = 'Produção de Eventos'), 'Produção de Eventos II', 'Módulo II de Produção de Eventos', 2, 100, 0, '🥈'),
((SELECT id FROM trails WHERE title = 'Produção de Eventos'), 'Produção de Eventos III', 'Módulo III de Produção de Eventos', 3, 100, 0, '🥉'),
((SELECT id FROM trails WHERE title = 'Produção de Eventos'), 'Produção de Eventos IV', 'Módulo IV de Produção de Eventos', 4, 100, 0, '🏆');

-- ============================================================
-- TRILHAS TÉCNICAS - MECÂNICA
-- ============================================================

-- Mecânica Geral
INSERT INTO trails (title, description, icon, category, difficulty, total_xp, course) VALUES
('Mecânica Geral', 'Fundamentos de mecânica aplicada', '⚙️', 'Técnica', 'intermediate', 400, 'Mecânica');

INSERT INTO modules (trail_id, title, description, order_index, xp_reward, resources_count, badge) VALUES
((SELECT id FROM trails WHERE title = 'Mecânica Geral'), 'Mecânica Geral I', 'Módulo I de Mecânica Geral', 1, 100, 0, '🥇'),
((SELECT id FROM trails WHERE title = 'Mecânica Geral'), 'Mecânica Geral II', 'Módulo II de Mecânica Geral', 2, 100, 0, '🥈'),
((SELECT id FROM trails WHERE title = 'Mecânica Geral'), 'Mecânica Geral III', 'Módulo III de Mecânica Geral', 3, 100, 0, '🥉'),
((SELECT id FROM trails WHERE title = 'Mecânica Geral'), 'Mecânica Geral IV', 'Módulo IV de Mecânica Geral', 4, 100, 0, '🏆');

-- Manutenção Automotiva
INSERT INTO trails (title, description, icon, category, difficulty, total_xp, course) VALUES
('Manutenção Automotiva', 'Manutenção de veículos automotores', '🚗', 'Técnica', 'intermediate', 400, 'Mecânica');

INSERT INTO modules (trail_id, title, description, order_index, xp_reward, resources_count, badge) VALUES
((SELECT id FROM trails WHERE title = 'Manutenção Automotiva'), 'Manutenção Automotiva I', 'Módulo I de Manutenção Automotiva', 1, 100, 0, '🥇'),
((SELECT id FROM trails WHERE title = 'Manutenção Automotiva'), 'Manutenção Automotiva II', 'Módulo II de Manutenção Automotiva', 2, 100, 0, '🥈'),
((SELECT id FROM trails WHERE title = 'Manutenção Automotiva'), 'Manutenção Automotiva III', 'Módulo III de Manutenção Automotiva', 3, 100, 0, '🥉'),
((SELECT id FROM trails WHERE title = 'Manutenção Automotiva'), 'Manutenção Automotiva IV', 'Módulo IV de Manutenção Automotiva', 4, 100, 0, '🏆');

-- Desenho Técnico
INSERT INTO trails (title, description, icon, category, difficulty, total_xp, course) VALUES
('Desenho Técnico', 'Leitura e interpretação de projetos', '📐', 'Técnica', 'intermediate', 400, 'Mecânica');

INSERT INTO modules (trail_id, title, description, order_index, xp_reward, resources_count, badge) VALUES
((SELECT id FROM trails WHERE title = 'Desenho Técnico'), 'Desenho Técnico I', 'Módulo I de Desenho Técnico', 1, 100, 0, '🥇'),
((SELECT id FROM trails WHERE title = 'Desenho Técnico'), 'Desenho Técnico II', 'Módulo II de Desenho Técnico', 2, 100, 0, '🥈'),
((SELECT id FROM trails WHERE title = 'Desenho Técnico'), 'Desenho Técnico III', 'Módulo III de Desenho Técnico', 3, 100, 0, '🥉'),
((SELECT id FROM trails WHERE title = 'Desenho Técnico'), 'Desenho Técnico IV', 'Módulo IV de Desenho Técnico', 4, 100, 0, '🏆');

-- Processos de Fabricação
INSERT INTO trails (title, description, icon, category, difficulty, total_xp, course) VALUES
('Processos de Fabricação', 'Técnicas de usinagem e fabricação', '🔧', 'Técnica', 'intermediate', 400, 'Mecânica');

INSERT INTO modules (trail_id, title, description, order_index, xp_reward, resources_count, badge) VALUES
((SELECT id FROM trails WHERE title = 'Processos de Fabricação'), 'Processos de Fabricação I', 'Módulo I de Processos de Fabricação', 1, 100, 0, '🥇'),
((SELECT id FROM trails WHERE title = 'Processos de Fabricação'), 'Processos de Fabricação II', 'Módulo II de Processos de Fabricação', 2, 100, 0, '🥈'),
((SELECT id FROM trails WHERE title = 'Processos de Fabricação'), 'Processos de Fabricação III', 'Módulo III de Processos de Fabricação', 3, 100, 0, '🥉'),
((SELECT id FROM trails WHERE title = 'Processos de Fabricação'), 'Processos de Fabricação IV', 'Módulo IV de Processos de Fabricação', 4, 100, 0, '🏆');

-- Manutenção Industrial
INSERT INTO trails (title, description, icon, category, difficulty, total_xp, course) VALUES
('Manutenção Industrial', 'Manutenção de equipamentos industriais', '🏭', 'Técnica', 'intermediate', 400, 'Mecânica');

INSERT INTO modules (trail_id, title, description, order_index, xp_reward, resources_count, badge) VALUES
((SELECT id FROM trails WHERE title = 'Manutenção Industrial'), 'Manutenção Industrial I', 'Módulo I de Manutenção Industrial', 1, 100, 0, '🥇'),
((SELECT id FROM trails WHERE title = 'Manutenção Industrial'), 'Manutenção Industrial II', 'Módulo II de Manutenção Industrial', 2, 100, 0, '🥈'),
((SELECT id FROM trails WHERE title = 'Manutenção Industrial'), 'Manutenção Industrial III', 'Módulo III de Manutenção Industrial', 3, 100, 0, '🥉'),
((SELECT id FROM trails WHERE title = 'Manutenção Industrial'), 'Manutenção Industrial IV', 'Módulo IV de Manutenção Industrial', 4, 100, 0, '🏆');

-- ============================================================
-- CONQUISTAS
-- ============================================================

INSERT INTO achievements (title, description, icon, type, requirement_value, xp_reward) VALUES
('Primeiro Passo', 'Complete seu primeiro módulo', '🎯', 'module', 1, 50),
('Dedicação', 'Complete 5 módulos', '⭐', 'module', 5, 100),
('Mestre', 'Complete 10 módulos', '🌟', 'module', 10, 200),
('Trilheiro Iniciante', 'Complete sua primeira trilha', '🏅', 'trail', 1, 150),
('Trilheiro Expert', 'Complete 3 trilhas', '🏆', 'trail', 3, 300),
('Sequência de Fogo', 'Mantenha 7 dias de sequência', '🔥', 'streak', 7, 100),
('Imparável', 'Mantenha 30 dias de sequência', '🚀', 'streak', 30, 500);


