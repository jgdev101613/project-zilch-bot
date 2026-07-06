const GuildSettings = require("../models/guildSettingsSchema");

module.exports = async function getGuildSettings(guildId) {
  let settings = await GuildSettings.findOne({
    guildId,
  });

  if (!settings) {
    settings = await GuildSettings.create({
      guildId,
    });
  }

  return settings;
};
