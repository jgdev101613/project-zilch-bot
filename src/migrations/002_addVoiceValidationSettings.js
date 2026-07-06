const GuildSettings = require("../models/guildSettingsSchema");

module.exports = async () => {
  const result = await GuildSettings.updateMany(
    {},
    {
      $set: {
        "leveling.voice.validation.allowSelfMute": true,
        "leveling.voice.validation.allowSelfDeaf": true,
        "leveling.voice.validation.allowServerMute": true,
        "leveling.voice.validation.allowServerDeaf": true,
        "leveling.voice.validation.allowAfkChannel": true,
      },
      $unset: {
        "leveling.voice.allowSelfMute": "",
        "leveling.voice.allowSelfDeaf": "",
        "leveling.voice.allowServerMute": "",
        "leveling.voice.allowServerDeaf": "",
        "leveling.voice.allowAfkChannel": "",
      },
    },
  );

  console.log(`[Migration] Updated ${result.modifiedCount} guild setting(s).`);
};
