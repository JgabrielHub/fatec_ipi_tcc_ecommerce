USE ecommerce_tcc;

-- Usuários fictícios

INSERT INTO usuarios (cpf_usuario, nome_usuario, email_usuario, senha_usuario, endereco_usuario) VALUES
('12345678901', 'João da Silva', 'joao@email.com', '123456', 'Rua das Flores, 100'),
('98765432100', 'Maria Oliveira', 'maria@email.com', '123456', 'Av. Brasil, 200');

-- Produtos
INSERT INTO produtos (nm_produto, desc_produto, preco_produto, qtd_produto) VALUES
('Camiseta Básica', 'Camiseta 100% algodão, confortável e leve', 49.90, 100),
('Caneca Personalizada', 'Caneca de cerâmica branca 350ml', 29.90, 50),
('Boné Esportivo', 'Boné ajustável em tecido respirável', 39.90, 80);
INSERT INTO produtos (nm_produto, desc_produto, preco_produto, qtd_produto) VALUES
('Agenda 2025', 'Agenda diária 2025', 40.00, 30);

-- Personalizações

INSERT INTO personalizacoes (id_produto, tipo_personalizacao, vl_personalizacao, tipo_input, opcoes) VALUES
-- Camiseta
(1, 'Tamanho', 0.00, 'select', 'P,M,G,GG'),
(1, 'Cor', 0.00, 'select', 'Branca,Preta,Cinza,Vermelho,Azul,Verde,Amarelo,Roxo,Laranja,Rosa'),
(1, 'Texto Personalizado', 10.00, 'text', NULL);

INSERT INTO personalizacoes (id_produto, tipo_personalizacao, vl_personalizacao, tipo_input, opcoes) VALUES
-- Caneca
(2, 'Cor da caneca', 0.00, 'select', 'Branco,Preto,Azul'),
(2, 'Texto personalizado', 5.00, 'text', NULL),

-- Boné
(3, 'Cor do boné', 0.00, 'select', 'Preto,Branco,Azul'),
(3, 'Logo bordada', 15.00, 'text', NULL);

INSERT INTO personalizacoes (id_produto, tipo_personalizacao, vl_personalizacao, tipo_input, opcoes) VALUES 
-- Agenda
(4, 'Cor da capa', 5.00, 'select', 'Branca,Preta,Cinza,Vermelho,Azul,Verde,Amarelo,Roxo,Laranja,Rosa'),
(4, 'texto na capa', 5.00, 'text', NULL);


-- Pedidos

INSERT INTO pedidos (id_usuario, status_pedido, vl_total_pedido) VALUES
(1, 'Pago', 59.90),
(2, 'Pendente', 39.90);


-- Produtos nos pedidos

INSERT INTO pedidos_produtos (id_pedido, id_produto, qtd_pedido_produto) VALUES
(1, 1, 1), -- João comprou 1 camiseta
(1, 2, 1), -- João comprou 1 caneca
(2, 3, 1); -- Maria comprou 1 boné


-- Personalizações aplicadas

INSERT INTO item_personalizacoes (id_pedido_produto, id_personalizacao, valor_escolhido) VALUES
(1, 1, 'M'),        -- Camiseta tamanho M
(1, 2, 'Preto'),    -- Camiseta cor preta
(2, 4, 'Azul'),     -- Caneca azul
(2, 5, 'Para João'); -- Texto personalizado na caneca


-- Pagamentos

INSERT INTO pagamentos (id_pedido, vl_pagamento, tipo_pagamento, status_pagamento) VALUES
(1, 59.90, 'Cartão', 'Aprovado'),
(2, 39.90, 'PIX', 'Pendente');
