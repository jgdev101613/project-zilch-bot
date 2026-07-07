const drawLeaderboardEntry = require("./drawLeaderboardEntry");
const drawOutlinedText = require("../utils/drawOutlinedText");

/**
 * Draws all leaderboard entries.
 *
 * @param {Object} render
 */
module.exports = async function drawLeaderboardEntries(render) {
  const { ctx, canvas, data, layout, theme } = render;

  const entries = layout.entries;

  // ==========================
  // Empty Leaderboard
  // ==========================

  if (!data.users.length) {
    drawOutlinedText(render, {
      text: "No one has earned XP yet!",
      x: canvas.width / 2,
      y: canvas.height / 2 - 15,
      maxWidth: 650,
      maxSize: 34,
      minSize: 24,
      textAlign: "center",
      fillStyle: theme.colors.text,
    });

    drawOutlinedText(render, {
      text: "Start chatting to become the first ranked member.",
      x: canvas.width / 2,
      y: canvas.height / 2 + 30,
      maxWidth: 650,
      maxSize: 22,
      minSize: 18,
      textAlign: "center",
      fillStyle: "#BEBEBE",
    });

    return;
  }

  // ==========================
  // Draw leaderboard rows
  // ==========================

  for (const [index, user] of data.users.entries()) {
    await drawLeaderboardEntry(render, {
      ...user,

      rank: (data.currentPage - 1) * data.pageSize + index + 1,

      x: entries.startX,
      y: entries.startY + index * (entries.height + entries.gap),

      width: entries.width,
      height: entries.height,
    });
  }
};
