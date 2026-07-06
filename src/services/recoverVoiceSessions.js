const { ChannelType } = require("discord.js");
const { startSession } = require("./voiceLevelService");

module.exports = async (client) => {
  let recovered = 0;

  for (const guild of client.guilds.cache.values()) {
    await guild.channels.fetch();

    for (const channel of guild.channels.cache.values()) {
      if (
        channel.type !== ChannelType.GuildVoice &&
        channel.type !== ChannelType.GuildStageVoice
      ) {
        continue;
      }

      for (const member of channel.members.values()) {
        if (member.user.bot) continue;

        startSession(member);
        recovered++;
      }
    }
  }

  console.log(
    `[E:Client Ready - VOICE] Recovered ${recovered} voice session(s).`,
  );
};
