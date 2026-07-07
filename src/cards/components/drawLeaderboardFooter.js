const drawOutlinedText = require("../utils/drawOutlinedText");

/**
 * Draws page and requester rank information below the leaderboard entries.
 *
 * @param {Object} render
 */
module.exports = function drawLeaderboardFooter(render) {
  const { data, layout, theme } = render;
  const footer = layout.footer;
  const pageText = `Page ${data.currentPage} / ${data.totalPages}`;
  const rankText = data.yourRank
    ? `Your Rank: #${data.yourRank}`
    : "Your Rank: Unranked";

  drawOutlinedText(render, {
    text: pageText,
    x: footer.page.x,
    y: footer.y,
    maxWidth: 220,
    maxSize: 20,
    minSize: 16,
    fillStyle: theme.colors.text,
  });

  drawOutlinedText(render, {
    text: rankText,
    x: footer.rank.x,
    y: footer.y,
    maxWidth: 300,
    maxSize: 20,
    minSize: 16,
    fillStyle: theme.colors.text,
    textAlign: "right",
  });
};
