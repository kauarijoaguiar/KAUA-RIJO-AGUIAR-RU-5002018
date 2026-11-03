const express = require('express');
const router = express.Router();
const userService = require('../application/userService');

// Rota de Cadastro
router.post('/register', async (req, res) => {
  try {
    const user = await userService.create(req.body);
    const { senha, ...userWithoutPassword } = user.toJSON();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rota de Login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const result = await userService.login(email, senha);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

module.exports = router;
