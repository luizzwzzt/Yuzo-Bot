import { promises as fs } from 'fs';
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder } from 'discord.js';

// Função para puxar o texto do sistema de linguagem
export async function getText(key, lang = 'pt-BR') {
	const filePath = `./src/locales/${lang}/commands.json`;
	try {
		const fileContent = JSON.parse(await fs.readFile(filePath, 'utf-8'));
		return key.split('.').reduce((obj, k) => obj?.[k], fileContent);
	} catch (error) {
		console.error(`Erro ao carregar o arquivo de linguagem ${filePath}:`, error);
		return null;
	}
}

// Função para enviar a embed com o idioma apropriado
export async function sendLanguageEmbed(interaction, lang) {
	const title = await getText('setlanguage.title', lang);
	const description = await getText('setlanguage.description', lang);
	const currentLanguageField = await getText('setlanguage.currentLanguageField', lang);
	const availablelanguage = await getText('setlanguage.availablelanguage', lang);
	const flagLang = lang === 'en-US' ? '🇺🇸 English' : '🇧🇷 Português';

	const embed = new EmbedBuilder()
		.setColor(0x0099ff)
		.setTitle(title)
		.setDescription(description)
		.addFields(
			{ name: currentLanguageField, value: flagLang, inline: true },
			{ name: availablelanguage, value: '🇧🇷 Português\n🇺🇸 English', inline: true }
		)

	const buttonRow = new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId("language_pt")
			.setEmoji("<:portugues:1299200220546076753>")
			.setLabel("Português")
			.setStyle("Primary"),
		new ButtonBuilder()
			.setCustomId("language_en")
			.setEmoji("<:ingles:1299200368806465668>")
			.setLabel("Inglês")
			.setStyle("Primary")
	);

	return { embed, buttonRow }; 
}

// Função para mudar o idioma e atualizar a embed
export async function handleLanguageChange(interaction) {
	const newLang = interaction.customId === 'language_en' ? 'en-US' : 'pt-BR';

	await interaction.client.dbWrapper.updateLanguage(interaction.guild.id, newLang);

	const title = await getText('setlanguage.title', newLang);
	const description = await getText('setlanguage.description', newLang);
	const currentLanguageField = await getText('setlanguage.currentLanguageField', newLang);
	const availablelanguage = await getText('setlanguage.availablelanguage', newLang);
	const flagLang = await getText('setlanguage.flagLang', newLang);
	const languageChangedButtonText = await getText('setlanguage.languageChangedButton', newLang);

	const currentLanguage = newLang === 'en-US' ? '🇺🇸 English' : '🇧🇷 Português';

	const embed = new EmbedBuilder()
			.setColor(0x0099ff)
			.setTitle(title)
			.setDescription(description)
			.addFields(
					{ name: currentLanguageField, value: currentLanguage, inline: true }, 
					{ name: availablelanguage, value: flagLang, inline: true }
			)
	const disabledButtonRow = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
					.setCustomId('language_changed')
					.setLabel(languageChangedButtonText) 
					.setStyle('Secondary')
					.setDisabled(true)
	);

	await interaction.update({ embeds: [embed], components: [disabledButtonRow] });

	const confirmationMessage = await getText('setlanguage.confirmationMessage', newLang);

	await interaction.followUp({
			content: confirmationMessage,
			ephemeral: true,
	});
}

export async function getCurrentLanguage(interaction, client) {
	const serverId = interaction.guild.id;
	return (await client.dbWrapper.getLanguage(serverId)) || 'pt-BR';
}
