const fitText = require("./fitText");

/**
 * Draws outlined text using the current render context.
 *
 * @param {Object} render
 * @param {Object} options
 */
module.exports = function drawOutlinedText(render, options) {
  const { ctx, theme } = render;

  const {
    text,

    x,
    y,

    maxWidth,

    maxSize = 40,
    minSize = 18,

    weight,

    fillStyle,
    strokeStyle,

    lineWidth = 5,

    textAlign = "left",
    textBaseline = "alphabetic",
  } = options;

  const family = theme.font;

  const actualWeight = weight ?? "bold";

  const actualFill = fillStyle ?? theme.colors.primary;

  const actualStroke = strokeStyle ?? theme.colors.outline;
  const safeText = String(text ?? "");
  const fontSize = fitText(ctx, safeText, {
    maxWidth,
    maxSize,
    minSize,
    family,
    weight: actualWeight,
  });

  ctx.font = `${actualWeight} ${fontSize}px "${family}"`;

  ctx.textAlign = textAlign;
  ctx.textBaseline = textBaseline;

  ctx.lineWidth = lineWidth;

  ctx.strokeStyle = actualStroke;
  ctx.strokeText(text, x, y);

  ctx.fillStyle = actualFill;
  ctx.fillText(text, x, y);

  return fontSize;
};
