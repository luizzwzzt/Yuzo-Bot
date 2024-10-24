import Event from "../../Handlers/Event.js";
import { Collection, InteractionType } from "discord.js";
import config from "../../Config/Config.js";

const cooldowns = new Collection();

export default class extends Event {
  constructor(client) {
    super(client, {
      name: "interactionCreate",
    });
  }

  run = async (interaction) => {
    const { client } = interaction;

    if (interaction.type === InteractionType.ApplicationCommand) {
      if (interaction.user.bot) return;

      const cmd = client.commands.find((c) => c.name === interaction.commandName);
      if (!cmd) return;

      if (cmd.ownerOnly && !config.owners.includes(interaction.user.id)) {
        return interaction.reply({
          content: "Apenas administradores podem utilizar este comando.",
          ephemeral: true,
        });
      }

      const cooldownKey = `${cmd.name}-${interaction.user.id}`;
      const cooldownTime = cooldowns.get(cooldownKey);

      if (cmd.cooldown && cooldownTime) {
        const remainingTime = cooldownTime - Date.now();
        if (remainingTime > 0) {
          return interaction
            .reply({
              content: `O cooldown está ativo, aguarde <t:${Math.floor(
                (Date.now() + remainingTime) / 1000
              )}:R> para utilizar o comando novamente.`,
              ephemeral: true,
            })
            .then(() => {
              setTimeout(() => interaction.deleteReply(), remainingTime + 1000);
            });
        }
      }

      if (cmd.requireDatabase) {
        interaction.guild.db =
          (await client.db.guilds.findById(interaction.guild.id)) ||
          new client.db.guilds({ _id: interaction.guild.id });
      }

      await this.executeCommand(cmd, client, interaction);
      if (cmd.cooldown) {
        cooldowns.set(cooldownKey, Date.now() + cmd.cooldown);
        setTimeout(() => cooldowns.delete(cooldownKey), cmd.cooldown);
      }
    }
  };

  async executeCommand(cmd, client, interaction) {
    try {
      await cmd.run(interaction);
    } catch (error) {
      console.error(error);
      interaction.reply({
        content: "Ocorreu um erro ao executar o comando! Por favor, tente novamente.",
        ephemeral: true,
      });
    }
  }
}
