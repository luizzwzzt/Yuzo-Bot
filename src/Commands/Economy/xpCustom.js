import Command from '../../Handlers/Command.js';
import { Server } from '../../Database/Schemas/GuildSchema.js';

const commonColors = [
	{ name: 'Vermelho', value: '#ff0000' },
	{ name: 'Verde', value: '#00ff00' },
	{ name: 'Azul', value: '#0000ff' },
	{ name: 'Branco', value: '#ffffff' },
	{ name: 'Preto', value: '#000000' },
	{ name: 'Roxo', value: '#800080' },
	{ name: 'Amarelo', value: '#ffff00' },
];

export default class extends Command {
	constructor(client) {
		super(client, {
			name: 'xp-custom',
			description: 'Customize as cores do seu card de XP',
			options: [
				{
					name: 'background',
					type: 3,
					description: 'Altere a cor do fundo',
					required: false,
					autocomplete: true,
				},
				{
					name: 'sideline',
					type: 3,
					description: 'Altere a cor da borda',
					required: false,
					autocomplete: true,
				},
				{
					name: 'progressbar',
					type: 3,
					description: 'Altere a cor da barra de progresso',
					required: false,
					autocomplete: true,
				},
				{
					name: 'xp_color',
					type: 3,
					description: 'Altere a cor do texto de XP',
					required: false,
					autocomplete: true,
				},
				{
					name: 'reset',
					type: 5,
					description: 'Restaura as cores para o padrão',
					required: false,
				},
			],
		});
	}

	autocomplete = async (interaction) => {
		const focusedOption = interaction.options.getFocused(true);
		if (['background', 'sideline', 'progressbar', 'xp_color'].includes(focusedOption.name)) {
			const choices = commonColors.filter((color) =>
				color.name.toLowerCase().startsWith(focusedOption.value.toLowerCase())
			);
			await interaction.respond(choices.map((choice) => ({ name: choice.name, value: choice.value })));
		}
	};

	run = async (interaction) => {
		const isValidHex = (hex) => /^#([0-9A-F]{3}){1,2}$/i.test(hex);

		const serverId = interaction.guild.id;
		const userId = interaction.user.id;
		const serverData = await Server.findOne({ serverId });

		if (!serverData) {
			return interaction.reply({ content: 'Não foi possível encontrar dados do servidor.', ephemeral: true });
		}

		const background = interaction.options.getString('background');
		const sideline = interaction.options.getString('sideline');
		const progressBar = interaction.options.getString('progressbar');
		const xpColor = interaction.options.getString('xp_color');
		const reset = interaction.options.getBoolean('reset');

		let userData = serverData.users.find((user) => user.userId === userId);
		if (!userData) {
			userData = {
				userId,
				userName: interaction.user.username,
				xp: 0,
				level: 1,
				nextLevelExp: 100,
				colorCustomization: {},
			};
			serverData.users.push(userData);
		}

		if (reset) {
			userData.colorCustomization = {};
			await serverData.save();
			return interaction.reply({
				content: 'Você resetou todas as cores do seu card de XP para o padrão.',
				ephemeral: true,
			});
		}

		const errorMessages = [];
		if (background && !isValidHex(background))
			errorMessages.push(
				'A cor de fundo que você inseriu está incorreta. Use um código de cor válido.\nExemplo: `#2a2e35`'
			);
		if (sideline && !isValidHex(sideline))
			errorMessages.push(
				'A cor de borda inserida está incorreta.\nUse um código de cor válido.\nExemplo: `#23272a`'
			);
		if (progressBar && !isValidHex(progressBar))
			errorMessages.push(
				'A cor da barra de progresso está incorreta.\nUse um código de cor válido.\nExemplo: `#dad9d1`'
			);
		if (xpColor && !isValidHex(xpColor))
			errorMessages.push(
				'A cor do texto de XP está incorreta.\nUse um código de cor válido.\nExemplo: `#85848a`'
			);

		if (errorMessages.length > 0) {
			return interaction.reply({ content: errorMessages.join('\n'), ephemeral: true });
		}

		if (background) userData.colorCustomization.background = background;
		if (sideline) userData.colorCustomization.sideline = sideline;
		if (progressBar) userData.colorCustomization.progressbar = progressBar;
		if (xpColor) userData.colorCustomization.xpColor = xpColor;

		await serverData.save();

		interaction.reply({ content: 'As cores do seu card de XP foram atualizadas com sucesso.', ephemeral: true });
	};
}
 