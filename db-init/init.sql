-- 1. Criar o Schema
CREATE SCHEMA IF NOT EXISTS descomplicai;

-- 2. Criar a tabela "user" com as colunas exatas que o seu código pediu no log
CREATE TABLE IF NOT EXISTS descomplicai."user" (
    id SERIAL PRIMARY KEY,
    name_user VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_user VARCHAR(255) NOT NULL,
    creation_data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_image TEXT,
    type_user VARCHAR(50) DEFAULT 'owner',
    status VARCHAR(50) DEFAULT 'active',
    phone VARCHAR(20),
    temp_login_token TEXT,
    temp_login_expire TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    confirmation_token TEXT,
    confirmation_token_expires TIMESTAMP,
    born_date DATE,
    cpf VARCHAR(14) UNIQUE
);

-- 3. Criar tabela de Transações (ajustada para a nova estrutura)
CREATE TABLE IF NOT EXISTS descomplicai.transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES descomplicai."user"(id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    products INTEGER DEFAULT 0,
    cost DECIMAL(10,2) DEFAULT 0.00
);

-- 4. Inserir usuário de teste com as colunas corretas
INSERT INTO descomplicai."user" (name_user, email, password_user, type_user, cpf, status, is_verified) 
VALUES ('Admin Local', 'admin@teste.com', '123456', 'owner', '000.000.000-00', 'active', TRUE)
ON CONFLICT (email) DO NOTHING;

-- 5. Inserir transações de exemplo
INSERT INTO descomplicai.transactions (user_id, products, cost) VALUES (1, 5, 150.00), (1, 2, 89.90);