-- Criar tabela de usuários compatível com o repositório UserService
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255),
    role VARCHAR(20) DEFAULT 'client', -- owner, employee, client
    imagem TEXT, 
    data_nascimento DATE,
    cpf_usuario VARCHAR(14)
);

-- Inserir alguns dados para o Dashboard não abrir vazio
INSERT INTO users (nome, email, role) VALUES 
('William Smolarek', 'william@exemplo.com', 'owner'),
('Felipe Martins', 'felipe@exemplo.com', 'employee'),
('Lucas Castanho', 'lucas@exemplo.com', 'client');

-- Tabela de transações que você já tinha
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id), -- Agora ligando ao ID real do usuário
    date DATE DEFAULT CURRENT_DATE,
    products INTEGER,
    cost DECIMAL(10,2)
);

INSERT INTO transactions (user_id, products, cost) VALUES (1, 3, 450.00), (2, 1, 120.00);