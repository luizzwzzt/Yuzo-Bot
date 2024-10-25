// src/Events/Client/MessageCreate.js
import Event from '../../Handlers/Event.js';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from 'discord.js';
import { handleXpSystem } from '../../Functions/xpSystem.js';
import { DBWrapper } from '../../Database/DBWrapper.js'; // Importando a classe DBWrapper
import ptBR from '../../locales/pt-BR/commands.json' assert { type: 'json' }; // Importando os comandos em português
import enUS from '../../locales/en-US/commands.json' assert { type: 'json' }; // Importando os comandos em inglês

const dbWrapper = new DBWrapper(); // Instanciando a classe DBWrapper

export default class extends Event {
    constructor(client) {
        super(client, {
            name: 'messageCreate',
        });
    }

    run = async (message) => {
        const serverId = message.guild.id;
        const lang = await dbWrapper.getLanguage(serverId); // Usando a instância para chamar getLanguage
        const commands = lang === 'en-US' ? enUS : ptBR;

        const actionRow = new ActionRowBuilder().addComponents([
            new ButtonBuilder().setStyle('Link').setLabel(`${commands.labelmention}`).setURL('https://discord.gg/59SmBrHU3q'),
            new ButtonBuilder()
                .setStyle('Link')
                .setLabel(`${commands.buttonmention}`)
                .setURL(
                    `https://discord.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot+identify+guilds+email+applications.commands&permissions=2080374975`
                ),
        ]);

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription(`${commands.welcomeMessage} ${message.author}! ${commands.helpPrompt}`);

        if (message.channel.type === 'DM') return;
        if (message.author.bot) return;

        if (message.content === `<@${this.client.user.id}>` || message.content === `<@!${this.client.user.id}>`) {
            return message.reply({
                embeds: [embed],
                components: [actionRow],
            });
        }

        await handleXpSystem(message);
    };
}
