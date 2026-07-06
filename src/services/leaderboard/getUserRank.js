const Level = require("../../models/levelSchema");

module.exports = async function getUserRank(guildId, userId) {
  const user = await Level.findOne({
    guildId,
    userId,
  }).lean();

  if (!user) return null;

  const higherUsers = await Level.countDocuments({
    guildId,

    $or: [
      {
        level: {
          $gt: user.level,
        },
      },

      {
        level: user.level,
        xp: {
          $gt: user.xp,
        },
      },
    ],
  });

  return higherUsers + 1;
};
