const drawLeaderboardEntry = require("./drawLeaderboardEntry");

/**
 * Draws all leaderboard entries.
 *
 * @param {Object} render
 */
module.exports = async function drawLeaderboardEntries(render) {
  const { data, layout } = render;

  const entries = layout.entries;

  for (const [index, user] of data.users.entries()) {
    await drawLeaderboardEntry(render, {
      ...user,

      rank: (data.currentPage - 1) * 10 + index + 1,

      x: entries.startX,
      y: entries.startY + index * (entries.height + entries.gap),

      width: entries.width,
      height: entries.height,
    });
  }
};
