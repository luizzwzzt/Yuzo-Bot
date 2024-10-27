import Command from '../../Handlers/Command.js';
import { Server } from '../../Database/Schemas/GuildSchema.js';
import { registerFonts } from '../../Functions/FontFunctions.js';
import { createCanvas } from 'canvas';
import { AttachmentBuilder } from 'discord.js';
import { drawRoundedImage } from '../../Functions/canvas/drawRoundedImage.js';
import { roundRect } from '../../Functions/canvas/roundRect.js';
import { loadAvatar } from '../../Functions/canvas/loadAvatar.js';

export default class extends Command {
	constructor(client) {
		super(client, {
			name: 'xp',
			description: 'Veja seu xp em um formato de card',
			options: [
				{
					name: 'user',
					type: 6,
					description: 'O usuário para ver o rank',
					required: false,
				},
			],
		});
	}

	run = async (interaction) => {
		registerFonts();
		await interaction.deferReply();

		const targetUser = interaction.options.getUser('user') || interaction.user;
		const serverId = interaction.guild.id;

		const canvas = createCanvas(700, 250);
		const ctx = canvas.getContext('2d');

		const serverData = await Server.findOne({ serverId });
		if (!serverData) {
			return interaction.editReply('Não foram encontrados dados para este servidor.');
		}

		const userData = serverData.users.find((user) => user.userId === targetUser.id);
		if (!userData) {
			return interaction.editReply(`${targetUser.username} ainda não tem XP registrado neste servidor.`);
		}

		const { xp, level, colorCustomization } = userData;
		const maxXp = level * 100;
		const progressPercentage = Math.min((xp / maxXp) * 100, 100);

		ctx.fillStyle = colorCustomization.sideline;
		roundRect(ctx, 10, 10, canvas.width - 20, canvas.height - 20, 25);

		ctx.fillStyle = colorCustomization.background;
		roundRect(ctx, 20, 20, canvas.width - 40, canvas.height - 40, 20);

		ctx.fillStyle = '#484b4e';
		roundRect(ctx, 225, 140, 400, 30, 25);

		const filledProgressWidth = Math.max(20, (400 * progressPercentage) / 100);
		ctx.fillStyle = colorCustomization.progressbar;
		roundRect(ctx, 225, 140, filledProgressWidth, 30, 25);

		const progressBarX = 225;
		const progressBarWidth = 400;

		const xpText = `${xp}/${maxXp}`;
		ctx.font = '24px "Open Sans"';
		ctx.fillStyle = colorCustomization.xpColor;
		ctx.textAlign = 'center';
		ctx.fillText(xpText, progressBarX + progressBarWidth / 2, 165);

		ctx.fillStyle = '#FFFFFF';
		ctx.font = '30px "Open Sans"';
		ctx.fillText(targetUser.username, 310, 120);

		try {
			const image = await loadAvatar(targetUser);
			drawRoundedImage(ctx, 50, 50, 150, image);
		} catch (error) {
			return interaction.editReply(error.message);
		}

		const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'xp-card.png' });
		return interaction.editReply({ files: [attachment] });
	};
}
