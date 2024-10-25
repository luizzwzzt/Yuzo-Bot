import { ButtonBuilder } from 'discord.js';

/**
 * Função para criar botões personalizados
 * @param {Object} options - Opções para personalizar o botão.
 * @param {String} options.label - Texto exibido no botão.
 * @param {String} options.url - URL para um botão do tipo Link.
 * @param {String} options.style - Estilo do botão (padrão: 'Primary').
 * @returns {ButtonBuilder} - Retorna o botão configurado.
 */
export function Button({ label, url, style = 'Primary' }) {
    const button = new ButtonBuilder()
        .setLabel(label)
        .setStyle(style);

    if (url) {
        button.setURL(url);
    }

    return button;
}
