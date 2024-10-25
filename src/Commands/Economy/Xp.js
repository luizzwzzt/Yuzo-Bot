import Command from '../../Handlers/Command.js';
import { Server } from '../../Database/Schemas/GuildSchema.js';
import { Embed } from '../../Functions/Embed.js';

export default class extends Command {
  constructor(client) {
    super(client, {
      name: 'xp',
      description: 'Veja seu XP e nível no servidor, ou de um amigo.',
      options: [
        {
          name: 'user',
          description: 'Selecione um usuário para ver o XP.',
          type: 6, // O tipo 6 representa um usuário no Discord (USER).
          required: false, // Opcional, se não for passado, mostrará o XP do autor do comando.
        },
      ],
    });
  }

  async run(interaction) {
    const targetUser = interaction.options.getUser('user') || interaction.user; // Se o usuário for fornecido, usa ele, senão usa o autor
    const userId = targetUser.id;
    const serverId = interaction.guild.id;

    try {
      // Buscar informações do servidor no banco de dados
      const serverData = await Server.findOne({ serverId });
      if (!serverData) {
        return interaction.reply('Erro ao encontrar os dados do servidor.');
      }

      // Buscar os dados do usuário alvo no servidor
      const userData = serverData.users.find(user => user.userId === userId);
      if (!userData) {
        return interaction.reply(`${targetUser.username} ainda não tem XP registrado neste servidor.`);
      }

      const { xp, level } = userData;
      
      // Cálculo de XP necessário para o próximo nível (exemplo: level * 100)
      const xpToNextLevel = (level + 1) * 100 - xp;

      // Criar o embed para mostrar o XP e nível
      const embed = Embed({
        title: `XP de ${targetUser.username}`,
        description: `**Nível:** ${level}\n**XP Atual:** ${xp}\n**XP para o próximo nível:** ${xpToNextLevel}`,
        color: '#2f3136',
        timestamp: new Date(),
      });

      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      return interaction.reply('Ocorreu um erro ao tentar recuperar os dados de XP.');
    }
  }
}
