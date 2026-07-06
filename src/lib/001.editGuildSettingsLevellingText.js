const GuildSettings = require("../models/guildSettingsSchema");

module.exports = async () => {
  const result = await Level.GuildSettings(
    {},
    {
      $set: {
        "levelling.text.enabled": false,
        guildName: "",
      },
    },
  );

  console.log(`[Migration] Updated ${result.modifiedCount} guild setting(s).`);
};
