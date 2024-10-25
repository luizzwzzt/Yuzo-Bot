import mongoose from 'mongoose';

const serverSchema = new mongoose.Schema({
  serverId: { type: String, required: true, unique: true },
  serverName: { type: String }, // Nome do servidor
  users: [
    {
      userId: { type: String, required: true },
      userName: { type: String }, // Nome do usuário
      xp: { type: Number, default: 0 },
      level: { type: Number, default: 1 },
      nextLevelExp: { type: Number, default: 100 },
    },
  ],
  language: { type: String, default: 'pt-BR' }, // Configuração de idioma
});

// Verifica se o modelo já foi compilado para evitar erro
export const Server = mongoose.models.Server || mongoose.model('Server', serverSchema);
