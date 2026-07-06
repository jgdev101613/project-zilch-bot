/**
 * Draws the XP progress bar.
 *
 * @param {Object} render
 */
module.exports = function drawProgressBar(render) {
  const { ctx, data, theme, layout } = render;

  const { currentXp, requiredXp } = data;
  const { progress } = layout;

  const { x, y, width, height, borderWidth, borderColor } = progress;

  const radius = height / 2;

  const progressRatio = currentXp / requiredXp;
  const percent = Math.max(0, Math.min(progressRatio, 1));

  const filledWidth = width * percent;

  // ==========================
  // Background
  // ==========================

  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);

  ctx.fillStyle = theme.colors.background;
  ctx.fill();

  // ==========================
  // Filled Portion
  // ==========================

  if (filledWidth > 0) {
    const padding = 3;

    const gradient = ctx.createLinearGradient(x, y, x + width, y);

    gradient.addColorStop(0, theme.colors.primary);
    gradient.addColorStop(1, theme.colors.secondary);
    gradient.addColorStop(2, theme.colors.background);

    ctx.save();

    ctx.shadowColor = theme.colors.primary;
    ctx.shadowBlur = 15;

    ctx.beginPath();

    ctx.roundRect(
      x + padding,
      y + padding,
      Math.max(filledWidth - padding * 2, 0),
      height - padding * 2,
      radius,
    );

    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.restore();
  }

  // ==========================
  // Gloss Highlight
  // ==========================

  if (filledWidth > 0) {
    const padding = 3;

    ctx.beginPath();

    ctx.roundRect(
      x + padding,
      y + padding,
      Math.max(filledWidth - padding * 2, 0),
      (height - padding * 2) / 2,
      radius,
    );

    ctx.fillStyle = "rgba(255, 255, 255, 0.33)";
    ctx.fill();
  }

  // ==========================
  // Border
  // ==========================

  if (borderWidth > 0) {
    ctx.beginPath();

    ctx.roundRect(x, y, width, height, radius);

    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = borderColor ?? theme.colors.outline;

    ctx.stroke();
  }
};
