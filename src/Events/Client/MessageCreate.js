import Event from "../../Handlers/Event.js";
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from "discord.js";

export default class extends Event {
  constructor(client) {
    super(client, {
      name: "messageCreate",
    });
  }

  run = async (message) => {
    const actionRow = new ActionRowBuilder().addComponents([
      new ButtonBuilder()
        .setStyle("Link") 
        .setLabel("Suporte")
        .setURL("https://discord.gg/59SmBrHU3q"),
      new ButtonBuilder()
        .setStyle("Link") 
        .setLabel("Me adicione no seu servidor")
        .setURL(
          `https://discord.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot+identify+guilds+email+applications.commands&permissions=2080374975`
        ),
    ]);

    const embed = new EmbedBuilder()
      .setColor("#2f3136")
      .setDescription(`Olá ${message.author}! Use meu comando /help para ver o que eu posso fazer, caso necessite de ajuda utilize /ajuda`);

    if (message.channel.type == "DM") return;
    if (message.author.bot) return;

    if (
      message.content === `<@${this.client.user.id}>` ||
      message.content === `<@!${this.client.user.id}>`
    ) {
      return message.reply({
        embeds: [embed],
        components: [actionRow],
      });
    }
  };
}
