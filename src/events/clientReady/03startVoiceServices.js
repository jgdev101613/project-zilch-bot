const recoverVoiceSessions = require("../../services/recoverVoiceSessions");
const startVoiceXpScheduler = require("../../services/voiceXpScheduler");

let started = false;

module.exports = async (client) => {
  if (started) return;

  started = true;

  await recoverVoiceSessions(client);

  startVoiceXpScheduler(client);

  console.log("[E:Client Ready - VOICE] Voice services started.");
};
