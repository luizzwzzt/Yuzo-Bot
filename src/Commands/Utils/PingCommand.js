import Command from '../../Handlers/Command.js';
import { getCurrentLanguage, getText } from '../../Functions/Language.js';

export default class extends Command {
	constructor(client) {
		super(client, {
			name: 'ping',
			description: 'Responde com Pong!',
		});
	}

	async run(interaction) {
		const currentLang = await getCurrentLanguage(interaction, this.client);
		const PingMessage = await getText('ping', currentLang);

		const PingMessage2 = PingMessage.replace('${ping}', this.client.ws.ping);

		await interaction.reply(PingMessage2);
	}
}
