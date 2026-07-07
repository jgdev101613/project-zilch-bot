const { loadImage } = require("@napi-rs/canvas");
const drawOutlinedText = require("../utils/drawOutlinedText");
const formatNumber = require("../utils/formatNumber");

/**
 * Draws a single leaderboard entry.
 */
module.exports = async function drawLeaderboardEntry(render, entry) {
  const { ctx, theme, layout } = render;

  const col = layout.entries.columns;

  const {
    rank,
    displayName,
    username,
    avatarURL,
    level,
    totalXp,
    x,
    y,
    width,
    height,
  } = entry;

  // ==========================
  // Row background
  // ==========================

  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 12);

  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fill();

  // ==========================
  // Rank
  // ==========================

  let rankText = `${rank}.`;
  if (rank === 1) rankText = "1.";
  else if (rank === 2) rankText = "2.";
  else if (rank === 3) rankText = "3.";

  drawOutlinedText(render, {
    text: rankText,
    x: x + col.rank,
    y: y + 39,
    maxWidth: 50,
    maxSize: 24,
    minSize: 20,
  });

  // ==========================
  // Avatar
  // ==========================

  if (avatarURL) {
    const avatar = await loadImage(avatarURL);

    const size = 42;

    const avatarX = x + col.avatar;
    const avatarY = y + 9;

    ctx.save();
    ctx.beginPath();

    ctx.arc(avatarX + size / 2, avatarY + size / 2, size / 2, 0, Math.PI * 2);

    ctx.closePath();
    ctx.clip();

    ctx.drawImage(avatar, avatarX, avatarY, size, size);

    ctx.restore();
  }

  // ==========================
  // Display Name
  // ==========================

  drawOutlinedText(render, {
    text: displayName,
    x: x + col.name,
    y: y + 28,
    maxWidth: 280,
    maxSize: 22,
    minSize: 16,
    fillStyle: theme.colors.text,
  });

  // ==========================
  // Username
  // ==========================

  ctx.font = `16px "${theme.font}"`;
  ctx.fillStyle = "#BEBEBE";
  ctx.fillText(`@${username}`, x + col.name, y + 48);

  // ==========================
  // Level
  // ==========================

  drawOutlinedText(render, {
    text: `Lv. ${level}`,
    x: x + col.level,
    y: y + 39,
    maxWidth: 80,
    maxSize: 22,
    minSize: 16,
  });

  // ==========================
  // XP
  // ==========================

  drawOutlinedText(render, {
    text: `${formatNumber(totalXp)} XP`,
    x: x + col.xp,
    y: y + 39,
    maxWidth: 150,
    maxSize: 22,
    minSize: 16,
  });
};
