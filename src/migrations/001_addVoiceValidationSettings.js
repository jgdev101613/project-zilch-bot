const GuildSettings = require("../models/guildSettingsSchema");

module.exports = async () => {
  const result = await GuildSettings.updateMany(
    {},
    {
      $set: {
        "leveling.voice.allowSelfMute": true,
        "leveling.voice.allowSelfDeaf": true,
        "leveling.voice.allowServerMute": true,
        "leveling.voice.allowServerDeaf": true,
        "leveling.voice.allowAfkChannel": true,
      },
    },
  );

  console.log(`[Migration] Updated ${result.modifiedCount} guild setting(s).`);
};
