const GuildSettings = require("../models/guildSettingsSchema");

module.exports = async () => {
  const result = await GuildSettings.updateMany(
    {},
    {
      $set: {
        "settings.theme.font": "Arial",
        "settings.theme.colors.primary": "#ff5f03",
        "settings.theme.colors.outline": "#141414",
        "settings.theme.colors.text": "#ffffff",
      },
    },
  );

  console.log(`[Migration] Updated ${result.modifiedCount} guild setting(s).`);
};
