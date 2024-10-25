import Command from "../../Handlers/Command.js"; // ou o caminho correto para o seu comando
import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";
import { getLanguageAndCommands } from "../../Functions/getLanguageAndCommands.js"; // ajuste o caminho se necessário

export default class SetLanguageCommand extends Command {
  constructor(context) {
    super(context, {
      name: "setlanguage",
      description: "Define o idioma do bot para o servidor.",
    });
  }

  async run(interaction) {
    const { lang, commands } = await getLanguageAndCommands(interaction, this.client);
    
    // Mensagem de embed para escolher o idioma
    const embed = new EmbedBuilder()
      .setColor("BLUE")
      .setTitle("Escolha o idioma")
      .setDescription(`O idioma atual é: ${lang}`);

    // Botões para mudar a linguagem
    const buttonRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("language_en")
          .setLabel("Inglês")
          .setStyle("Primary"),
        new ButtonBuilder()
          .setCustomId("language_pt")
          .setLabel("Português")
          .setStyle("Primary")
      );

    // Resposta inicial com embed e botões
    await interaction.reply({ embeds: [embed], components: [buttonRow], ephemeral: true });
  }
}
