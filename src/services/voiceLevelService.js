const activeSessions = new Map();

function sessionKey(guildId, userId) {
  return `${guildId}:${userId}`;
}

function startSession(member) {
  const key = sessionKey(member.guild.id, member.id);

  // Don't recreate an existing session
  if (activeSessions.has(key)) {
    return;
  }

  const now = Date.now();

  activeSessions.set(key, {
    guildId: member.guild.id,
    userId: member.id,
    channelId: member.voice.channel.id,
    joinedAt: now,
    lastAward: now,
  });
}

function stopSession(member) {
  activeSessions.delete(sessionKey(member.guild.id, member.id));
}

function getSession(member) {
  return activeSessions.get(sessionKey(member.guild.id, member.id));
}

function updateLastAward(member) {
  const session = getSession(member);

  if (!session) return;

  session.lastAward = Date.now();
}

function getAllSessions() {
  return activeSessions.values();
}

module.exports = {
  startSession,
  stopSession,
  getSession,
  getAllSessions,
  updateLastAward,
};
