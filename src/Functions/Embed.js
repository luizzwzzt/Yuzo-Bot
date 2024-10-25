import { EmbedBuilder } from 'discord.js';

/**
 * Função para criar embeds personalizados
 * @param {Object} options - Opções para personalizar o embed.
 * @param {String} options.description - Descrição do embed.
 * @param {String} [options.color] - Cor do embed (padrão: #2f3136).
 * @param {String} [options.title] - Título do embed.
 * @param {String} [options.footer] - Rodapé do embed.
 * @returns {EmbedBuilder} - Retorna o embed configurado.
 */
export function Embed({ description, color = '#2f3136', title, footer }) {
    const embed = new EmbedBuilder().setColor(color).setDescription(description);

    if (title) {
        embed.setTitle(title);
    }

    if (footer) {
        embed.setFooter({ text: footer });
    }

    return embed;
}
