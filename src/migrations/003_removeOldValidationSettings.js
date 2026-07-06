const GuildSettings = require("../models/guildSettingsSchema");

module.exports = async () => {
  const result = await GuildSettings.updateMany(
    {},
    {
      $unset: {
        "leveling.voice.allowSelfMute": "",
        "leveling.voice.allowSelfDeaf": "",
        "leveling.voice.allowServerMute": "",
        "leveling.voice.allowServerDeaf": "",
        "leveling.voice.allowAfkChannel": "",
      },
    },
  );

  console.log(
    `[Migration] Cleaned up legacy fields from ${result.modifiedCount} guild setting(s).`,
  );
};
