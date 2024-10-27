import { registerFont } from 'canvas';
import path from 'path';

export const registerFonts = () => {
	registerFont(path.resolve('./src/Assets/fonts/fontop/OpenSans-Bold.ttf'), { family: 'Open Sans' });
};
