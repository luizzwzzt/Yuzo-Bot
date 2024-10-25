import { join } from 'path';
import { promises as fs } from 'fs';
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder } from 'discord.js';

// Função para mudar o idioma e atualizar a embed
export async function handleLanguageChange(interaction) {
  const newLang = interaction.customId === 'language_en' ? 'en-US' : 'pt-BR';

  // Atualiza o idioma no banco de dados
  await interaction.client.dbWrapper.updateLanguage(interaction.guild.id, newLang);

  // Envia a embed com a nova linguagem
  const embed = await sendLanguageEmbed(interaction, newLang);
  await interaction.update({ embeds: [embed], components: [] }); // Remove os botões após a seleção
}

// Função para enviar a embed com o idioma apropriado
export async function sendLanguageEmbed(interaction, lang) {
  const langFilePath = join(process.cwd(), `src/Locales/${lang}/commands.json`);
  const langData = await fs.readFile(langFilePath, 'utf-8');
  const commands = JSON.parse(langData);

  const embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(lang === 'en-US' ? '🌎 Choose your desired language!' : '🌎 Escolha a linguagem desejada!')
    .setDescription(lang === 'en-US' 
      ? 'To change the language I interact in this server, click the button for your desired language.' 
      : 'Para alterar a linguagem que eu interajo nesse servidor, aperte no botão com a nova linguagem desejada.')
    .addFields({ name: lang === 'en-US' ? 'Current Language:' : 'Idioma atual:', value: lang, inline: true })
    .setFooter({ text: lang === 'en-US' ? 'Click the button corresponding to your desired language!' : 'Clique no botão correspondente à linguagem desejada!' });

  const buttonRow = new ActionRowBuilder()
    .addComponents(
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
        .setDisabled(true) // Bloqueia os botões após a escolha
    );

  embed.setFooter({ text: lang === 'en-US' ? 'Language changed!' : 'Idioma alterado!' });
  return embed;
}

export async function getCurrentLanguage(interaction, client) {
	const serverId = interaction.guild.id;
	return await client.dbWrapper.getLanguage(serverId) || 'pt-BR'; // Retorna o idioma atual do servidor
}
