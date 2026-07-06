const GuildSettings = require("../models/guildSettingsSchema");

module.exports = async () => {
  const result = await GuildSettings.updateMany(
    {},
    {
      $set: {
        "settings.theme.colors.secondary": "#ff0000",
        "settings.theme.colors.background": "#141414",
      },
    },
  );

  console.log(`[Migration] Updated ${result.modifiedCount} guild setting(s).`);
};
