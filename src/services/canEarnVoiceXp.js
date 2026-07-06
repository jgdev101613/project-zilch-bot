/**
 * Determines whether a member is eligible to receive voice XP.
 *
 * @param {import("discord.js").GuildMember} member
 * @param {Object} settings
 * @returns {boolean}
 */
module.exports = function canEarnVoiceXp(member, settings) {
  if (!member) return false;

  // Ignore bots
  if (member.user.bot) return false;

  const voice = member.voice;

  // Must be connected
  if (!voice.channel) return false;

  // AFK Channel
  if (
    voice.channel.id === member.guild.afkChannelId &&
    !settings.leveling.voice.validation.allowAfkChannel
  ) {
    return false;
  }

  // Self Mute
  if (voice.selfMute && !settings.leveling.voice.validation.allowSelfMute) {
    return false;
  }

  // Self Deaf
  if (voice.selfDeaf && !settings.leveling.voice.validation.allowSelfDeaf) {
    return false;
  }

  // Server Mute
  if (voice.serverMute && !settings.leveling.voice.validation.allowServerMute) {
    return false;
  }

  // Server Deaf
  if (voice.serverDeaf && !settings.leveling.voice.validation.allowServerDeaf) {
    return false;
  }

  // Ignore configured channels
  if (settings.leveling.voice.ignoredChannels.includes(voice.channel.id)) {
    return false;
  }

  // Ignore configured roles
  const ignoredRole = member.roles.cache.some((role) =>
    settings.leveling.voice.ignoredRoles.includes(role.id),
  );

  if (ignoredRole) return false;

  // Require at least 2 non-bot users
  const activeMembers = voice.channel.members.filter((m) => !m.user.bot);

  if (activeMembers.size < settings.leveling.voice.minimumUsers) {
    return false;
  }

  return true;
};
