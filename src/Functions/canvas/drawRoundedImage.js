import { roundRect } from './roundRect.js';

export function drawRoundedImage(ctx, x, y, size, image) {
    roundRect(ctx, x, y, size, size, size);
    ctx.fill();
    ctx.save();
    ctx.clip();
    ctx.drawImage(image, x, y, size, size);
    ctx.restore();
}
