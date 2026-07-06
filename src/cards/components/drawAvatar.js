const { loadImage } = require("@napi-rs/canvas");

/**
 * Draws a rounded progress bar.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} options
 */
module.exports = async function drawAvatar(render) {
  const { ctx, data, theme, layout } = render;
  const { avatar } = render.layout;
  const { avatarURL } = data;

  // ==========================
  // Avatar
  // ==========================

  const avatarImage = await loadImage(avatarURL);

  const avatarSize = avatar.size;
  const avatarX = avatar.x;
  const avatarY = avatar.y;

  ctx.save();

  ctx.beginPath();
  ctx.arc(
    avatarX + avatarSize / 2,
    avatarY + avatarSize / 2,
    avatarSize / 2,
    0,
    Math.PI * 2,
  );

  ctx.closePath();
  ctx.clip();

  ctx.drawImage(avatarImage, avatarX, avatarY, avatarSize, avatarSize);

  ctx.restore();

  // Avatar Border
  ctx.beginPath();
  ctx.arc(
    avatarX + avatarSize / 2,
    avatarY + avatarSize / 2,
    avatarSize / 2,
    0,
    Math.PI * 2,
  );

  ctx.lineWidth = avatar.borderWidth;
  ctx.strokeStyle = "#ff5f03";
  ctx.stroke();
};
