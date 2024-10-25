import Command from '../../Handlers/Command.js';
import { join } from 'path';
import { promises as fs } from 'fs';

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
		const serverId = interaction.guild.id;

		const lang = (await this.client.dbWrapper.getLanguage(serverId)) || 'pt-BR';

		const langFilePath = join(process.cwd(), `src/Locales/${lang}/commands.json`);
		const langData = await fs.readFile(langFilePath, 'utf-8');
		const commands = JSON.parse(langData);

		await interaction.reply(commands.help);
	}
}
