export function roundRect(ctx, x, y, width, height, radius) {
	let r = radius;
	if (width < 2 * r) r = width / 2;
	if (height < 2 * r) r = height / 2;

	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.arcTo(x + width, y, x + width, y + height, r);
	ctx.arcTo(x + width, y + height, x, y + height, r);
	ctx.arcTo(x, y + height, x, y, r);
	ctx.arcTo(x, y, x + width, y, r);
	ctx.closePath();
	ctx.fill();
}
