const Level = require("../../models/levelSchema");

module.exports = async function getLeaderboard(guildId, page = 1, limit = 10) {
  const requestedPage = Math.max(1, Number(page) || 1);

  const total = await Level.countDocuments({
    guildId,
  });

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(requestedPage, totalPages);
  const skip = (currentPage - 1) * limit;

  const users = await Level.find({ guildId })
    .sort({
      level: -1,
      xp: -1,
      userId: 1,
    })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    users,
    total,
    totalPages,
    currentPage,
  };
};
