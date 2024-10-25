import Command from '../../Handlers/Command.js';
import { getCurrentLanguage, getText } from '../../Functions/Language.js';

export default class extends Command {
	constructor(client) {
		super(client, {
			name: 'ajuda',
			description: 'Mostre informações sobre mim e meus comandos.',
			ownerOnly: false,
			cooldown: 5000,
		});
	}

	async run(interaction) {
		const currentLang = await getCurrentLanguage(interaction, this.client);
		const helpMessage = await getText('help', currentLang);

		await interaction.reply(helpMessage);
	}
}
