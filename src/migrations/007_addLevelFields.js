const Level = require("../models/levelSchema");

module.exports = async () => {
  const result = await Level.updateMany(
    {},
    {
      $set: {
        displayName: "",
        avatarURL: "",
      },
    },
  );

  console.log(`[Migration] Updated ${result.modifiedCount} guild setting(s).`);
};
