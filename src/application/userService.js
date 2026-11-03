const User = require('../domain/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = 'projeto_uninter_raizes'; // Em produção, usar variável de ambiente

class UserService {
  async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.senha, 10);
    return await User.create({ ...userData, senha: hashedPassword });
  }

  async login(email, senha) {
    const user = await User.findOne({ where: { email } });
    
    if (!user) throw new Error('Usuário não encontrado');

    const match = await bcrypt.compare(senha, user.senha);
    if (!match) throw new Error('Senha incorreta');

    // Gera o token de acesso 
    const token = jwt.sign({ id: user.id, perfil: user.perfil }, SECRET, { expiresIn: '1h' });
    
    return { token };
  }
}

module.exports = new UserService();
