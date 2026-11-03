const express = require('express');
const router = express.Router();
const Product = require('../domain/Product');
const Stock = require('../domain/Stock');

// Rota para cadastrar um produto manualmente (Seu código original)
router.post('/create', async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao criar produto', message: error.message });
    }
});

// ROTA CORRIGIDA: Semente para colocar dados de teste no banco rapidamente
router.post('/seed', async (req, res) => {
    try {
        // Cria o produto com o campo categoria exigido pelo seu banco
        const produto = await Product.create({
            id: 1,
            nome: "Cuscuz Recheado",
            preco: 15.00,
            categoria: "Nordestina"
        });

        // Alimenta o estoque desse produto com 10 unidades
        await Stock.create({
            id_produto: produto.id,
            quantidade: 10
        });

        res.status(201).json({ message: "Banco de dados alimentado com sucesso! Produto ID 1 criado com 10 unidades no estoque." });
    } catch (error) {
        res.status(400).json({ error: "Erro ao alimentar banco", message: error.message });
    }
});

module.exports = router;
