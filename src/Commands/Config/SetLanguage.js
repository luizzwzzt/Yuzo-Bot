import Command from '../../Handlers/Command.js';
import { getCurrentLanguage, sendLanguageEmbed } from '../../Functions/Language.js';
import { PermissionsBitField } from 'discord.js';

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
                content: 'Você não tem permissão para usar este comando!\nPara utilizá-lo, você precisa ter a permissão de `Gerenciar Servidor`.',
                ephemeral: true,
            });
        }

        const currentLang = await getCurrentLanguage(interaction, this.client);
        
        const { embed, buttonRow } = await sendLanguageEmbed(interaction, currentLang);

        await interaction.reply({ embeds: [embed], components: [buttonRow], ephemeral: true });
    }
}
