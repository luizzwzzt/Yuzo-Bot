import Command from '../../Handlers/Command.js';
import { getCurrentLanguage } from '../../Functions/Language.js'; // Atualize a importação
import { PermissionsBitField, Colors, EmbedBuilder, ActionRowBuilder, ButtonBuilder } from 'discord.js';

export default class extends Command {
    constructor(client) {
        super(client, {
            name: 'setlanguage',
            description: 'Muda o idioma do bot em algum servidor',
            permissions: [],
            cooldown: 1000,
        });
    }

    async run(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            return interaction.reply({
                content: 'Você não tem permissão para usar este comando!\nPara utilizá-lo, você precisa ter permissão de `Gerenciar Servidor`.',
                ephemeral: true,
            });
        }

        // Obtém o idioma atual do servidor
        const currentLang = await getCurrentLanguage(interaction, this.client);

        // Defina os textos com base no idioma atual do servidor
        const title = currentLang === 'en-US' ? '🌎 Choose your desired language!' : '🌎 Escolha a linguagem desejada!';
        const description = currentLang === 'en-US'
            ? 'To change the language I interact in this server, press the button with the new desired language.'
            : 'Para alterar a linguagem que eu interajo nesse servidor, aperte no botão com a nova linguagem desejada.';
        const currentLanguageField = currentLang === 'en-US' ? 'Current Language:' : 'Idioma atual:';
        const footerText = currentLang === 'en-US' ? 'Click on the button corresponding to the desired language!' : 'Clique no botão correspondente à linguagem desejada!';

        // Cria a embed com base no idioma atual
        const embed = new EmbedBuilder()
            .setColor(Colors.Blue)
            .setTitle(title)
            .setDescription(description)
            .addFields({ name: currentLanguageField, value: currentLang === 'en-US' ? 'English' : 'Português', inline: true })
            .setFooter({ text: footerText });

        // Cria os botões de seleção de idioma
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
            );

        // Envia a embed com os botões
        await interaction.reply({ embeds: [embed], components: [buttonRow], ephemeral: true });
    }
}
