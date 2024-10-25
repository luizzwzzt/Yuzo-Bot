import Event from '../../Handlers/Event.js';
import { handleXpSystem } from '../../Functions/xpSystem.js';
import { DBWrapper } from '../../Database/DBWrapper.js';
import { getText } from '../../Functions/Language.js'; 
import { Embed } from '../../Functions/Embed.js'; 
import { Button } from '../../Functions/Button.js'; 
import { ActionRowBuilder } from 'discord.js';

const dbWrapper = new DBWrapper();

export default class extends Event {
	constructor(client) {
		super(client, {
			name: 'messageCreate',
		});
	}

	run = async (message) => {
		const serverId = message.guild.id;
		const lang = await dbWrapper.getLanguage(serverId);

		const welcomeMessage = await getText('welcomeMessage', lang);
		const helpPrompt = await getText('helpPrompt', lang);
		const labelMention = await getText('labelmention', lang);
		const buttonMention = await getText('buttonmention', lang);

		const actionRow = new ActionRowBuilder().addComponents([
			Button({ label: labelMention, url: 'https://luiz-portfolio.online/contact', style: 'Link' }),
			Button({
				label: buttonMention,
				url: `https://discord.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot+identify+guilds+email+applications.commands&permissions=2080374975`,
				style: 'Link',
			}),
		]);

		const embed = Embed({
			description: `${welcomeMessage} ${message.author}! ${helpPrompt}`,
			title: '', 
			footer: '',
		});

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
