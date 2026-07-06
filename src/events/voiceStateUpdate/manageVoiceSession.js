const {
  startSession,
  stopSession,
  getSession,
} = require("../../services/voiceLevelService");

/**
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").VoiceState} oldState
 * @param {import("discord.js").VoiceState} newState
 */
module.exports = async (client, oldState, newState) => {
  const member = newState.member ?? oldState.member;

  if (!member) return;

  if (member.user.bot) return;

  const oldChannel = oldState.channel;
  const newChannel = newState.channel;

  // =====================
  // Joined VC
  // =====================

  if (!oldChannel && newChannel) {
    startSession(member);
    return;
  }

  // =====================
  // Left VC
  // =====================

  if (oldChannel && !newChannel) {
    stopSession(member);
    return;
  }

  // =====================
  // Switched VC
  // =====================

  if (oldChannel && newChannel && oldChannel.id !== newChannel.id) {
    stopSession(member);
    startSession(member);
    return;
  }

  // Same channel.
  // Ignore mute/deafen changes.
};
