BEGIN;

CREATE SCHEMA IF NOT EXISTS kitchenmanager;

-- 1. Extensão da ficha técnica principal
ALTER TABLE kitchenmanager.receitas
    ADD COLUMN IF NOT EXISTS codigo VARCHAR(40),
    ADD COLUMN IF NOT EXISTS categoria VARCHAR(100),
    ADD COLUMN IF NOT EXISTS rendimento_doses NUMERIC(10,2) DEFAULT 1 CHECK (rendimento_doses > 0),
    ADD COLUMN IF NOT EXISTS peso_final_g NUMERIC(12,3),
    ADD COLUMN IF NOT EXISTS porcao_g NUMERIC(12,3),
    ADD COLUMN IF NOT EXISTS tempo_preparacao_min INTEGER DEFAULT 0 CHECK (tempo_preparacao_min >= 0),
    ADD COLUMN IF NOT EXISTS tempo_confeccao_min INTEGER DEFAULT 0 CHECK (tempo_confeccao_min >= 0),
    ADD COLUMN IF NOT EXISTS tempo_finalizacao_min INTEGER DEFAULT 0 CHECK (tempo_finalizacao_min >= 0),
    ADD COLUMN IF NOT EXISTS instrucoes TEXT,
    ADD COLUMN IF NOT EXISTS estado VARCHAR(20) DEFAULT 'rascunho'
        CHECK (estado IN ('rascunho', 'ativa', 'inativa', 'arquivada')),
    ADD COLUMN IF NOT EXISTS versao INTEGER DEFAULT 1 CHECK (versao > 0),
    ADD COLUMN IF NOT EXISTS criado_em TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS atualizado_em TIMESTAMPTZ DEFAULT NOW();

CREATE UNIQUE INDEX IF NOT EXISTS ux_receitas_codigo
    ON kitchenmanager.receitas(codigo)
    WHERE codigo IS NOT NULL;

-- 2. Ingredientes da ficha técnica
ALTER TABLE kitchenmanager.receita_ingredientes
    ADD COLUMN IF NOT EXISTS quantidade_bruta NUMERIC(14,4),
    ADD COLUMN IF NOT EXISTS quantidade_liquida NUMERIC(14,4),
    ADD COLUMN IF NOT EXISTS unidade VARCHAR(20),
    ADD COLUMN IF NOT EXISTS desperdicio_pct NUMERIC(6,3) DEFAULT 0
        CHECK (desperdicio_pct >= 0 AND desperdicio_pct <= 100),
    ADD COLUMN IF NOT EXISTS custo_unitario_snapshot NUMERIC(14,4),
    ADD COLUMN IF NOT EXISTS observacoes TEXT,
    ADD COLUMN IF NOT EXISTS ordem INTEGER DEFAULT 0;

-- 3. Processos e tempos por etapa
CREATE TABLE IF NOT EXISTS kitchenmanager.receita_processos (
    id BIGSERIAL PRIMARY KEY,
    receita_id BIGINT NOT NULL REFERENCES kitchenmanager.receitas(id) ON DELETE CASCADE,
    ordem INTEGER NOT NULL DEFAULT 1 CHECK (ordem > 0),
    nome_processo VARCHAR(120) NOT NULL,
    descricao TEXT NOT NULL,
    tempo_min INTEGER NOT NULL DEFAULT 0 CHECK (tempo_min >= 0),
    temperatura_c NUMERIC(6,2),
    equipamento VARCHAR(120),
    observacoes TEXT,
    UNIQUE (receita_id, ordem)
);

CREATE INDEX IF NOT EXISTS ix_receita_processos_receita
    ON kitchenmanager.receita_processos(receita_id);

-- 4. Catálogo de alergénios
CREATE TABLE IF NOT EXISTS kitchenmanager.alergenios (
    id SMALLSERIAL PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    nome VARCHAR(120) NOT NULL UNIQUE,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO kitchenmanager.alergenios (codigo, nome)
VALUES
('GLUTEN','Cereais que contêm glúten'),
('CRUSTACEOS','Crustáceos'),
('OVOS','Ovos'),
('PEIXE','Peixe'),
('AMENDOINS','Amendoins'),
('SOJA','Soja'),
('LEITE','Leite'),
('FRUTOS_CASCA_RIJA','Frutos de casca rija'),
('AIPO','Aipo'),
('MOSTARDA','Mostarda'),
('SESAMO','Sementes de sésamo'),
('SULFITOS','Dióxido de enxofre e sulfitos'),
('TREMOCO','Tremoço'),
('MOLUSCOS','Moluscos')
ON CONFLICT (codigo) DO NOTHING;

CREATE TABLE IF NOT EXISTS kitchenmanager.receita_alergenios (
    receita_id BIGINT NOT NULL REFERENCES kitchenmanager.receitas(id) ON DELETE CASCADE,
    alergenio_id SMALLINT NOT NULL REFERENCES kitchenmanager.alergenios(id),
    origem VARCHAR(20) NOT NULL DEFAULT 'ingrediente'
        CHECK (origem IN ('ingrediente','contaminacao_cruzada','manual')),
    observacoes TEXT,
    PRIMARY KEY (receita_id, alergenio_id, origem)
);

-- 5. Documentos e versões HACCP
CREATE TABLE IF NOT EXISTS kitchenmanager.haccp_documentos (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    entidade_emissora VARCHAR(180),
    referencia VARCHAR(120),
    area_aplicacao VARCHAR(180),
    origem_url TEXT,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kitchenmanager.haccp_versoes (
    id BIGSERIAL PRIMARY KEY,
    documento_id BIGINT NOT NULL REFERENCES kitchenmanager.haccp_documentos(id) ON DELETE CASCADE,
    numero_versao VARCHAR(50) NOT NULL,
    data_publicacao DATE,
    entrada_vigor DATE,
    fim_vigencia DATE,
    resumo_alteracoes TEXT,
    hash_documento VARCHAR(128),
    ficheiro_referencia TEXT,
    estado VARCHAR(20) NOT NULL DEFAULT 'vigente'
        CHECK (estado IN ('rascunho','vigente','substituida','revogada')),
    UNIQUE (documento_id, numero_versao)
);

-- 6. Requisitos HACCP extraídos/validados de cada versão
CREATE TABLE IF NOT EXISTS kitchenmanager.haccp_requisitos (
    id BIGSERIAL PRIMARY KEY,
    versao_id BIGINT NOT NULL REFERENCES kitchenmanager.haccp_versoes(id) ON DELETE CASCADE,
    codigo VARCHAR(80),
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    tipo VARCHAR(40) NOT NULL DEFAULT 'procedimento'
        CHECK (tipo IN ('procedimento','limite_critico','monitorizacao','acao_corretiva','registo','alergenio','rastreabilidade')),
    limite_min NUMERIC(14,4),
    limite_max NUMERIC(14,4),
    unidade VARCHAR(30),
    obrigatorio BOOLEAN NOT NULL DEFAULT TRUE
);

-- 7. Aplicação dos requisitos HACCP às fichas técnicas
CREATE TABLE IF NOT EXISTS kitchenmanager.receita_haccp (
    id BIGSERIAL PRIMARY KEY,
    receita_id BIGINT NOT NULL REFERENCES kitchenmanager.receitas(id) ON DELETE CASCADE,
    requisito_id BIGINT NOT NULL REFERENCES kitchenmanager.haccp_requisitos(id),
    processo_id BIGINT REFERENCES kitchenmanager.receita_processos(id) ON DELETE SET NULL,
    limite_operacional VARCHAR(120),
    monitorizacao TEXT,
    acao_corretiva TEXT,
    responsavel VARCHAR(120),
    estado VARCHAR(20) NOT NULL DEFAULT 'conforme'
        CHECK (estado IN ('conforme','rever','nao_conforme','nao_aplicavel')),
    revisto_em TIMESTAMPTZ,
    UNIQUE (receita_id, requisito_id, processo_id)
);

-- 8. Histórico de revisão da ficha
CREATE TABLE IF NOT EXISTS kitchenmanager.receita_revisoes (
    id BIGSERIAL PRIMARY KEY,
    receita_id BIGINT NOT NULL REFERENCES kitchenmanager.receitas(id) ON DELETE CASCADE,
    versao INTEGER NOT NULL,
    motivo TEXT,
    alteracoes TEXT,
    autor VARCHAR(120),
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (receita_id, versao)
);

-- 9. Views de custos e tempos
CREATE OR REPLACE VIEW kitchenmanager.v_receita_custos AS
SELECT
    r.id AS receita_id,
    r.nome,
    r.rendimento_doses,
    COALESCE(SUM(
        COALESCE(ri.quantidade_liquida, ri.quantidade_bruta, 0)
        * COALESCE(ri.custo_unitario_snapshot, p.preco_unitario, 0)
    ), 0) AS custo_total,
    CASE
        WHEN COALESCE(r.rendimento_doses, 0) > 0 THEN
            COALESCE(SUM(
                COALESCE(ri.quantidade_liquida, ri.quantidade_bruta, 0)
                * COALESCE(ri.custo_unitario_snapshot, p.preco_unitario, 0)
            ), 0) / r.rendimento_doses
        ELSE 0
    END AS custo_por_dose
FROM kitchenmanager.receitas r
LEFT JOIN kitchenmanager.receita_ingredientes ri ON ri.receita_id = r.id
LEFT JOIN kitchenmanager.produtos p ON p.id = ri.produto_id
GROUP BY r.id, r.nome, r.rendimento_doses;

CREATE OR REPLACE VIEW kitchenmanager.v_receita_tempos AS
SELECT
    r.id AS receita_id,
    r.nome,
    COALESCE(SUM(rp.tempo_min), 0) AS tempo_processos_min,
    COALESCE(r.tempo_preparacao_min, 0)
      + COALESCE(r.tempo_confeccao_min, 0)
      + COALESCE(r.tempo_finalizacao_min, 0) AS tempo_declarado_min
FROM kitchenmanager.receitas r
LEFT JOIN kitchenmanager.receita_processos rp ON rp.receita_id = r.id
GROUP BY r.id, r.nome, r.tempo_preparacao_min, r.tempo_confeccao_min, r.tempo_finalizacao_min;

-- 10. Função para atualizar timestamp
CREATE OR REPLACE FUNCTION kitchenmanager.fn_touch_atualizado_em()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_receitas_touch ON kitchenmanager.receitas;
CREATE TRIGGER trg_receitas_touch
BEFORE UPDATE ON kitchenmanager.receitas
FOR EACH ROW EXECUTE FUNCTION kitchenmanager.fn_touch_atualizado_em();

COMMIT;
