/**
 * Automatically reduces the font size until the text fits
 * within the specified width.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text
 * @param {Object} options
 * @param {number} options.maxWidth
 * @param {number} options.maxSize
 * @param {number} options.minSize
 * @param {string} options.family
 * @param {string} [options.weight="normal"]
 *
 * @returns {number} The font size that fits.
 */
module.exports = function fitText(
  ctx,
  text,
  { maxWidth, maxSize, minSize, family, weight = "normal" },
) {
  let size = maxSize;

  while (size >= minSize) {
    ctx.font = `${weight} ${size}px ${family}`;

    if (ctx.measureText(text).width <= maxWidth) {
      return size;
    }

    size--;
  }

  return minSize;
};
