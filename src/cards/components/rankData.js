const formatNumber = require("../utils/formatNumber");
const drawOutlinedText = require("../utils/drawOutlinedText");

module.exports = function rankData(render) {
  const { data } = render;
  const { stats } = render.layout;
  const { requiredXp, rank, level, currentXp } = data;

  drawOutlinedText(render, {
    text: `Level ${level}`,
    x: stats.level.x,
    y: stats.level.y,

    maxWidth: stats.level.maxWidth,

    maxSize: 30,
    minSize: 18,
  });

  drawOutlinedText(render, {
    text: `Rank #${rank}`,
    x: stats.rank.x,
    y: stats.rank.y,

    maxWidth: stats.rank.maxWidth,

    maxWidth: 180,

    maxSize: 30,
    minSize: 18,
  });

  drawOutlinedText(render, {
    text: `${formatNumber(currentXp)} / ${formatNumber(requiredXp)} XP`,
    x: stats.xp.x,
    y: stats.xp.y,

    maxWidth: stats.xp.maxWidth,

    maxSize: 30,
    minSize: 18,
  });
};
