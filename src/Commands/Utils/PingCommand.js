import Command from '../../Handlers/Command.js';
import { join } from 'path';
import { promises as fs } from 'fs';

export default class extends Command {
	constructor(client) {
		super(client, {
			name: 'ping',
			description: 'Responde com Pong!',
		});
	}

	async run(interaction) {
		const serverId = interaction.guild.id;

		const lang = await this.client.dbWrapper.getLanguage(serverId) || 'pt-BR';

		const langFilePath = join(process.cwd(), `src/Locales/${lang}/commands.json`);
		const langData = await fs.readFile(langFilePath, 'utf-8');
		const commands = JSON.parse(langData);

		const pingMessage = commands.ping.replace('${ping}', this.client.ws.ping);

		await interaction.reply(pingMessage);
	}
}
