CREATE DATABASE IF NOT EXISTS ecommerce_tcc;
USE ecommerce_tcc;

DROP TABLE IF EXISTS item_personalizacoes;
DROP TABLE IF EXISTS pedidos_produtos;
DROP TABLE IF EXISTS pagamentos;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS personalizacoes;
DROP TABLE IF EXISTS produtos;
DROP TABLE IF EXISTS usuarios;
-- Usuário
CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  cpf_usuario CHAR(11) UNIQUE,
  nome_usuario VARCHAR(100) NOT NULL,
  email_usuario VARCHAR(150) UNIQUE NOT NULL,
  senha_usuario VARCHAR(255) NOT NULL,
  endereco_usuario VARCHAR(255)
);

-- Produto
CREATE TABLE IF NOT EXISTS produtos (
  id_produto INT AUTO_INCREMENT PRIMARY KEY,
  nm_produto VARCHAR(100) NOT NULL,
  desc_produto VARCHAR(255),
  preco_produto DECIMAL(10,2) NOT NULL,
  qtd_produto INT NOT NULL
);

-- Personalização
CREATE TABLE IF NOT EXISTS personalizacoes (
  id_personalizacao INT AUTO_INCREMENT PRIMARY KEY,
  id_produto INT,
  tipo_personalizacao VARCHAR(50),
  vl_personalizacao DECIMAL(10,2),
  tipo_input ENUM('text','select','checkbox','radio') DEFAULT 'text',
  opcoes TEXT,
  FOREIGN KEY (id_produto) REFERENCES produtos(id_produto)
);

-- Pedido
CREATE TABLE IF NOT EXISTS pedidos (
  id_pedido INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT,
  data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
  status_pedido ENUM('Pendente','Pago','Cancelado') DEFAULT 'Pendente',
  vl_total_pedido DECIMAL(10,2),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Pagamento
CREATE TABLE IF NOT EXISTS pagamentos (
  id_pagamento INT AUTO_INCREMENT PRIMARY KEY,
  id_pedido INT,
  vl_pagamento DECIMAL(10,2),
  tipo_pagamento ENUM('PIX','Cartão'),
  status_pagamento ENUM('Aprovado','Rejeitado','Pendente') DEFAULT 'Pendente',
  FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido)
);

-- Pedido_Produto
CREATE TABLE IF NOT EXISTS pedidos_produtos (
  id_pedido_produto INT AUTO_INCREMENT PRIMARY KEY,
  id_pedido INT,
  id_produto INT,
  qtd_pedido_produto INT,
  FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido),
  FOREIGN KEY (id_produto) REFERENCES produtos(id_produto)
);

-- Item_Personalizacoes (personalizações aplicadas a cada item do pedido)
CREATE TABLE IF NOT EXISTS item_personalizacoes (
  id_item_personalizacao INT AUTO_INCREMENT PRIMARY KEY,
  id_pedido_produto INT,
  id_personalizacao INT,
  valor_escolhido VARCHAR(100), -- Ex: "Azul", "M", "João"
  FOREIGN KEY (id_pedido_produto) REFERENCES pedidos_produtos(id_pedido_produto),
  FOREIGN KEY (id_personalizacao) REFERENCES personalizacoes(id_personalizacao)
);