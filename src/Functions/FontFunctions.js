import { registerFont } from 'canvas';
import path from 'path';

export const registerFonts = () => {
    // Registrar Open Sans
    registerFont(path.resolve('./src/Assets/fonts/fontop/OpenSans-Bold.ttf'), { family: 'Open Sans' });

  
};
