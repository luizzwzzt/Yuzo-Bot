import Command from '../../Handlers/Command.js';
import { Server } from '../../Database/Schemas/GuildSchema.js';
import { registerFonts } from '../../Functions/FontFunctions.js';
import { createCanvas, loadImage, registerFont } from 'canvas';
import { AttachmentBuilder } from 'discord.js';
import path from 'path';

export default class extends Command {
	constructor(client) {
		super(client, {
			name: 'rank',
			description: 'Veja o rank em um card',
			options: [
				{
					name: 'user',
					type: 6, // Tipo USER
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

		// Função para desenhar imagem arredondada
		function drawRoundedImage(ctx, x, y, size, image) {
			roundRect(ctx, x, y, size, size, size);
			ctx.fill();
			ctx.save();
			ctx.clip();
			ctx.drawImage(image, x, y, size, size);
			ctx.restore();
		}

		// Função para desenhar retângulos arredondados
		function roundRect(ctx, x, y, width, height, radius) {
			let r = radius;
			if (width < 2 * r) r = width / 2;
			if (height < 2 * r) r = height / 2;

			ctx.beginPath();
			ctx.moveTo(x + r, y);
			ctx.arcTo(x + width, y, x + width, y + height, r);
			ctx.arcTo(x + width, y + height, x, y + height, r);
			ctx.arcTo(x, y + height, x, y, r);
			ctx.arcTo(x, y, x + width, y, r);
			ctx.closePath();
			ctx.fill();
		}

		const serverData = await Server.findOne({ serverId });
		if (!serverData) {
			return interaction.editReply('Não foram encontrados dados para este servidor.');
		}

		const userData = serverData.users.find((user) => user.userId === targetUser.id);
		if (!userData) {
			return interaction.editReply(`${targetUser.username} ainda não tem XP registrado neste servidor.`);
		}

		const { xp, level } = userData;
		const maxXp = level * 100; // XP máximo para o nível
		const progressPercentage = Math.min((xp / maxXp) * 100, 100); // Limitar a porcentagem a 100

		// Cor de fundo (preto)
		ctx.fillStyle = '#101211';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Barra de progresso base (cor mais escura)
		ctx.fillStyle = '#484b4e';
		roundRect(ctx, 225, 140, 400, 30, 25);

		// Ajuste a largura inicial da barra de progresso
		const initialProgressWidth = 20; // Largura inicial da barra
		const filledProgressWidth = Math.max(initialProgressWidth, (400 * progressPercentage) / 100); // Garante que a barra preenchida não seja menor que a inicial

		// Barra de progresso preenchida (cor branca)
		ctx.fillStyle = '#dad9d1';
		roundRect(ctx, 225, 140, filledProgressWidth, 30, 25);

		const progressBarX = 225; // Posição X inicial da barra de progresso
		const progressBarWidth = 400; // Largura da barra de progresso

		const xpText = `${xp}/${maxXp}`;
		ctx.font = '24px "Open Sans"';
		ctx.fillStyle = '#85848a';
		ctx.textAlign = 'center'; // Alinha o texto ao centro
		const textX = progressBarX + progressBarWidth / 2; // Centraliza o texto na barra
		ctx.fillText(xpText, textX, 165); // Mantém a posição Y constante

		// Nome do usuário
		ctx.fillStyle = '#FFFFFF';
		ctx.font = '30px "Open Sans"';
		ctx.fillText(targetUser.username, 310, 120);

		// Carregar o avatar do usuário
		let image;
		try {
			const avatarUrl = targetUser.displayAvatarURL({ extension: 'png', size: 1024 });
			image = await loadImage(avatarUrl);
			drawRoundedImage(ctx, 50, 50, 150, image); // Avatar do usuário
		} catch (error) {
			console.error('Erro ao carregar o avatar:', error);
			return interaction.editReply('Não foi possível carregar o avatar do usuário.');
		}

		// Carregar e desenhar a borda sobre o avatar
		let iconBorder;
		try {
			const iconPath = path.resolve('./src/Assets/img/png/Level_30_Summoner_Icon_Border.png');
			iconBorder = await loadImage(iconPath);
			const borderWidth = 240; // Largura da borda
			const borderHeight = 230; // Altura da borda

			// Posições do avatar
			const avatarX = 50;
			const avatarY = 50;

			// Calcular a posição para centralizar a borda sobre o avatar
			const borderX = avatarX + (150 - borderWidth) / 2; // Centraliza a borda
			const borderY = avatarY + (150 - borderHeight) / 2; // Centraliza a borda

			ctx.drawImage(iconBorder, borderX, borderY, borderWidth, borderHeight); // Ajusta a posição e o tamanho da borda
		} catch (error) {
			console.error('Erro ao carregar a borda do ícone:', error);
		}

		// Porcentagem e nível do usuário
		ctx.font = '14px "Open Sans"';
		ctx.fillStyle = '#ffffff';
		const levelText = `${level}`;
		const textWidth = ctx.measureText(levelText).width;

		// Posição fixa X para centralização em relação à moldura do avatar
		const fixedPositionX = 132; // Ajuste esta posição conforme necessário
		const levelX = fixedPositionX - textWidth / 2; // Centraliza o texto na posição fixa
		ctx.fillText(levelText, levelX, 200); // Mantém a posição Y constante

		ctx.font = '12px "Open Sans"';
		ctx.fillStyle = '#85848a';
		ctx.fillText(targetUser.id, 620, 230); // Mantém a posição Y constante



		// Criar o arquivo de imagem e enviar
		const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'rank.png' });
		await interaction.editReply({ files: [attachment] });
	};
}
