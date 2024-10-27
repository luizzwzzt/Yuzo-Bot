import { loadImage } from 'canvas';

export async function loadAvatar(user) {
    try {
        const avatarUrl = user.displayAvatarURL({ extension: 'png', size: 1024 });
        return await loadImage(avatarUrl);
    } catch (error) {
        console.error('Erro ao carregar o avatar:', error);
        throw new Error('Não foi possível carregar o avatar do usuário.');
    }
}
