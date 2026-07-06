const Level = require("../../models/levelSchema");

module.exports = async function getLeaderboard(guildId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    Level.find({ guildId })
      .sort({
        level: -1,
        xp: -1,
        userId: 1,
      })
      .skip(skip)
      .limit(limit)
      .lean(),

    Level.countDocuments({
      guildId,
    }),
  ]);

  return {
    users,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
};
