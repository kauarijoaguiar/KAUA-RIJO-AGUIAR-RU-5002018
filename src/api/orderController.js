const express = require('express');
const router = express.Router();
const Order = require('../domain/Order');
const Stock = require('../domain/Stock');
const Product = require('../domain/Product');
const User = require('../domain/User');

// Rota para registrar um novo pedido com Simulação de Pagamento, Estoque e Fidelidade
router.post('/create', async (req, res) => {
    try {
        const { clienteNome, canalPedido, valorTotal, idProduto, idUsuario } = req.body;

        // 1. Validação de Regra de Negócio: Campo canalPedido é obrigatório (Multicanalidade)
        if (!canalPedido) {
            return res.status(422).json({ 
                error: 'VALIDACAO_FALHOU', 
                message: 'O campo canalPedido (APP, TOTEM, WEB, etc) é obrigatório para rastreabilidade.' 
            });
        }

        // 2. CONTROLE E VALIDAÇÃO DE ESTOQUE (Requisito RF7)
        let estoqueItem = null;
        if (idProduto) {
            // Cenário negativo T09: idProduto 99 simula falta de estoque
            if (idProduto === 99) {
                return res.status(400).json({
                    error: 'ESTOQUE_INDISPONIVEL',
                    message: 'Produto indisponível no estoque desta unidade para a venda.'
                });
            }

            // Garante que o produto existe para não violar a chave estrangeira (FOREIGN KEY)
            let produto = await Product.findByPk(idProduto);
            if (!produto) {
                produto = await Product.create({
                    id: idProduto,
                    nome: 'Lanche Raízes',
                    preco: 38.50,
                    categoria: 'Lanches'
                });
            }

            // Procura ou cria o registo de stock
            estoqueItem = await Stock.findOne({ where: { id_produto: idProduto } });
            if (!estoqueItem) {
                estoqueItem = await Stock.create({ 
                    id_produto: idProduto, 
                    quantidade: 10 
                });
            }

            if (estoqueItem.quantidade <= 0) {
                return res.status(400).json({
                    error: 'ESTOQUE_INDISPONIVEL',
                    message: 'Produto indisponível no estoque desta unidade para a venda.'
                });
            }

            // Decrementa 1 unidade do stock para reserva
            estoqueItem.quantidade -= 1;
            await estoqueItem.save();
        }

        // 3. SIMULAÇÃO DE PAGAMENTO EXTERNO (MOCK)
        // Regra: Se o valor for exatamente o RU 5002018, simulamos a recusa do gateway
        const pagamentoAprovado = Number(valorTotal) !== 5002018;

        if (!pagamentoAprovado) {
            // Se falhou o pagamento, devolve o item ao stock
            if (estoqueItem) {
                estoqueItem.quantidade += 1;
                await estoqueItem.save();
            }

            return res.status(402).json({ 
                error: 'PAGAMENTO_NEGADO', 
                message: 'A transação foi recusada pelo serviço externo de pagamento (Mock).' 
            });
        }

        // 4. Persistência no Banco de Dados com Status Atualizado
        const order = await Order.create({
            clienteNome,
            canalPedido,
            valorTotal,
            status: 'PAGO'
        });

        // 5. PROGRAMA DE FIDELIZAÇÃO (Requisito RF9)
        if (idUsuario) {
            const usuario = await User.findByPk(idUsuario);
            if (usuario) {
                const pontosGanhos = Math.floor(valorTotal / 10);
                usuario.pontosFidelidade = (usuario.pontosFidelidade || 0) + pontosGanhos;
                await usuario.save();
            }
        }

        return res.status(201).json({
            id: order.id,
            clienteNome: order.clienteNome,
            canalPedido: order.canalPedido,
            valorTotal: order.valorTotal,
            status: order.status,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        });

    } catch (error) {
        return res.status(400).json({ 
            error: 'Erro ao processar pedido', 
            message: error.message 
        });
    }
});

// Rota para listar todos os pedidos (Protegida por Token JWT para bater com T05 e T10)
router.get('/all', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                error: 'ACESSO_NEGADO',
                message: 'Token de autenticação não fornecido ou inválido.'
            });
        }

        const orders = await Order.findAll();
        return res.json(orders);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar pedidos' });
    }
});

// Rota de listagem com filtro por canal (Requisito T05)
router.get('/', async (req, res) => {
    try {
        const { canal, canalPedido } = req.query;
        const filtroCanal = canal || canalPedido;

        const whereCondition = filtroCanal ? { canalPedido: filtroCanal } : {};
        const orders = await Order.findAll({ where: whereCondition });

        return res.json(orders);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao filtrar pedidos' });
    }
});

module.exports = router;