const GuildSettings = require("../models/guildSettingsSchema");

module.exports = async () => {
  const result = await GuildSettings.updateMany(
    {},
    {
      $set: {
        guildName: "",
      },
    },
  );

  console.log(`[Migration] Updated ${result.modifiedCount} guild setting(s).`);
};
