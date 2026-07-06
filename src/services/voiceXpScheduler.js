const getGuildSettings = require("./guildSettings");
const giveXp = require("./giveXp");
const canEarnVoiceXp = require("./canEarnVoiceXp");

const { getAllSessions, updateLastAward } = require("./voiceLevelService");
const getRandomXp = require("../utils/getRandomXp");
const XP_SOURCES = require("../constants/xpSources");

module.exports = (client) => {
  setInterval(async () => {
    for (const session of getAllSessions()) {
      const guild = client.guilds.cache.get(session.guildId);

      if (!guild) continue;

      const member = await guild.members
        .fetch(session.userId)
        .catch(() => null);

      if (!member) continue;

      const settings = await getGuildSettings(guild.id);

      // ==========================
      // Voice Leveling Enabled
      // ==========================

      if (!settings.leveling.enabled) continue;
      if (!settings.leveling.voice.enabled) continue;

      // ==========================
      // Voice Eligibility
      // ==========================

      if (!canEarnVoiceXp(member, settings)) {
        continue;
      }

      // ==========================
      // Voice Cooldown
      // ==========================

      if (Date.now() - session.lastAward < settings.leveling.voice.cooldown) {
        continue;
      }

      // ==========================
      // Give XP
      // ==========================

      await giveXp({
        client,

        member,

        settings,

        xp: getRandomXp(
          settings.leveling.voice.minXp,
          settings.leveling.voice.maxXp,
        ),

        source: XP_SOURCES.VOICE,
      });

      // ==========================
      // Update Cooldown
      // ==========================

      updateLastAward(member);
    }
  }, 15_000);
};
