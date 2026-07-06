const { loadImage } = require("@napi-rs/canvas");
const drawOutlinedText = require("../utils/drawOutlinedText");

/**
 * Draws the leaderboard header.
 *
 * @param {Object} render
 */
module.exports = async function drawLeaderboardHeader(render) {
  const { ctx, data, layout, theme } = render;

  const header = layout.header;

  // ==========================
  // Server Icon
  // ==========================

  if (data.guildIcon) {
    const icon = await loadImage(data.guildIcon);

    ctx.save();

    ctx.beginPath();
    ctx.arc(
      header.icon.x + header.icon.size / 2,
      header.icon.y + header.icon.size / 2,
      header.icon.size / 2,
      0,
      Math.PI * 2,
    );

    ctx.closePath();
    ctx.clip();

    ctx.drawImage(
      icon,
      header.icon.x,
      header.icon.y,
      header.icon.size,
      header.icon.size,
    );

    ctx.restore();
  }

  // ==========================
  // Server Name
  // ==========================

  drawOutlinedText(render, {
    text: data.guildName,

    x: header.title.x,
    y: header.title.y,

    maxWidth: 500,

    maxSize: 34,
    minSize: 20,

    fillStyle: theme.colors.text,
  });

  // ==========================
  // Leaderboard Title
  // ==========================

  drawOutlinedText(render, {
    text: "LEVEL LEADERBOARD",

    x: header.title.x,
    y: header.title.y + 38,

    maxWidth: 500,

    maxSize: 22,
    minSize: 18,
    // Uses theme.colors.primary by default
  });
};
